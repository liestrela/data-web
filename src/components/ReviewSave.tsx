import { useState } from "react";
import type { Review, ReviewPeriod } from "../types";
import { ReviewPeriodInput } from "./ReviewPeriodInput";

interface ReviewSaveProps {
  onSaveReview: (review: Review) => void;
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
    const newReview: Review = { subject, periods };
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
