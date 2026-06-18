import { useEffect, useRef, useImperativeHandle, forwardRef, useState, useCallback } from "react";

import type { Review } from "../types";
import { ReviewCard } from "./ReviewCard";

const CARD_W = 150;
// padding-top(10) + remove-btn(25) + gap(8) + card(150)
const CARD_CONTAINER_H = 193;
const GAP = 20;
const BOARD_PADDING = 20;

interface ReviewViewerProps {
  reviews: Review[];
  onRemove: (id: string | number) => void;
  onUpdate: (id: string | number, updated: Review) => void;
}

type Pos = { x: number; y: number };

export const ReviewViewer = forwardRef((props: ReviewViewerProps, ref) => {
  const { reviews, onRemove, onUpdate } = props;
  const boardRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<number, HTMLDivElement>>(new Map());
  const [positions, setPositions] = useState<Map<string | number, Pos>>(new Map());

  const draggingId = useRef<string | number | null>(null);
  const dragStartMouse = useRef<Pos>({ x: 0, y: 0 });
  const dragStartCard = useRef<Pos>({ x: 0, y: 0 });
  const wasDragging = useRef(false);

  useImperativeHandle(ref, () => ({
    scrollToIndex(index: number) {
      const node = itemsRef.current.get(index);
      if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
    },
  }));

  const calcGridPos = useCallback((index: number): Pos => {
    const cw = boardRef.current?.clientWidth ?? 400;
    const cols = Math.max(1, Math.floor((cw - BOARD_PADDING * 2 + GAP) / (CARD_W + GAP)));
    return {
      x: BOARD_PADDING + (index % cols) * (CARD_W + GAP),
      y: BOARD_PADDING + Math.floor(index / cols) * (CARD_CONTAINER_H + GAP),
    };
  }, []);

  useEffect(() => {
    setPositions((prev) => {
      const next = new Map(prev);
      reviews.forEach((r, i) => {
        if (!next.has(r.id)) next.set(r.id, calcGridPos(i));
      });
      return next;
    });
  }, [reviews, calcGridPos]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (draggingId.current === null) return;

      const dx = e.clientX - dragStartMouse.current.x;
      const dy = e.clientY - dragStartMouse.current.y;

      if (!wasDragging.current && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        wasDragging.current = true;
        document.body.classList.add("dragging");
      }

      if (!wasDragging.current) return;

      const board = boardRef.current;
      if (!board) return;

      const newX = Math.max(0, Math.min(board.clientWidth - CARD_W, dragStartCard.current.x + dx));
      const newY = Math.max(0, dragStartCard.current.y + dy);

      setPositions((prev) => {
        const next = new Map(prev);
        next.set(draggingId.current!, { x: newX, y: newY });
        return next;
      });
    };

    const onUp = () => {
      draggingId.current = null;
      document.body.classList.remove("dragging");
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const boardH = Math.max(
    400,
    ...Array.from(positions.values()).map((p) => p.y + CARD_CONTAINER_H + BOARD_PADDING)
  );

  if (reviews.length === 0) {
    return <div className="review-viewer empty"></div>;
  }

  return (
    <div className="review-viewer">
      <div className="review-list" ref={boardRef} style={{ height: boardH }}>
        {reviews.map((review, index) => {
          const pos = positions.get(review.id);
          if (!pos) return null;
          return (
            <div
              key={review.id}
              className="review-card-wrapper"
              ref={(node) => {
                if (node) itemsRef.current.set(index, node);
                else itemsRef.current.delete(index);
              }}
              style={{ left: pos.x, top: pos.y }}
              onMouseDown={(e) => {
                if ((e.target as HTMLElement).closest("button, textarea, input, a")) return;
                e.preventDefault();
                draggingId.current = review.id;
                wasDragging.current = false;
                dragStartMouse.current = { x: e.clientX, y: e.clientY };
                dragStartCard.current = { ...pos };
              }}
            >
              <ReviewCard
                review={review}
                onRemove={() => onRemove(review.id)}
                onUpdate={(updated) => onUpdate(review.id, updated)}
                onClickCheck={() => {
                  if (wasDragging.current) {
                    wasDragging.current = false;
                    return false;
                  }
                  return true;
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default ReviewViewer;
