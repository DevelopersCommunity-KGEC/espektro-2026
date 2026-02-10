import { EventData } from "./events";

export interface TicketData {
  _id: string;
  userEmail: string;
  eventId: EventData; // Populated
  paymentId: string;
  qrCodeToken: string;
  status: "booked" | "checked-in" | "cancelled" | "pending";
  issueType: "payment" | "manual" | "pass";
  purchaseDate: string | Date;
  checkInTime?: string | Date;
  issuedBy?: string;
  teamMembers?: {
    name: string;
    email: string;
    phone: string;
  }[];
}
