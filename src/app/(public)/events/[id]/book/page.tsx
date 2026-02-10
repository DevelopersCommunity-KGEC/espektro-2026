"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createOrder, verifyPayment } from "@/actions/booking-actions";
import { getPublicEventById } from "@/actions/event-actions";
import { validateCouponCode } from "@/actions/coupon-actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TicketPercent } from "lucide-react";
import { authClient } from "@/lib/auth-client"; 

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = authClient.useSession(); // Get session
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [validatingCode, setValidatingCode] = useState(false);

  // Authentication Check
  useEffect(() => {
    if (!isSessionLoading && !session) {
       // Redirect to login with proper callback
       const returnUrl = encodeURIComponent(window.location.pathname);
       router.push(`/login?callbackUrl=${returnUrl}`);
    }
  }, [session, isSessionLoading, router]);

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

  const handleApplyCode = async () => {
    if (!couponCode.trim()) return;
    setValidatingCode(true);
    try {
      const res = await validateCouponCode(couponCode);
      if (!res.valid) {
        toast.error(res.message || "Invalid code");
        setAppliedCode(null);
        setDiscountPercent(0);
      } else {
        // Check club ID match if event has clubId
        if (event.clubId && res.clubId !== event.clubId) {
          toast.error("This coupon is not valid for this event");
          setAppliedCode(null);
          setDiscountPercent(0);
        } else {
          setAppliedCode(couponCode);
          setDiscountPercent(res.discountPercentage!);
          toast.success(`Coupon applied! ${res.discountPercentage}% off`);
        }
      }
    } catch (e) {
      toast.error("Failed to validate code");
    } finally {
      setValidatingCode(false);
    }
  };

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // Create Order / Payment Session
      const order = await createOrder(id as string, appliedCode || undefined);

      // Handle Free Ticket Bypass
      if (order.key === "FREE_TICKET" || order.key === "PAYMENT_BYPASS") {
        const result = await verifyPayment(
          id as string,
          order.orderId,
          "PAYMENT_BYPASS_" + Math.random().toString(36).substring(7),
          "SIGNATURE_BYPASS",
          appliedCode || undefined
        );
        if (result.success) {
          toast.success("Ticket booked successfully!");
          router.push("/my-tickets");
        }
        return;
      }

      // Redirect to Dodo Checkout
      if (order.checkoutUrl) {
        window.location.href = order.checkoutUrl;
      } else {
        throw new Error("Failed to generate checkout URL");
      }

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
      setLoading(false);
    }
  };

  if (isSessionLoading || (loading && !event)) {
    return <div className="flex justify-center items-center py-20 min-h-[50vh]"><Loader2 className="animate-spin w-10 h-10 text-muted-foreground" /></div>;
  }

  if (error || !event) {
    return <div className="text-center py-20 text-red-500">{error || "Event not found"}</div>;
  }

  const price = event.price;
  const discountAmount = appliedCode ? Math.ceil((price * discountPercent) / 100) : 0;
  const finalPrice = Math.max(0, price - discountAmount);

  return (
    <div className="container max-w-lg mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Book Ticket: {event.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center text-lg">
            <span>Price</span>
            <span>₹{price}</span>
          </div>

          {/* Coupon Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Coupon Code</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter code (e.g. ABC-1234)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={!!appliedCode}
              />
              {appliedCode ? (
                <Button variant="destructive" onClick={() => {
                  setAppliedCode(null);
                  setDiscountPercent(0);
                  setCouponCode("");
                }}>Remove</Button>
              ) : (
                <Button onClick={handleApplyCode} disabled={validatingCode || !couponCode}>
                  {validatingCode ? <Loader2 className="animate-spin w-4 h-4" /> : "Apply"}
                </Button>
              )}
            </div>
            {appliedCode && (
              <div className="text-green-600 text-sm flex items-center gap-1">
                <TicketPercent className="w-4 h-4" />
                Coupon applied: -₹{discountAmount} ({discountPercent}%)
              </div>
            )}
          </div>

          <div className="border-t pt-4 flex justify-between items-center font-bold text-xl">
            <span>Total</span>
            <span>₹{finalPrice}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={handlePayment} disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            Pay ₹{finalPrice}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

