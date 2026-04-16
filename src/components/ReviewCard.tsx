import { type ChangeEvent } from "react";
import type { Review } from "../types";
import { ReviewImages } from "./ReviewImages";

interface ReviewCardProps {
  review: Review;
  onRemove: () => void;
  onUpdate: (updated: Review) => void;
}

export function ReviewCard({
	review,
	onRemove,
    onUpdate
}: ReviewCardProps) {

  const handleNoteChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ ...review, notes: e.target.value });
  };

  return (
	<div className="review-card-container">
	  <button
	  	className="remove-btn"
		onClick={onRemove}
	  >
	    x
	  </button>
      <div className="review-card">
        <div className="review-card-header">
		  <h3 className="review-subject">{review.subject}</h3>
        </div>

		{
		/*
		<ul className="period-list">
          {review.periods.map((period, index) => (
            <li key={index} className="period-badge">
              Daqui a {period.many} {period.unit}
            </li>
          ))}
        </ul>
		*/
		}

        <div className="review-attachments">
          <textarea
            placeholder="Notas"
            value={review.notes || ""}
            onChange={handleNoteChange}
            className="notes-input"
            rows={3}
          />
		  {
		  /*
          <ReviewImages
            images={review.images}
            subject={review.subject}
            onUpdateImages={(images) => onUpdate({ ...review, images })}
          />
		  */
		  }
        </div>
      </div>
	</div>
  );
}

export default ReviewCard;
