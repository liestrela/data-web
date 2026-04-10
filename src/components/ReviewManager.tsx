import { useState } from "react";
import { ReviewSave } from "./ReviewSave";
import { ReviewViewer } from "./ReviewViewer";
import type { Review } from "../types";

export function ReviewManager() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const onSaveReview = (newReview: Review) => {
    setReviews([...reviews, newReview]);
  };

  return (
    <div className="review-manager">
      <ReviewSave onSaveReview={onSaveReview} />
      <ReviewViewer reviews={reviews} />
    </div>
  );
}
