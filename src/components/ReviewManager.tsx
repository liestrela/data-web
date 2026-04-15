import { useState, useRef } from "react";
import { startOfWeek, endOfWeek} from "date-fns";
import type { Review, DateValue } from "../types";

import ReviewSave from "./ReviewSave";
import ReviewViewer from "./ReviewViewer";
import ReviewBrief from "./ReviewBrief";
import Calendar from "./Calendar";

export function ReviewManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedDate, setSelectedDate] = useState<DateValue>(new Date());
  const [byDay, setByDay] = useState(false);
  const viewerRef = useRef<{ scrollToIndex: (index: number) => void }>(null);

  const onSaveReview = (newReview: Review) => {
    setReviews([...reviews, newReview]);
  };

  const onRemoveReview = (index: number) => {
    reviews[index]?.images?.forEach((url) => {
      URL.revokeObjectURL(url);
    });

  	setReviews(reviews.filter((_, i) => i !== index));
  };

  const onUpdateReview = (index: number, updated: Review) => {
    setReviews((prev) => {
      return prev.map((review, i) => (i===index?updated:review));
    });
  };

  const isReviewToday = (r: Review) => {
    if (!(selectedDate instanceof Date)) return false;

    const dayStart = new Date(selectedDate);
    dayStart.setHours(0,0,0,0);

    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23,59,59,999);

    return r.schedule.occurrences({
      start: dayStart,
      end: dayEnd
    }).toArray().length > 0;
  }

  const handleFilterChange = (e) => {
    setByDay(e.target.value === "true");
  };

  const handleScroll = (index: number) => {
    const now = new Date();

    const reviewDay = reviews[index].schedule.occurrences({
      start: startOfWeek(now),
      end: endOfWeek(now)
    }).toArray()[0].date;

    setSelectedDate(reviewDay);

    viewerRef.current?.scrollToIndex(index);
  }

  const getTileClassName = ({date, view}: {date: Date, view: string}) => {
    if (view === "month") {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      dayEnd.setHours(23, 59, 59, 999);
      
      const hasReview = reviews.some(r => {
        return r.schedule.occurrences({
          start: dayStart,
          end: dayEnd
        }).toArray().length > 0;
      });
      
      console.log(hasReview);

      if (hasReview) {
        return "react-calendar-review";
      }
    }

    return null;
  };

  return (
    <div className="review-manager">
      <ReviewSave onSaveReview={onSaveReview} />
	  
      <hr/>
      
      <ReviewBrief
        reviews={reviews}
        onSelectSubject={handleScroll}
      />

      <h2>Revisões</h2>
      <div className="filter-input-container">
        <span>Mostrar:</span>
        <select 
          className="filter-input"
          onChange={handleFilterChange}
        >
          <option value="false">todas</option>
          <option value="true">por dia</option>
        </select>
      </div>

      {byDay &&
        <Calendar
          date={selectedDate}
          onChange={setSelectedDate}
          tileClassName={getTileClassName}
        />
      }
     
      <ReviewViewer
        ref={viewerRef}
        reviews={
          byDay ? reviews.filter((r) => isReviewToday(r))
          : reviews
        }
		onRemove={onRemoveReview}
        onUpdate={onUpdateReview}
	  />
    </div>
  );
}

export default ReviewManager;
