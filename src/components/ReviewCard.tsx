import { useState, type ChangeEvent } from "react";
import type { Review } from "../types";
import { ReviewImages } from "./ReviewImages";
import { startOfWeek, endOfWeek } from "date-fns";

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

	const now = new Date();

	const getWeekOccurrences = (r: Review) => {
			return r.schedule.occurrences({
				start: startOfWeek(now),
				end: endOfWeek(now)
			}).toArray();
		};

	const cutString = (s: string, max: number) => {
		const r = s.slice(0, max);

		if (s.length>=max) return r+"...";
		else return r;
	};

	return (
		<>
			{isExpanded && <div className="card-overlay" onClick={toggleExpand} />}

			<div 
				className={`review-card-container ${isExpanded ? "expanded" : ""}`}
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
				
				<div className="review-card" onClick={!isExpanded ? toggleExpand : undefined}>
					<div className="review-card-header">
						<h3 className="review-subject">
							{cutString(review.subject, 20)}
						</h3>
					</div>
					{!isExpanded && (
					<span className="review-note">
						{review.notes ? cutString(review.notes, 40) : "(sem anotações)"}
					</span>
					)}

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