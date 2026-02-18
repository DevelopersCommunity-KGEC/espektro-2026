import { NextResponse } from "next/server";

// Checkout is now handled client-side via Razorpay.
// This route is no longer used. Razorpay orders are created
// server-side in booking-actions.ts and the checkout modal
// is opened on the client via the Razorpay JS SDK.

export async function POST() {
  return NextResponse.json(
    { error: "Checkout is handled client-side via Razorpay" },
    { status: 410 },
  );
}
