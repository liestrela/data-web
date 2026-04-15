import { useState } from "react";
import { addHours, addDays, addWeeks, addMonths } from "date-fns";
import { Schedule } from "../rschedule"

import type { TimeUnit, Review, ReviewPeriod } from "../types";
import { ReviewPeriodInput } from "./ReviewPeriodInput";

interface ReviewSaveProps {
  onSaveReview: (review: Review) => void;
}

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
}

export function ReviewSave({ onSaveReview }: ReviewSaveProps) {
  const [subject, setSubject] = useState("");
  const [periods, setPeriods] = useState<ReviewPeriod[]>([
    { many: 3, unit: "dias" },
  ]);

  const handleAddPeriod = () => {
    setPeriods([...periods, { many: 1, unit: "dias" }]);
  };

  const handlePeriodChange = (index: number, updatedPeriod: ReviewPeriod) => {
    setPeriods(periods.map((p, i) => (i === index ? updatedPeriod : p)));
  };

  const handleRemovePeriod = (index: number) => {
    setPeriods(periods.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!subject.trim() || periods.length === 0) return;

    const schedule = new Schedule({
      rdates: periods.map((period) => dateFromNow(period)),
    });

    const newReview: Review = {
      subject,
      periods,
      schedule,
    };

    onSaveReview(newReview);

    setSubject("");
    setPeriods([{ many: 3, unit: "dias" }]);
  };

  return (
    <div className="review-form">
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
          placeholder="O que eu estudei hoje?"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <button type="button" className="save-btn" onClick={handleSave}>
          Salvar
        </button>
      </form>
      <div className="review-periods-container">
        <div className="review-header">
          <span>Devo revisar isso</span>
        </div>
        {periods.map((period, index) => (
          <ReviewPeriodInput
            key={index}
            period={period}
            onChange={(updated) => handlePeriodChange(index, updated)}
            onRemove={() => handleRemovePeriod(index)}
            canRemove={periods.length > 1}
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
    </div>
  );
}

export default ReviewSave;
