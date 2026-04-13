import type { Review } from "../types";

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
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
    </div>
  );
}
