import type { Review } from "../types";

interface ExportButtonProps {
  reviews: Review[];
}

const pad = (n: number) => String(n).padStart(2, "0");

const formatIcsDate = (d: Date): string =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;

const nextDay = (d: Date): Date => {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + 1);
  return nd;
};

const escapeIcs = (s: string): string =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export function ExportButton({ reviews }: ExportButtonProps) {
  const handleExport = () => {
    const lines: string[] = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Revisões//StudyApp//PT-BR",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    for (const review of reviews) {
      const schedule = review.schedule as any;
      const summary = `SUMMARY:Revisão: ${escapeIcs(review.subject)}`;
      const description = `DESCRIPTION:${escapeIcs(review.notes ?? "")}`;

      // Regras recorrentes → eventos com RRULE (recorrência real no Google Calendar)
      const rrules: any[] = schedule.rrules ?? [];
      for (const rule of rrules) {
        const start = new Date(rule.options.start);
        const freq: string = rule.options.frequency;
        const interval: number = rule.options.interval ?? 1;
        lines.push(
          "BEGIN:VEVENT",
          `UID:${review.id}-rrule-${formatIcsDate(start)}@revisoes`,
          `DTSTART;VALUE=DATE:${formatIcsDate(start)}`,
          `DURATION:P1D`,
          `RRULE:FREQ=${freq};INTERVAL=${interval}`,
          summary,
          description,
          "END:VEVENT",
        );
      }

      // Datas únicas → eventos individuais de dia inteiro
      const datetimes: any[] = schedule.rdates?.datetimes ?? [];
      for (const dt of datetimes) {
        // dt pode ser um DateTime do rschedule (com `.date`) ou um objeto simples {year,month,day} vindo do servidor
        const date: Date = dt.date ?? new Date(dt.year, dt.month - 1, dt.day);
        lines.push(
          "BEGIN:VEVENT",
          `UID:${review.id}-${formatIcsDate(date)}@revisoes`,
          `DTSTART;VALUE=DATE:${formatIcsDate(date)}`,
          `DTEND;VALUE=DATE:${formatIcsDate(nextDay(date))}`,
          summary,
          description,
          "END:VEVENT",
        );
      }
    }

    lines.push("END:VCALENDAR");

    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "revisoes.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button type="button" className="export-btn" onClick={handleExport}>
      Exportar
    </button>
  );
}

export default ExportButton;
