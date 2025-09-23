import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '../Common/Loader/Loader';
import ErrorMassage from '../Common/ErrorMassage/ErrorMassage';

import MovieReviewItem from '../MovieReviewItem/MovieReviewItem';

import getMovieReviews from '../../serveсes/getMovieReviews';

import { LuSquarePen } from 'react-icons/lu';
import css from './movieReviews.module.css';

interface MovieReview {
  id: number;
  author: string;
  author_details: { avatar_path: string | null; rating: number };
  content: string;
  character: string;
}

export function MovieReviews() {
  const [reviews, setReviews] = useState<MovieReview[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reviewsRef = useRef<HTMLDivElement | null>(null);

  const { movieId } = useParams();

  useEffect(() => {
    if (!movieId) return;

    const controller = new AbortController();
    const signal = controller.signal;

    getMovieReviews(
      setLoading,
      setError,
      setReviews,
      movieId,
      signal,
      reviewsRef
    );

    return () => {
      controller.abort();
    };
  }, [movieId]);

  return (
    <>
      <div className={css.reviewsWrapper} ref={reviewsRef}>
        <div className={css.reviewTitleWrapper}>
          <h2 className={css.reviewsTitle}>Movie Revies</h2>
          <LuSquarePen size={40} />
        </div>

        {reviews.length !== 0 && (
          <ul className={css.reviewsList}>
            {reviews.map(review => (
              <li key={review.id} className={css.reviewsItem}>
                <MovieReviewItem
                  author={review.author}
                  content={review.content}
                  avatar={review.author_details.avatar_path}
                />
              </li>
            ))}
          </ul>
        )}

        {reviews.length === 0 && (
          <p className={css.noReviesText}>No revies...😒</p>
        )}
      </div>

      {error && <ErrorMassage />}

      <Loader loading={loading} color="blue" />
    </>
  );
}
