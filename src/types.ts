export type TimeUnit = "horas" | "dias" | "semanas" | "meses";

export interface ReviewPeriod {
  many: number;
  unit: TimeUnit;
}

export interface Review {
  subject: string;
  periods: ReviewPeriod[];
}
