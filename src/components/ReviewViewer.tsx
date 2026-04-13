import type { Review } from "../types";
import { ReviewCard } from "./ReviewCard";

interface ReviewViewerProps {
  reviews: Review[];
  onRemove: (index: number) => void;
}

export function ReviewViewer({
  reviews,
  onRemove
}: ReviewViewerProps) {
  if (reviews.length === 0) {
    return (
      <div className="review-viewer empty">
	  	Nenhuma revisão cadastrada.
	  </div>
    );
  }

  return (
    <div className="review-viewer">
      <div className="review-list">
        {reviews.map((review, index) => (
          <ReviewCard 
		  	key={index}
			review={review}
			onRemove={() => onRemove(index)}
		  />
        ))}
      </div>
    </div>
  );
}
