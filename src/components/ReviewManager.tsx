import { useState } from "react";
import { ReviewSave } from "./ReviewSave";
import { ReviewViewer } from "./ReviewViewer";
import type { Review } from "../types";

import { Calendar } from "./Calendar";

export function ReviewManager() {
  const [reviews, setReviews] = useState<Review[]>([]);

  const onSaveReview = (newReview: Review) => {
    setReviews([...reviews, newReview]);
  };

  const onRemoveReview = (index: number) => {
  	setReviews(reviews.filter((_, i) => i !== index));
  };

  return (
    <div className="review-manager">
      <ReviewSave onSaveReview={onSaveReview} />
	  <Calendar />
      <ReviewViewer
		reviews={reviews}
		onRemove={onRemoveReview}
	  />
    </div>
  );
}
