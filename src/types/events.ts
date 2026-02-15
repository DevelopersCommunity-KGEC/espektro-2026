export interface EventData {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string | Date;
  venue: string;
  price: number;
  capacity: number;
  ticketsSold: number;
  maxTeamSize: number;
  allowMultipleBookings?: boolean;
  allowBooking?: boolean;
  isVisible: boolean;
  clubId: string;
  editors: string[];
  type: "fest-day" | "event";
  winners?: {
    position: number;
    teamName?: string;
    members?: string[];
  }[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  // Added for compatibility with EventCard
  eventPrice?: number | string;
  eventPrize?: number | string;
  eventImages?: { url: string }[];
  eventOrganiserClub?: { name: string; image: string };
  startTime: string | Date;
  endTime: string | Date;
  eventVenue?: string;
  eventCoordinators?: { name: string; phone: string }[];
  registrationLink?: string;
  brochureLink?: string;
}
