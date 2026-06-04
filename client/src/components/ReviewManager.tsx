import { useState, useRef, useEffect } from "react";
import { startOfWeek, endOfWeek } from "date-fns";
import type { Review, DateValue } from "../types";
import type { ChangeEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { Schedule } from "../rschedule";

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
  const { authToken } = useAuth();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/card/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          const parsedReviews = data.map((card: any) => {
            const rdatesDates = card.schedule?.rdates?.datetimes?.map((dt: any) => 
              new Date(dt.year, dt.month - 1, dt.day, dt.hour, dt.minute, dt.second, dt.millisecond)
            ) || [];
            
            const schedule = new Schedule({
                rdates: rdatesDates
            });

            return {
              ...card,
              schedule
            } as Review;
          });
          setReviews(parsedReviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      }
    };

    if (authToken) {
      fetchReviews();
    }
  }, [authToken]);

  const onSaveReview = async (newReview: Review) => {
    try {
      const response = await fetch("http://localhost:3001/api/card/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          subject: newReview.subject,
          color: newReview.color || "#ffffff",
          periods: newReview.periods,
          schedule: newReview.schedule,
          notes: newReview.notes,
          images: newReview.images,
        }),
      });

      if (response.ok) {
        const createdCard = await response.json();
        setReviews([...reviews, { ...newReview, id: createdCard.id }]);
      }
    } catch (error) {
      console.error("Failed to save review", error);
    }
  };

  const onRemoveReview = async (id: number | string) => {
    try {
      const response = await fetch("http://localhost:3001/api/card/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const reviewToRemove = reviews.find((r) => r.id == id);
        if (reviewToRemove?.images) {
          for (const url of reviewToRemove.images) {
            try {
              await fetch("http://localhost:3001/api/upload/delete", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ imageUrl: url }),
              });
            } catch (err) {
              console.error("Erro ao deletar imagem", err);
            }
          }
        }

        setReviews(reviews.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error("Erro ao remover imagem", error);
    }
  };

  const onUpdateReview = async (id: number | string, updated: Review) => {
    try {
      const response = await fetch("http://localhost:3001/api/card/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          id,
          subject: updated.subject,
          color: updated.color,
          periods: updated.periods,
          schedule: updated.schedule,
          notes: updated.notes,
          images: updated.images,
        }),
      });

      if (response.ok) {
        setReviews((prev) => {
          return prev.map((review) => (review.id === id ? updated : review));
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar review", error);
    }
  };

  const isReviewToday = (r: Review) => {
    if (!(selectedDate instanceof Date)) return false;

    const dayStart = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(selectedDate);
    dayEnd.setHours(23, 59, 59, 999);

    return (
      r.schedule
        .occurrences({
          start: dayStart,
          end: dayEnd,
        })
        .toArray().length > 0
    );
  };

  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setByDay(e.target.value === "true");
  };

  const handleScroll = (index: number) => {
    const now = new Date();

    const reviewDay = reviews[index]?.schedule
      .occurrences({
        start: startOfWeek(now),
        end: endOfWeek(now),
      })
      .toArray()[0].date;

    setSelectedDate(reviewDay);

    viewerRef.current?.scrollToIndex(index);
  };

  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      dayEnd.setHours(23, 59, 59, 999);

      const hasReview = reviews.some((r) => {
        return (
          r.schedule
            .occurrences({
              start: dayStart,
              end: dayEnd,
            })
            .toArray().length > 0
        );
      });

      if (hasReview) {
        return "react-calendar-review";
      }
    }

    return '';
  };

  return (
    <div className="review-manager-container">
      <ReviewFilter onChange={handleFilterChange} />
      <div className="review-manager">
        <ReviewSave onSaveReview={onSaveReview} />

        <ReviewBrief reviews={reviews} onSelectSubject={handleScroll} />

        <div className="reviews-container-border">
          <div className="reviews-container">
            {byDay && (
              <Calendar
                date={selectedDate}
                onChange={setSelectedDate}
                tileClassName={getTileClassName}
              />
            )}
            <ReviewViewer
              ref={viewerRef}
              reviews={
                byDay ? reviews.filter((r) => isReviewToday(r)) : reviews
              }
              onRemove={onRemoveReview}
              onUpdate={onUpdateReview}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewManager;
