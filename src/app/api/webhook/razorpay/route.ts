import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { verifyPayment } from "@/actions/booking-actions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 400 },
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Razorpay webhook signature mismatch");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 },
      );
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    if (event === "payment.captured") {
      const payment = payload.payload.payment.entity;
      const { notes } = payment;

      if (notes?.eventId && notes?.userId) {
        console.log(
          `Processing Razorpay webhook for payment ${payment.id}, order ${payment.order_id}`,
        );
        try {
          const teamMembers = notes.teamMembers
            ? JSON.parse(notes.teamMembers)
            : undefined;

          await verifyPayment(
            notes.eventId,
            payment.order_id,
            payment.id,
            "WEBHOOK_VERIFIED", // Bypass client signature check — webhook signature already verified above
            notes.couponCode || undefined,
            { userId: notes.userId, email: notes.email || "" },
            notes.referrerUserId || undefined,
            teamMembers,
          );
        } catch (err) {
          console.error("Webhook processing failed:", err);
        }
      }
    } else if (event === "payment.failed") {
      const payment = payload.payload.payment.entity;
      console.log("Payment failed:", payment.id, payment.error_description);
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing error" },
      { status: 500 },
    );
  }
}
