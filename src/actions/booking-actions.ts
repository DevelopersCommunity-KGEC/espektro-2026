"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";
import Coupon from "@/models/Coupon";
import { auth } from "@/lib/auth";
import { headers, cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { validateCouponCode } from "@/actions/coupon-actions";
import { validateUserReferral } from "@/lib/referral";
import Razorpay from "razorpay";
import crypto from "crypto";

const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
};

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function createOrder(
  eventId: string,
  couponCode?: string,
  teamMembers?: { name: string; email: string; phone: string }[],
) {
  const session = await getSession();
  if (!session) throw new Error("You must be logged in to book a ticket");

  await dbConnect();

  let finalPrice = 0;
  let eventTitle = "";
  let discountAmount = 0;
  let isEspektroEvent = false;

  // Handle Season Pass Bundle
  if (eventId === "season-pass") {
    isEspektroEvent = true;
    const festDays = await Event.find({ type: "fest-day" });
    if (!festDays || festDays.length === 0)
      throw new Error("No fest days found");

    // Calculate total price
    const totalPrice = festDays.reduce((acc, curr) => acc + curr.price, 0);

    // Check bundle availability (if any day is sold out, bundle is sold out)
    const isSoldOut = (
      await Promise.all(
        festDays.map(async (e) => {
          const sold = await Ticket.countDocuments({
            eventId: e._id,
            status: { $in: ["booked", "checked-in"] },
          });
          return e.capacity !== -1 && sold >= e.capacity;
        }),
      )
    ).some(Boolean);

    if (isSoldOut)
      throw new Error(
        "One or more fest days are sold out. Season pass unavailable.",
      );

    eventTitle = "Espektro Season Pass (All 4 Days)";
    finalPrice = totalPrice;

    if (couponCode) {
      const validation = await validateCouponCode(couponCode);
      if (!validation.valid)
        throw new Error(validation.message || "Invalid code");
      // Season pass belongs to main club 'espektro'
      if (validation.clubId !== "espektro")
        throw new Error("Coupon code not valid for Season Pass");

      discountAmount = Math.ceil(
        (totalPrice * validation.discountPercentage) / 100,
      );
      finalPrice = Math.max(0, totalPrice - discountAmount);
    }
  } else {
    // Standard Single Event
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (event.clubId === "espektro") {
      isEspektroEvent = true;
    }

    // Check if multiple bookings are allowed
    if (!event.allowMultipleBookings) {
      const existingTicket = await Ticket.findOne({
        userId: session.user.id,
        eventId: eventId,
        status: { $ne: "cancelled" },
      });
      if (existingTicket) {
        throw new Error("You have already booked a ticket for this event.");
      }
    }

    if (event.capacity !== -1) {
      const sold = await Ticket.countDocuments({
        eventId: eventId,
        status: { $in: ["booked", "checked-in"] },
      });
      if (sold >= event.capacity) throw new Error("Event is sold out");
    }

    // Validate Team Size
    if (teamMembers && teamMembers.length > 0) {
      if (teamMembers.length + 1 > (event.maxTeamSize || 1)) {
        throw new Error(`Team size exceeds limit of ${event.maxTeamSize}`);
      }
    }

    eventTitle = event.title;
    finalPrice = event.price;

    if (couponCode) {
      const validation = await validateCouponCode(couponCode);
      if (!validation.valid) {
        throw new Error(validation.message || "Invalid or used coupon code");
      }
      // Check if code matches event's club
      if (validation.clubId !== event.clubId) {
        throw new Error("Coupon code is not valid for this event");
      }
      discountAmount = Math.ceil(
        (event.price * validation.discountPercentage) / 100,
      );
      finalPrice = Math.max(0, event.price - discountAmount);
    }
  }

  // Check for User Referral (Attribution)
  const cookieStore = await cookies();
  const attributedCode = cookieStore.get("referral_source")?.value;
  let referrerUserId = "";

  if (attributedCode) {
    const referrer = await validateUserReferral(
      attributedCode,
      session.user.id,
    );
    if (referrer) {
      referrerUserId = referrer._id.toString();
    }
  }

  // Handle 100% discount / Free events
  if (finalPrice === 0) {
    return {
      orderId: "FREE_" + uuidv4(),
      amount: 0,
      currency: "INR",
      key: "FREE_TICKET",
      couponCode,
      referrerUserId,
    };
  }

  // Razorpay Order Creation
  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: finalPrice * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${eventId.slice(-8)}`,
      notes: {
        eventId: eventId,
        userId: session.user.id,
        email: session.user.email,
        couponCode: couponCode || "",
        referrerUserId: referrerUserId || "",
        discountAmount: String(discountAmount),
        eventTitle: eventTitle,
        ticketType: eventId === "season-pass" ? "BUNDLE" : "SINGLE",
        teamMembers: teamMembers ? JSON.stringify(teamMembers) : "",
      },
    });

    return {
      orderId: order.id,
      amount: finalPrice,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID!,
      couponCode,
      referrerUserId,
      name: session.user.name,
      email: session.user.email,
    };
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    throw new Error("Payment initialization failed");
  }
}

export async function verifyPayment(
  eventId: string,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  couponCode?: string,
  userContext?: { userId: string; email: string },
  referrerUserId?: string,
  teamMembers?: { name: string; email: string; phone: string }[],
) {
  const session = await getSession();

  let userId = session?.user?.id || userContext?.userId;
  let userEmail = session?.user?.email || userContext?.email;

  if (!userId || !userEmail) {
    throw new Error("Unauthorized: User context missing");
  }

  // Verify Razorpay Signature (skip for free/bypass tickets)
  if (
    razorpay_signature !== "SIGNATURE_BYPASS" &&
    razorpay_signature !== "WEBHOOK_VERIFIED"
  ) {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Payment verification failed: Invalid signature");
    }
  }

  await dbConnect();

  // --- SEASON PASS HANDLING ---
  if (eventId === "season-pass") {
    let appliedDiscount = 0; // Total bundle discount

    // 1. Consume Coupon Code if present
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
      });

      if (!coupon) throw new Error("Coupon code invalid or already used.");
      if (coupon.clubId !== "espektro")
        throw new Error("Coupon code not valid for Season Pass");

      if (coupon.type === "single-use") {
        const updated = await Coupon.findOneAndUpdate(
          { code: couponCode.toUpperCase(), isUsed: false },
          { isUsed: true, usedBy: userEmail, usedAt: new Date() },
        );
        if (!updated) {
          const alreadyUsed = await Coupon.findOne({
            code: couponCode.toUpperCase(),
            usedBy: userEmail,
          });
          if (!alreadyUsed)
            throw new Error("Coupon code invalid or already used.");
        }
      } else {
        // Multi-use: enforce limit dynamically
        const usageCount = await Ticket.countDocuments({
          couponCode: couponCode.toUpperCase(),
          status: { $in: ["booked", "checked-in", "pending"] },
        });
        if (coupon.maxUses && usageCount >= coupon.maxUses) {
          throw new Error("Coupon usage limit reached");
        }
      }
    }

    try {
      const festDays = await Event.find({ type: "fest-day" });
      if (!festDays || festDays.length === 0)
        throw new Error("No fest days found");

      const totalPrice = festDays.reduce((acc, curr) => acc + curr.price, 0);

      // 2. Check capacity for all events
      for (const event of festDays) {
        if (event.capacity === -1) continue;

        const soldCount = await Ticket.countDocuments({
          eventId: event._id,
          status: { $in: ["booked", "checked-in"] },
        });

        if (soldCount >= event.capacity) {
          throw new Error(`Sold out: ${event.title}. Bundle purchase failed.`);
        }
      }

      // Determine discount percentage if coupon was used
      let discountPercentage = 0;
      if (couponCode) {
        const ref = await Coupon.findOne({
          code: couponCode.toUpperCase(),
        });
        if (ref) discountPercentage = ref.discountPercentage;
      }

      // 3. Create Tickets
      const tickets = festDays.map((event) => {
        const itemDiscount = Math.ceil(
          (event.price * discountPercentage) / 100,
        );
        return {
          userId,
          userEmail,
          eventId: event._id,
          paymentId: razorpay_payment_id,
          status: "booked",
          issueType: couponCode ? "coupon" : "payment",
          qrCodeToken: uuidv4(),
          couponCode: couponCode ? couponCode.toUpperCase() : undefined,
          referrerUserId: referrerUserId || undefined,
          discountAmount: itemDiscount,
          price: Math.max(0, event.price - itemDiscount),
          teamMembers: teamMembers || [],
        };
      });

      await Ticket.insertMany(tickets);

      revalidatePath("/my-tickets");
      return { success: true };
    } catch (error) {
      if (couponCode) {
        await Coupon.findOneAndUpdate(
          { code: couponCode.toUpperCase() },
          { isUsed: false, usedBy: null, usedAt: null },
        );
      }
      throw error;
    }
  }

  // --- SINGLE EVENT HANDLING ---

  let issueType = "payment";
  let appliedDiscount = 0;

  // If coupon code is present, consume it FIRST
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) {
      throw new Error("Coupon code invalid or already used during processing.");
    }

    // Check club match
    const eventCheck = await Event.findById(eventId);
    if (!eventCheck) throw new Error("Event not found");
    if (coupon.clubId !== eventCheck.clubId)
      throw new Error("Coupon code mismatch.");

    if (coupon.type === "single-use") {
      const updated = await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase(), isUsed: false },
        {
          isUsed: true,
          usedBy: userEmail,
          usedAt: new Date(),
        },
      );

      if (!updated) {
        const alreadyUsed = await Coupon.findOne({
          code: couponCode.toUpperCase(),
          usedBy: userEmail,
        });
        if (!alreadyUsed) {
          throw new Error(
            "Coupon code invalid or already used during processing.",
          );
        }
      }
    } else {
      // Multi-use: enforce limit dynamically
      const usageCount = await Ticket.countDocuments({
        couponCode: couponCode.toUpperCase(),
        status: { $in: ["booked", "checked-in", "pending"] },
      });
      if (coupon.maxUses && usageCount >= coupon.maxUses) {
        throw new Error("Coupon usage limit reached");
      }
    }

    appliedDiscount = Math.ceil(
      (eventCheck.price * coupon.discountPercentage) / 100,
    );
    issueType = "coupon";
  }

  try {
    // Check Capacity
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (event.capacity !== -1) {
      const soldCount = await Ticket.countDocuments({
        eventId: eventId,
        status: { $in: ["booked", "checked-in"] },
      });
      if (soldCount >= event.capacity) {
        throw new Error(
          "Event capacity reached. Please contact support for refund.",
        );
      }
    }

    const ticket = await Ticket.create({
      userId: userId,
      userEmail: userEmail,
      eventId: eventId,
      paymentId: razorpay_payment_id,
      status: "booked",
      issueType,
      qrCodeToken: uuidv4(),
      couponCode: couponCode ? couponCode.toUpperCase() : undefined,
      referrerUserId: referrerUserId || undefined,
      discountAmount: appliedDiscount,
      price: Math.max(0, event.price - appliedDiscount),
      teamMembers: teamMembers || [],
    });

    revalidatePath("/my-tickets");
    return { success: true, ticketId: ticket._id.toString() };
  } catch (error: any) {
    // Rollback coupon if it was consumed but ticket creation failed
    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode },
        { isUsed: false, usedBy: null, usedAt: null },
      );
    }
    throw error;
  }
}
