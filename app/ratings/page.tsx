"use client";

import styles from "./rating.module.css";
import RatingCounter from "./ratingcounter";
import { useState } from "react";

export default function RatingPage() {
  //variables for rating, messages, and potentially average rating display?
  const [name, setName] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Submit the rating to the server, need to set a point for this to be sent
    const res = await fetch("/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating }),
    });

    if (res.ok) {
      setMessage(`Thanks for rating "${name}"!`);
      setRating(0);
      setName("");
      fetchAverage(name);
    } else {
      setMessage("Something went wrong!");
    }
  }

  async function fetchAverage(songName: string) {
    const res = await fetch(`/ratings?name=${encodeURIComponent(songName)}`);
    const data = await res.json();
  }

  return (
    <div className="page">
      <div className={styles.divRatingPage}>
        <h1 className={styles.ratingHeader}>Rate a Song or Album</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter song or album name"
            className="w-full border rounded-md p-2 mb-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <RatingCounter rating={rating} setRating={setRating} />

          <button
            type="submit"
            className={styles.submitButton}
            disabled={rating === 0 || !name}
          >
            Submit Rating
          </button>
        </form>

        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
}
