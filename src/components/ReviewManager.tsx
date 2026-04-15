import { useState } from "react";
import { ReviewSave } from "./ReviewSave";
import { ReviewViewer } from "./ReviewViewer";
import type { Review, DateValue } from "../types";
import { Calendar } from "./Calendar";

export function ReviewManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date());

  const onSaveReview = (newReview: Review) => {
    setReviews([...reviews, newReview]);
  };

  const onRemoveReview = (index: number) => {
    reviews[index]?.images?.forEach((url) => {
      URL.revokeObjectURL(url);
    });

  	setReviews(reviews.filter((_, i) => i !== index));
  };

  const onUpdateReview = (index: number, updated: Review) => {
    setReviews((prev) => {
      return prev.map((review, i) => (i===index?updated:review));
    });
  };

  return (
    <div className="review-manager">
      <ReviewSave onSaveReview={onSaveReview} />
	  <Calendar
        date={selectedDate}
        onChange={setSelectedDate}
      />
      
      <ReviewViewer
        reviews={
          reviews.filter((r) => {
            if (!(selectedDate instanceof Date)) return false;

            const dayStart = new Date(selectedDate);
            dayStart.setHours(0,0,0,0);

            const dayEnd = new Date(selectedDate);
            dayEnd.setHours(23,59,59,999);

            return r.schedule.occurrences({
              start: dayStart,
              end: dayEnd
            }).toArray().length > 0;
          })
        }
		onRemove={onRemoveReview}
        onUpdate={onUpdateReview}
	  />
    </div>
  );
}
