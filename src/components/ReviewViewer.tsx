import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

import type { Review } from "../types";
import { ReviewCard } from "./ReviewCard";

interface ReviewViewerProps {
  reviews: Review[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, updated: Review) => void;
}

export const ReviewViewer = forwardRef((props: ReviewViewerProps, ref) => {
  const { reviews, onRemove, onUpdate } = props;
  const cardBottomRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<number, HTMLDivElement>>(new Map());

  useImperativeHandle(ref, () => ({
    scrollToIndex(index: number) {
      const node = itemsRef.current.get(index);
      if (node) {
        node.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }));

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
	  </div>
    );
  }

  return (
    <div className="review-viewer">
      <div className="review-list">
        {reviews.map((review, index) => (
          <div
            key={review.id}
            ref={(node) => {
              if (node) itemsRef.current.set(index, node);
              else itemsRef.current.delete(index);
            }}>
            <ReviewCard 
              key={index}
              review={review}
              onRemove={() => onRemove(review.id)}
              onUpdate={(updated) => onUpdate(review.id, updated)}
            />
          </div>
        ))}
        <div ref={cardBottomRef} />
      </div>
    </div>
  );
});

export default ReviewViewer;
