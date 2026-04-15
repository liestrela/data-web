import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

import type { Review } from "../types";
import { ReviewCard } from "./ReviewCard";

interface ReviewViewerProps {
  reviews: Review[];
  onRemove: (index: number) => void;
  onUpdate: (index: number, updated: Review) => void;
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
	  	Nenhuma revisão cadastrada.
	  </div>
    );
  }

  return (
    <div className="review-viewer">
      <div className="review-list">
        {reviews.map((review, index) => (
          <div
            key={index}
            ref={(node) => {
              if (node) itemsRef.current.set(index, node);
              else itemsRef.current.delete(index);
            }}>
            <ReviewCard 
              key={index}
              review={review}
              onRemove={() => onRemove(index)}
              onUpdate={(updated) => onUpdate(index, updated)}
            />
          </div>
        ))}
        <div ref={cardBottomRef} />
      </div>
    </div>
  );
});

export default ReviewViewer;
