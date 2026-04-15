import { useState, useRef } from "react";
import { startOfWeek, endOfWeek} from "date-fns";
import type { Review, DateValue } from "../types";

import ReviewFilter from "./ReviewFilter";
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

  const onRemoveReview = (id: string) => {
    reviews.find((r) => r.id==id)?.images?.forEach((url) => {
      URL.revokeObjectURL(url);
    });

  	setReviews(reviews.filter((r) => r.id !== id));
  };

  const onUpdateReview = (id: string, updated: Review) => {
    setReviews((prev) => {
      return prev.map((review) => (review.id===id?updated:review));
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

      <div className="reviews">
      <h2>Revisões</h2>
      <ReviewFilter onChange={handleFilterChange} />
      {byDay &&
        <Calendar
          date={selectedDate}
          onChange={setSelectedDate}
          tileClassName={getTileClassName}
        />
      }
      </div>
     
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
