"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTicketById, confirmPayment } from "@/actions/ticket-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        params.then(p => setId(p.id));
    }, [params]);
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!id) return;
        const fetchTicket = async () => {
            try {
                const data = await getTicketById(id);
                if (!data) {
                    throw new Error("Ticket not found");
                }
                if (data.status !== 'pending') {
                    // If already booked, redirect to my tickets
                    router.push('/my-tickets');
                    return;
                }
                setTicket(data);
            } catch (error) {
                toast.error("Failed to load ticket details");
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id, router]);

    const handlePayment = async () => {
        setProcessing(true);
        // Simulate network delay
        await new Promise(r => setTimeout(r, 1500));

        try {
            const res = await confirmPayment(id!);
            if (res.success) {
                toast.success("Payment Successful! Your ticket has been booked.");
                router.push('/my-tickets');
            }
        } catch (error: any) {
            toast.error(error.message || "Payment Failed");
            setProcessing(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!ticket) {
        return <div className="text-center py-12">Ticket not found</div>;
    }

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Complete Payment</CardTitle>
                    <CardDescription>Confirm your booking for {ticket.eventId.title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Event</span>
                            <span className="font-medium">{ticket.eventId.title}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Date</span>
                            <span className="font-medium">{new Date(ticket.eventId.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 mt-2">
                            <span className="font-bold">Total Amount</span>
                            <span className="font-bold text-lg text-blue-600">₹{ticket.eventId.price}</span>
                        </div>
                    </div>
                    <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded border border-yellow-200">
                        ⚠️ This is a mock payment gateway. No actual money will be deducted.
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handlePayment} disabled={processing} className="w-full text-lg h-12">
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                Pay ₹{ticket.eventId.price}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
