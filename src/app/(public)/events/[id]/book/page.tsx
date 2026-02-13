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
import { Loader2, TicketPercent, Plus, Trash2, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Label } from "@/components/ui/label";

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

  // Team Members State
  const [teamMembers, setTeamMembers] = useState<{ name: string, email: string, phone: string }[]>([]);

  // Authentication Check
  useEffect(() => {
    if (!isSessionLoading && !session) {
      // Redirect to login with proper callback
      const returnUrl = encodeURIComponent(window.location.pathname);
      router.replace(`/login?callbackUrl=${returnUrl}`);
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

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", email: "", phone: "" }]);
  };

  const removeTeamMember = (index: number) => {
    const newMembers = [...teamMembers];
    newMembers.splice(index, 1);
    setTeamMembers(newMembers);
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newMembers = [...teamMembers];
    // @ts-ignore
    newMembers[index][field] = value;
    setTeamMembers(newMembers);
  };

  const handlePayment = async () => {
    if (loading) return;

    // Validate team members
    if (event.maxTeamSize > 1) {
      if (teamMembers.length + 1 > event.maxTeamSize) {
        toast.error(`Max team size is ${event.maxTeamSize}`);
        return;
      }
      for (const member of teamMembers) {
        if (!member.name || !member.email || !member.phone) {
          toast.error("Please fill all team member details");
          return;
        }
      }
    }

    setLoading(true);
    try {
      // Create Order / Payment Session
      const order = await createOrder(id as string, appliedCode || undefined, teamMembers);

      // Handle Free Ticket Bypass
      if (order.key === "FREE_TICKET" || order.key === "PAYMENT_BYPASS") {
        const result = await verifyPayment(
          id as string,
          order.orderId,
          "PAYMENT_BYPASS_" + Math.random().toString(36).substring(7),
          "SIGNATURE_BYPASS",
          appliedCode || undefined,
          undefined,
          undefined,
          teamMembers
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
            <span>Entry Fees</span>
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

          {/* Team Members Section */}
          {event?.maxTeamSize > 1 && (
            <div className="space-y-4 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Members ({teamMembers.length + 1}/{event.maxTeamSize})
                </Label>
                {(teamMembers.length + 1 < event.maxTeamSize) && (
                  <Button variant="outline" size="sm" onClick={addTeamMember} type="button">
                    <Plus className="w-4 h-4 mr-1" /> Add Member
                  </Button>
                )}
              </div>

              {teamMembers.map((member, index) => (
                <div key={index} className="grid gap-3 p-3 border rounded-lg relative bg-muted/20">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 text-destructive hover:bg-destructive/10"
                    onClick={() => removeTeamMember(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <div className="grid grid-cols-1 gap-2">
                    <Label>Member {index + 1} Name</Label>
                    <Input
                      placeholder="Full Name"
                      value={member.name}
                      onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label>Email</Label>
                      <Input
                        placeholder="Email"
                        type="email"
                        value={member.email}
                        onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Phone</Label>
                      <Input
                        placeholder="Phone"
                        type="tel"
                        value={member.phone}
                        onChange={(e) => updateTeamMember(index, "phone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {teamMembers.length === 0 && (
                <div className="text-sm text-muted-foreground italic">
                  Registering as a team? Add your team members here. You are the Leader.
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-4 flex justify-between items-center font-bold text-xl">
            <span>Total</span>
            <span>₹{finalPrice}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={handlePayment} disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            {finalPrice === 0 ? "Confirm Booking" : `Pay ₹${finalPrice}`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

