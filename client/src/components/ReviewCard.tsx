import { useState, useEffect, useRef, type ChangeEvent } from "react";
import type { Review } from "../types";
import { ReviewImages } from "./ReviewImages";
import { startOfWeek, endOfWeek } from "date-fns";

interface ReviewCardProps {
  review: Review;
  onRemove: () => void;
  onUpdate: (updated: Review) => void;
  onClickCheck?: () => boolean;
}

const COLOR_OPTIONS: { label: string; value: string; bg: string }[] = [
  { label: "Amarelo", value: "yellow", bg: "#fef6ad" },
  { label: "Vermelho", value: "red", bg: "#f7a8a0" },
  { label: "Laranja", value: "orange", bg: "#ffd59e" },
  { label: "Verde", value: "green", bg: "#b8f0b0" },
];

const CLOSE_DURATION = 280;

export function ReviewCard({ review, onRemove, onUpdate, onClickCheck }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closingTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(closingTimer.current), []);

  useEffect(() => {
    if (!isExpanded || isClosing) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsClosing(true);
      closingTimer.current = setTimeout(() => {
        setIsExpanded(false);
        setIsClosing(false);
      }, CLOSE_DURATION);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded, isClosing]);

  const currentColor =
    COLOR_OPTIONS.find((c) => c.value === review.color) ?? COLOR_OPTIONS[0]!;

  const handleNoteChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    onUpdate({ ...review, notes: e.target.value });
  };

  const handleColorChange = (value: string) => {
    onUpdate({ ...review, color: value });
  };

  const toggleExpand = () => {
    if (!isExpanded) {
      if (onClickCheck && !onClickCheck()) return;
      setIsExpanded(true);
    } else {
      if (isClosing) return;
      setIsClosing(true);
      closingTimer.current = setTimeout(() => {
        setIsExpanded(false);
        setIsClosing(false);
      }, CLOSE_DURATION);
    }
  };

  const now = new Date();

  const getWeekOccurrences = (r: Review) => {
    return r.schedule
      .occurrences({
        start: startOfWeek(now),
        end: endOfWeek(now),
      })
      .toArray();
  };

  const cutString = (s: string, max: number) => {
    const r = s.slice(0, max);

    if (s.length >= max) return r + "...";
    else return r;
  };

  return (
    <>
      {isExpanded && (
        <div
          className={`card-overlay${isClosing ? " closing" : ""}`}
          onClick={isClosing ? undefined : toggleExpand}
        />
      )}

      <div className={`review-card-container${isExpanded ? " expanded" : ""}${isClosing ? " closing" : ""}`}>
        {!isExpanded && (
          <button
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            x
          </button>
        )}

        <div
          className={`review-card ${isExpanded ? "expanded" : ""}`}
          style={{ backgroundColor: currentColor.bg }}
          onClick={!isExpanded ? toggleExpand : undefined}
        >
          {isExpanded && (
            <button
              className="card-close-btn"
              onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
              title="Fechar (Esc)"
            >
              ✕
            </button>
          )}
          <div className="review-card-header">
            <h3 className="review-subject">{cutString(review.subject, 20)}</h3>
          </div>
          {!isExpanded && (
            <span className="review-note">
              {review.notes ? cutString(review.notes, 40) : "(sem anotações)"}
            </span>
          )}

          {isExpanded && (
            <div className="expanded-content">
              <div
                className="color-picker"
                onClick={(e) => e.stopPropagation()}
              >
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    className={`color-dot ${review.color === c.value || (!review.color && c.value === "yellow") ? "active" : ""}`}
                    style={{ backgroundColor: c.bg }}
                    title={c.label}
                    onClick={() => handleColorChange(c.value)}
                  />
                ))}
              </div>

              <ul className="period-list">
                {review.periods.map((period, index) => (
                  <li key={index} className="period-badge">
                    Daqui a {period.many} {period.unit}
                  </li>
                ))}
              </ul>

              <div className="review-attachments">
                <textarea
                  placeholder="Notas"
                  value={review.notes || ""}
                  onChange={handleNoteChange}
                  onClick={(e) => e.stopPropagation()}
                  className="notes-input"
                  rows={4}
                />

                <div onClick={(e) => e.stopPropagation()}>
                  <ReviewImages
                    attachments={review.attachments}
                    subject={review.subject}
                    onUpdateAttachments={(attachments) => onUpdate({ ...review, attachments })}
                  />
                </div>
              </div>

              <button className="save-btn" onClick={toggleExpand}>
                Concluído
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
