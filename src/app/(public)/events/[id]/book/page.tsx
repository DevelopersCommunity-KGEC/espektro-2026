"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createOrder, verifyPayment } from "@/actions/booking-actions";
import { getPublicEventById } from "@/actions/event-actions";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      const data = await getPublicEventById(id as string);
      if (!data) {
        setError("Event not found");
      } else {
        setEvent(data);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const order = await createOrder(id as string);

      // BYPASS: If we get the bypass key, skip Razorpay modal
      if (order.key === "rzp_test_bypass") {
        const result = await verifyPayment(
          id as string,
          order.orderId,
          "PAYMENT_BYPASS_" + Math.random().toString(36).substring(7),
          "SIGNATURE_BYPASS"
        );
        if (result.success) {
          router.push("/my-tickets");
        }
        return;
      }

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Espektro 2026",
        description: `Ticket for ${event.title}`,
        order_id: order.orderId,
        handler: async function (response: any) {
          try {
            const result = await verifyPayment(
              id as string,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            if (result.success) {
              router.push("/my-tickets");
            }
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed");
          }
        },
        prefill: {
          name: "", // Will be filled by Razorpay if user is logged in
          email: "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-600">{error}</div>;

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Confirm Booking</h1>
        <div className="border-b pb-4 mb-4">
          <p className="text-gray-600">Event</p>
          <p className="text-xl font-semibold">{event.title}</p>
        </div>
        <div className="border-b pb-4 mb-4">
          <p className="text-gray-600">Venue</p>
          <p className="text-lg">{event.venue}</p>
        </div>
        <div className="border-b pb-4 mb-6">
          <p className="text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-blue-600">₹{event.price}</p>
        </div>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Processing..." : "Pay & Book Now"}
        </button>
      </div>
    </div>
  );
}
