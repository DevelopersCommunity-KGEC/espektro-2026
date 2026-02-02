export interface EventProps {
  poster: string;
  title: string;
  description: string;
  organisingClub: string;
  rules?: Array<string>;
  entryFee?: string;
  coordinator?: string;
  venue: string;
  prize?: 'string';
  date: Date;
  time: Date;
}

export interface EventDayProps {
  day: number;
  events: EventData[];
}

export interface EventSectionProps {
  label: string;
  description: string;
  days: EventDayProps[];
}


export interface EventData {
  id?: number; // Make id optional
  _id?: string; // Add _id as an alternative
  title: string;
  description: string;
  rules: string;
  prizes: string;
  tagLine: string;
  startTime: string;
  endTime: string;
  eventVenue: string;
  eventImages: Array<{
    url: string;
    _id: string;
  }>;
  eventType: string;
  eventMinParticipants: number;
  eventMaxParticipants: number;
  eventPrice: number;
  eventPriceForKGEC: number;
  eventPrize: number;
  eventOrganiserClub: {
    name: string;
    image: string;
  };
  eventCoordinators: Array<{
    name: string;
    phone: string;
    _id: string;
  }>;
  createdBy: string;
  sponsors: Array<{
    name: string;
    type: string;
    image: string;
    _id: string;
  }>;
  eventWinList: Array<{
    userId: string;
    userName: string;
    userCollege: string;
    position: number;
    prize: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
  otherPlatformUrl: string;
  brochureLink: string;
  registrationLink: string;
}
