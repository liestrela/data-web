import { formatDistanceToNow, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

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
		<div className="brief">
			<h2>Resumo da semana</h2>
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
						<div
							className="brief-subject"
							onClick={() => onSelectSubject(index)}
							key={index}
						>
							<div className="brief-subject-title">
								<span>{review.subject}</span>
							</div>
							<div className="brief-dates">
								{occ.map((o, o_idx) => (
									<div
										className="brief-date"
										key={o_idx}
									>
										{formatDistanceToNow(o.date, {
											addSufix: true,
											locale: ptBR
										})}
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default ReviewBrief;
