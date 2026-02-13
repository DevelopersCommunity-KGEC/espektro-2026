import { EventData } from "./events";

export interface TicketData {
  _id: string;
  userEmail: string;
  eventId: EventData; // Populated
  paymentId: string;
  qrCodeToken: string;
  status: "booked" | "checked-in" | "cancelled" | "pending";
  issueType: "payment" | "manual" | "pass" | "coupon";
  purchaseDate: string | Date;
  checkInTime?: string | Date;
  issuedBy?: string;
  price: number; // Final amount paid at time of booking
  discountAmount?: number; // Discount applied (if any)
  couponCode?: string;
  teamMembers?: {
    name: string;
    email: string;
    phone: string;
  }[];
}
