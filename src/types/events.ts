export interface EventData {
  _id: string;
  title: string;
  description: string;
  image: string;
  date: string | Date; // Can be string in JSON serialization
  venue: string;
  price: number;
  capacity: number;
  ticketsSold: number;
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
}
