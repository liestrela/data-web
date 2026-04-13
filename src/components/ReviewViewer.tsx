import { useEffect, useRef } from "react";

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
  const cardBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reviews.length > 0) {
      cardBottomRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  }, [reviews.length]);

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
        <div ref={cardBottomRef} />
      </div>
    </div>
  );
}
