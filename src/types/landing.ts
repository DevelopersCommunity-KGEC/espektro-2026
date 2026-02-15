export interface GanttEvent {
  _id: string;
  name: string;
  category:
    | "technical"
    | "cultural"
    | "food"
    | "gaming"
    | "ceremony"
    | "sports";
  startHour: number;
  duration: number;
  prize?: string;
  venue?: string;
}

export interface DaySchedule {
  day: string;
  date: string;
  label: string;
  events: GanttEvent[];
}

export type Artist = {
  name: string;
  genre: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  bg: string;
  social: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
};

export type GalleryImage = {
  src: string;
  alt: string;
  span: string;
};

export type Contact = {
  name: string;
  role: string;
  phone: string;
};

export type Sponsor = {
  label: string;
  size: string;
  items: string[];
};

export type SponsorLogo = {
  id: number;
  sponsor: string;
  url: string;
};

export type ClubLogo = {
  id: number;
  name: string;
  image: string;
  social_link: string;
};

export type PastArtist = {
  id: string;
  url: string;
};

export type Era = {
  era: string;
  period: string;
  title: string;
  body: string;
};

export type Stat = {
  value: string;
  label: string;
};

export type HeritageItem = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
};

export type NavLink = {
  label: string;
  href: string;
};
