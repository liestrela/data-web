import { formatDistanceToNow, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import gradeNotepad from "../assets/thing.png"
import { ReviewBriefSubjectToReview } from "./ReviewBriefSubjectToReview";
import type { Review } from "../types";

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
		<div className="brief-container">
			<div className="spiral">
				<div className="spiral-left"></div>
				<div className="spiral-middle"></div>
				<div className="spiral-right"></div>
			</div>
			<div className="brief">
				<h2 className="brief-title">Revisões da Semana</h2>
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
							<ReviewBriefSubjectToReview
								key={review.id ?? index}
								index={index}
								review={review} 
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
