"use server";

import dbConnect from "@/lib/db";
import Event from "@/models/Event";
import Ticket from "@/models/Ticket";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
// import Razorpay from "razorpay";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

// const razorpay =
//   process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
//     ? new Razorpay({
//         key_id: process.env.RAZORPAY_KEY_ID,
//         key_secret: process.env.RAZORPAY_KEY_SECRET,
//       })
//     : null;

async function getSession() {
  return await auth.api.getSession({
    headers: await headers(),
  });
}

export async function createOrder(eventId: string) {
  const session = await getSession();
  if (!session) throw new Error("You must be logged in to book a ticket");

  await dbConnect();
  const event = await Event.findById(eventId);
  if (!event) throw new Error("Event not found");
  if (event.ticketsSold >= event.capacity) throw new Error("Event is sold out");

  // if (!razorpay) {
  console.warn("Razorpay keys missing. Returning mock order.");
  return {
    orderId: "ORDER_BYPASS_" + uuidv4(),
    amount: event.price * 100,
    currency: "INR",
    key: "rzp_test_bypass",
  };
  // }

  // const options = {
  //   amount: event.price * 100, // amount in the smallest currency unit
  //   currency: "INR",
  //   receipt: `receipt_${uuidv4().substring(0, 8)}`,
  // };

  // const order = await razorpay.orders.create(options);
  // return {
  //   orderId: order.id,
  //   amount: order.amount,
  //   currency: order.currency,
  //   key: process.env.RAZORPAY_KEY_ID,
  // };
}

export async function verifyPayment(
  eventId: string,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  // const body = razorpay_order_id + "|" + razorpay_payment_id;
  // const expectedSignature = crypto
  //   .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
  //   .update(body.toString())
  //   .digest("hex");

  // if (expectedSignature !== razorpay_signature) {
  //   throw new Error("Invalid payment signature");
  // }

  await dbConnect();

  // Atomic check and increment
  const event = await Event.findOneAndUpdate(
    { _id: eventId, ticketsSold: { $lt: "$capacity" } },
    { $inc: { ticketsSold: 1 } },
    { new: true }
  );

  if (!event) {
    // This is an edge case where capacity was reached between order creation and verification
    // In a real app, you'd trigger a refund here.
    throw new Error(
      "Event capacity reached. Please contact support for refund."
    );
  }

  const ticket = await Ticket.create({
    userId: session.user.id,
    userEmail: session.user.email,
    eventId: eventId,
    paymentId: razorpay_payment_id,
    qrCodeToken: uuidv4(),
    status: "booked",
  });

  revalidatePath("/my-tickets");
  return { success: true, ticketId: ticket._id };
}
