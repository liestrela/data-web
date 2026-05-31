import { Schedule } from "./rschedule";

export type TimeUnit = "horas" | "dias" | "semanas" | "meses";

export type DateValuePiece = Date | null;
export type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

export interface ReviewPeriod {
  many: number;
  unit: TimeUnit;
}

export interface Review {
  id: string,
  subject: string;
  periods: ReviewPeriod[];
  schedule: Schedule;
  notes?: string,
  images?: string[];
  color?: string;
}
