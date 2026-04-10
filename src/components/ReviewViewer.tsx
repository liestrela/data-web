import type { Review } from "../types";
import { ReviewCard } from "./ReviewCard";

interface ReviewViewerProps {
  reviews: Review[];
}

export function ReviewViewer({ reviews }: ReviewViewerProps) {
  if (reviews.length === 0) {
    return (
      <div className="review-viewer empty">Nenhuma revisão cadastrada.</div>
    );
  }

  return (
    <div className="review-viewer">
      <div className="review-list">
        {reviews.map((review, index) => (
          <ReviewCard key={index} review={review} />
        ))}
      </div>
    </div>
  );
}
