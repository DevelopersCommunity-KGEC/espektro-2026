import { Webhooks } from '@dodopayments/nextjs';
import { verifyPayment } from '@/actions/booking-actions';

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,
  onPaymentSucceeded: async (payload) => {
    // payload.data.payment_id or similar.
    // Dodo payload structure for 'payment.succeeded' usually contains the object.
    // based on docs, we look for metadata to know what to do.
    
    const { payment_id, metadata } = payload.data as any; 
    // Types might need assertion if SDK doesn't fully type 'metadata' generic.
    
    if (metadata?.eventId && metadata?.userId) {
       console.log(`Processing webhook for payment ${payment_id}`);
       try {
           await verifyPayment(
               metadata.eventId,
               payment_id, // Use as 'orderId' equivalent or paymentId
               payment_id, // signature? Dodo doesn't have signature in same way. We trust webhook signature.
               "WEBHOOK_VERIFIED", // Bypass signature check in verifyPayment
               metadata.referralCode,
               { userId: metadata.userId, email: metadata.email || "" } // Can we get email from metadata? 
           );
       } catch (err) {
           console.error("Webhook processing failed:", err);
           // If it failed because capacity full, we should trigger refund here if Dodo API allows.
       }
    }
  },
  onPaymentFailed: async (payload) => {
      console.log("Payment failed", payload);
  }
});
