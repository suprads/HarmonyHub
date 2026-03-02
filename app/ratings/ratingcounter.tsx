import styles from "./rating.module.css";
import { useState } from "react";

interface StarRatingCounter {
  rating: number;
  setRating: (rating: number) => void;
}

export default function RatingCounter({
  rating,
  setRating,
}: StarRatingCounter) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className={styles.ratingStars}>
      {[...Array(5)].map((_, index) => {
        const value = index + 1;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(null)}
          >
            <span className={styles.starSize}>★</span>
          </button>
        );
      })}
    </div>
  );
}
