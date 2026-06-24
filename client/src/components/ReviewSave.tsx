import { useState, useRef } from "react";
import { addHours, addDays, addWeeks, addMonths } from "date-fns";
import { Schedule, Rule } from "../rschedule";
import { v4 as uuidv4 } from "uuid";

import type { TimeUnit, Review, ReviewPeriod } from "../types";
import { ReviewPeriodInput } from "./ReviewPeriodInput";

interface ReviewSaveProps {
  onSaveReview: (review: Review) => void;
}

type PeriodEntry = { key: number; period: ReviewPeriod };

const unitToFrequency = (unit: TimeUnit): "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY" =>
  ({ horas: "HOURLY", dias: "DAILY", semanas: "WEEKLY", meses: "MONTHLY" } as const)[unit];

const dateFromNow = (period: ReviewPeriod) => {
  const now = new Date();

  switch (period.unit) {
    case "horas":
      return addHours(now, period.many);

    case "dias":
      return addDays(now, period.many);

    case "semanas":
      return addWeeks(now, period.many);

    case "meses":
      return addMonths(now, period.many);
  }
};

export function ReviewSave({ onSaveReview }: ReviewSaveProps) {
  const [subject, setSubject] = useState("");
  const [periods, setPeriods] = useState<PeriodEntry[]>([
    { key: 0, period: { many: 3, unit: "dias" } },
  ]);
  const [removingKeys, setRemovingKeys] = useState<Set<number>>(new Set());
  const nextKey = useRef(1);

  const handleAddPeriod = () => {
    const key = nextKey.current++;
    setPeriods((prev) => [...prev, { key, period: { many: 1, unit: "dias" } }]);
  };

  const handlePeriodChange = (key: number, updatedPeriod: ReviewPeriod) => {
    setPeriods((prev) => prev.map((e) => (e.key === key ? { ...e, period: updatedPeriod } : e)));
  };

  const handleRemovePeriod = (key: number) => {
    setRemovingKeys((prev) => new Set(prev).add(key));
    setTimeout(() => {
      setPeriods((prev) => prev.filter((e) => e.key !== key));
      setRemovingKeys((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 220);
  };

  const handleSave = () => {
    const activePeriods = periods
      .filter((e) => !removingKeys.has(e.key))
      .map((e) => e.period);

    if (!subject.trim() || activePeriods.length === 0) return;

    const rdates = activePeriods.filter((p) => !p.recurrent).map(dateFromNow);
    const rrules = activePeriods
      .filter((p) => p.recurrent)
      .map((p) => new Rule({ frequency: unitToFrequency(p.unit), interval: p.many, start: dateFromNow(p) }));

    const schedule = new Schedule({ rdates, rrules });

    const newReview: Review = {
      id: uuidv4(),
      subject,
      periods: activePeriods,
      schedule,
    };

    onSaveReview(newReview);

    setSubject("");
    setPeriods([{ key: nextKey.current++, period: { many: 3, unit: "dias" } }]);
    setRemovingKeys(new Set());
  };

  return (
    <div className="review-form-border">
      <div className="review-form">
        <h2 className="subject-input-title">O que eu estudei hoje?</h2>

        <form
          className="subject-input"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <input
            type="text"
            name="subject"
            placeholder="Descreva o que foi estudado"
            autoComplete="off"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </form>

        <div className="review-periods-container">
          <h2>Quando revisar?</h2>
          {periods.map((entry) => (
            <ReviewPeriodInput
              key={entry.key}
              period={entry.period}
              onChange={(updated) => handlePeriodChange(entry.key, updated)}
              onRemove={() => handleRemovePeriod(entry.key)}
              canRemove={periods.length > 1 && !removingKeys.has(entry.key)}
              isRemoving={removingKeys.has(entry.key)}
            />
          ))}
          <button
            type="button"
            className="add-period-btn"
            onClick={handleAddPeriod}
          >
            +
          </button>
        </div>

        <button type="button" className="save-btn" onClick={handleSave}>
          Salvar
        </button>
      </div>
    </div>
  );
}

export default ReviewSave;
