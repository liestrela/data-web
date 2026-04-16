import { formatDistanceToNow, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import gradeNotepad from "../assets/thing.png"
import { ReviewBriefSujectToReview } from "./ReviewBriefsubjectToReview";

interface ReviewBriefProps {
	reviews: Review[];
	onSelectSubject: (index: number) => void;
}

export function ReviewBrief({
	reviews,
	onSelectSubject
}: ReviewBriefProps) {
	const now = new Date();
	const getWeekOccurrences = (r: Review) => {
		return r.schedule.occurrences({
			start: startOfWeek(now),
			end: endOfWeek(now)
		}).toArray();
	};
	const hasReviewsThisWeek = reviews.some(r =>
		getWeekOccurrences(r).length > 0
	);

	return (
    <div className="brief-containter">
      <h2>Resumo da semana</h2>
      <img src={gradeNotepad} alt="" />
      <div className="brief">
        {!hasReviewsThisWeek && (
          <div className="review-viewer empty">
            Nenhuma revisão essa semana.
          </div>
        )}
        <div className="brief-subjects">
          {reviews.map((review, index) => {
            const occ = getWeekOccurrences(review);
            if (occ.length===0) return null;
            return (
              <ReviewBriefSujectToReview index={index} review={review} 
                weekOcurrences={occ}  
                onSelectSubject={onSelectSubject}
              />
            );
          })}
        </div>
      </div>
    </div>
	);
}

export default ReviewBrief;
