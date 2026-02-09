export interface GanttEvent {
  name: string;
  category: "tech" | "cultural" | "food" | "gaming" | "ceremony";
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
