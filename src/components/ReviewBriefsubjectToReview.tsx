import { formatDistanceToNow, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

export function ReviewBriefSujectToReview({index, review, weekOcurrences, onSelectSubject}) {
  return (
    <div
    className="brief-subject"
    onClick={() => onSelectSubject(index)}
    key={index}
    >
      <h2>{review.subject}</h2>
      {weekOcurrences.map((o, o_idx) => (
          <p className="brief-date" key={o_idx}>
          {formatDistanceToNow(o.date, {
              addSufix: true,
              locale: ptBR
          })}
          </p>
      ))}
    </div>
  );
}