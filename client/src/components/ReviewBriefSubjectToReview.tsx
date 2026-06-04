import { formatDistanceToNow, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Review } from "../types";
import type { StandardDateAdapter } from "../rschedule";

interface ReviewBriefSubjectToReviewProps {
  index: number;
  review: Review;
  weekOcurrences: StandardDateAdapter[];
  onSelectSubject: (index: number) => void;
}

export function ReviewBriefSubjectToReview({
  index,
  review,
  weekOcurrences,
  onSelectSubject,
}: ReviewBriefSubjectToReviewProps) {
  return (
    <div
      className="brief-subject"
      onClick={() => onSelectSubject(index)}
      key={index}
    >
      <h2>· {review.subject}</h2>
      {weekOcurrences.map((o, o_idx) => (
        <p className="brief-date" key={o_idx}>
          {formatDistanceToNow(o.date, {
            addSuffix: true,
            locale: ptBR,
          })}
        </p>
      ))}
    </div>
  );
}
