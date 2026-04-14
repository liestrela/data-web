import { ChangeEvent } from "react";

import type { Review } from "../types";

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

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImgURLs = Array.from(files).map((f) => URL.createObjectURL(f));

    onUpdate({
      ...review,
      images: [...(review.images || []), ...newImgURLs],
    });

    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    if (!review.images) return;

    URL.revokeObjectURL(review.images[idx]);

    const fImgs = review.images.filter((_, i) => i!==idx);

    onUpdate({ ...review, images: fImgs });
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
            values={review.notes || ""}
            onChange={handleNoteChange}
            className="notes-input"
            rows={3}
          />
          <div className="image-upload">
            <span>Adicionar imagens</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              id={`file-upload-${review.subject}`}
            />
            <div className="image-preview">
              {review.images?.map((url, idx) => (
                <div key={idx}>
                  <img src={url} />
                  <button 
                    className="remove-btn"
                    onClick={() => removeImage(idx)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
	</div>
  );
}
