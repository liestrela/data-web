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
    reviews[index].images?.forEach((url) => {
      url.revokeObjectURL(url);
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
	  <Calendar />
      <ReviewViewer
		reviews={reviews}
		onRemove={onRemoveReview}
        onUpdate={onUpdateReview}
	  />
    </div>
  );
}
