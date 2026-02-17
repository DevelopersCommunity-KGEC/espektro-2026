"use client";

import React, { useEffect, useState, useMemo } from "react";
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
import Script from "next/script";
import * as z from "zod";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const teamMemberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").regex(/^[0-9+\-\s]+$/, "Invalid phone number"),
});

type TeamMember = z.infer<typeof teamMemberSchema>;

export default function BookingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = authClient.useSession();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [validatingCode, setValidatingCode] = useState(false);

  // Team Members State (Member 0 = the logged-in user, prefilled & read-only)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [memberErrors, setMemberErrors] = useState<Record<number, Record<string, string>>>({});

  // Authentication Check
  useEffect(() => {
    if (!isSessionLoading && !session) {
      const returnUrl = encodeURIComponent(window.location.pathname);
      router.replace(`/login?callbackUrl=${returnUrl}`);
    }
  }, [session, isSessionLoading, router]);

  // Initialize member 1 as the logged-in user whenever session loads
  useEffect(() => {
    if (session?.user) {
      setTeamMembers((prev) => {
        const userMember: TeamMember = {
          name: session.user.name || "",
          email: session.user.email || "",
          phone: (session.user as any).phone || "",
        };
        if (prev.length === 0) return [userMember];
        // Always keep index 0 synced with the logged-in user
        return [userMember, ...prev.slice(1)];
      });
    }
  }, [session]);

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
    if (index === 0) return; // Cannot remove the logged-in user
    const newMembers = [...teamMembers];
    newMembers.splice(index, 1);
    setTeamMembers(newMembers);
    // Clear errors for removed member and re-index
    const newErrors = { ...memberErrors };
    delete newErrors[index];
    setMemberErrors(newErrors);
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    if (index === 0) return; // Member 1 (user) is read-only
    const newMembers = [...teamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setTeamMembers(newMembers);
    // Clear the specific field error on change
    if (memberErrors[index]?.[field]) {
      const newErrors = { ...memberErrors };
      const fieldErrors = { ...newErrors[index] };
      delete fieldErrors[field];
      newErrors[index] = fieldErrors;
      setMemberErrors(newErrors);
    }
  };

  const validateTeamMembers = (): boolean => {
    const errors: Record<number, Record<string, string>> = {};
    let isValid = true;

    for (let i = 0; i < teamMembers.length; i++) {
      const result = teamMemberSchema.safeParse(teamMembers[i]);
      if (!result.success) {
        isValid = false;
        errors[i] = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0] as string;
          errors[i][field] = issue.message;
        }
      }
    }

    // Check for duplicate emails
    const emails = teamMembers.map((m) => m.email.toLowerCase().trim()).filter(Boolean);
    const seen = new Set<string>();
    for (let i = 0; i < emails.length; i++) {
      if (seen.has(emails[i])) {
        isValid = false;
        if (!errors[i]) errors[i] = {};
        errors[i].email = "Duplicate email address";
      }
      seen.add(emails[i]);
    }

    setMemberErrors(errors);
    return isValid;
  };

  const handlePayment = async () => {
    if (loading) return;

    // Validate team members
    if (event.maxTeamSize > 1) {
      if (teamMembers.length > event.maxTeamSize) {
        toast.error(`Max team size is ${event.maxTeamSize}`);
        return;
      }
      if (!validateTeamMembers()) {
        toast.error("Please fix the team member errors");
        return;
      }
    }

    setLoading(true);
    try {
      // Send team members excluding the first one (the user themselves)
      const extraMembers = teamMembers.slice(1);
      const order = await createOrder(id as string, appliedCode || undefined, extraMembers);

      // Handle Free Ticket
      if (order.key === "FREE_TICKET") {
        const result = await verifyPayment(
          id as string,
          order.orderId,
          "FREE_" + order.orderId,
          "SIGNATURE_BYPASS",
          appliedCode || undefined,
          undefined,
          undefined,
          extraMembers
        );
        if (result.success) {
          toast.success("Ticket booked successfully!");
          router.push("/my-tickets");
        }
        return;
      }

      // Razorpay Checkout
      if (!razorpayLoaded || !window.Razorpay) {
        toast.error("Payment gateway is loading. Please try again.");
        setLoading(false);
        return;
      }

      const options = {
        key: order.key,
        amount: order.amount * 100,
        currency: order.currency,
        name: "Espektro 2026",
        description: event.title,
        order_id: order.orderId,
        prefill: {
          name: order.name || "",
          email: order.email || "",
        },
        theme: {
          color: "#6366f1",
        },
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            const result = await verifyPayment(
              id as string,
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              appliedCode || undefined,
              undefined,
              order.referrerUserId || undefined,
              extraMembers
            );
            if (result.success) {
              toast.success("Payment successful! Ticket booked.");
              router.push("/my-tickets");
            }
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        toast.error(response.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      razorpay.open();
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
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        strategy="lazyOnload"
      />
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
                    Team Members ({teamMembers.length}/{event.maxTeamSize})
                  </Label>
                  {(teamMembers.length < event.maxTeamSize) && (
                    <Button variant="outline" size="sm" onClick={addTeamMember} type="button">
                      <Plus className="w-4 h-4 mr-1" /> Add Member
                    </Button>
                  )}
                </div>

                {teamMembers.map((member, index) => {
                  const isUser = index === 0;
                  const errors = memberErrors[index] || {};
                  return (
                    <div key={index} className={`grid gap-3 p-3 border rounded-lg relative ${isUser ? 'bg-primary/5 border-primary/20' : 'bg-muted/20'}`}>
                      {!isUser && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 h-6 w-6 text-destructive hover:bg-destructive/10"
                          onClick={() => removeTeamMember(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}

                      <div className="grid grid-cols-1 gap-2">
                        <Label className="flex items-center gap-2">
                          Member {index + 1} Name
                          {isUser && <span className="text-xs text-primary font-normal">(You — Team Leader)</span>}
                        </Label>
                        <Input
                          placeholder="Full Name"
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                          disabled={isUser}
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Label>Email</Label>
                          <Input
                            placeholder="Email"
                            type="email"
                            value={member.email}
                            onChange={(e) => updateTeamMember(index, "email", e.target.value)}
                            disabled={isUser}
                            className={errors.email ? 'border-red-500' : ''}
                          />
                          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>
                        <div className="space-y-1">
                          <Label>Phone</Label>
                          <Input
                            placeholder="Phone"
                            type="tel"
                            value={member.phone}
                            onChange={(e) => updateTeamMember(index, "phone", e.target.value)}
                            disabled={isUser}
                            className={errors.phone ? 'border-red-500' : ''}
                          />
                          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
    </>
  );
}

