import { useState, type ChangeEvent } from "react";
import type { Review } from "../types";
import { ReviewImages } from "./ReviewImages";

interface ReviewCardProps {
  review: Review;
  onRemove: () => void;
  onUpdate: (updated: Review) => void;
}

export function ReviewCard({ review, onRemove, onUpdate }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNoteChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
    onUpdate({ ...review, notes: e.target.value });
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <>
      {isExpanded && <div className="card-overlay" onClick={toggleExpand} />}

      <div 
        className={`review-card-container ${isExpanded ? "expanded" : ""}`}
        onClick={!isExpanded ? toggleExpand : undefined}
      >
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
        
        <div className="review-card">
          <div className="review-card-header">
            <h3 className="review-subject">{review.subject}</h3>
          </div>

          {isExpanded && (
            <div className="expanded-content">
              {/* Seção de Períodos reativada */}
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
                
                {/* Seção de Imagens reativada e protegida contra propagação de clique */}
                <div onClick={(e) => e.stopPropagation()}>
                  <ReviewImages
                    images={review.images}
                    subject={review.subject}
                    onUpdateImages={(images) => onUpdate({ ...review, images })}
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