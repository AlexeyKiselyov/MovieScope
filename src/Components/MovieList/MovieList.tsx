import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

import css from './movieList.module.css';

import placeholderImage from '../../images/Placeholder_Movie.jpg';

import { Movie } from '../../types/types';

const STORAGE_KEY_HOME = 'homePageState';
const STORAGE_KEY_MOVIES = 'moviesPageState';

export function MovieList({
  movies,
  period = 'week',
  page = 1,
  pageType = 'home',
  query,
}: {
  movies: Movie[];
  period?: 'week' | 'day';
  page?: number;
  pageType?: 'home' | 'movies';
  query?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const location = useLocation();

  const handleCardClick = (movieId: string) => {
    const key = pageType === 'home' ? STORAGE_KEY_HOME : STORAGE_KEY_MOVIES;
    const state =
      pageType === 'home'
        ? { period, page, movieId, movies }
        : { query, page, movieId, movies };
    localStorage.setItem(key, JSON.stringify(state));
  };

  useEffect(() => {
    if (page === 1) {
      // Reset and animate only for the first page
      setVisibleCount(0);
      if (movies.length === 0) return;

      let index = 0;

      const interval = setInterval(() => {
        index++;
        setVisibleCount(prev => {
          const next = prev + 1;
          if (next >= movies.length) clearInterval(interval);
          return next;
        });

        if (index >= movies.length) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    } else {
      // For subsequent pages, show all immediately
      setVisibleCount(movies.length);
    }
  }, [movies, page]);

  return (
    <ul className={css.list}>
      {movies.map((item, index) => (
        <li
          key={`${item.id}-${index}`}
          className={`${css.item} ${index < visibleCount ? css.visible : ''}`}
        >
          <Link
            to={`/movies/${item.id}`}
            state={{ from: location }}
            className={css.link}
            onClick={() => handleCardClick(item.id)}
            data-movie-id={item.id}
            aria-label={`Open movie ${item.title}. Rating ${
              typeof item.vote_average === 'number'
                ? item.vote_average.toFixed(1)
                : 'N/A'
            } out of 10`}
          >
            {/* Rating badge */}
            {typeof item.vote_average === 'number' && (
              <span
                className={`${css.ratingBadge} ${
                  item.vote_average >= 7
                    ? css.good
                    : item.vote_average >= 5
                    ? css.medium
                    : css.bad
                }`}
                aria-label={`Rating ${item.vote_average.toFixed(1)}`}
                title={`Rating: ${item.vote_average.toFixed(1)}`}
              >
                <FaStar size={12} className={css.starIcon} aria-hidden="true" />
                {item.vote_average.toFixed(1)}
              </span>
            )}
            <img
              src={
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${item.poster_path}`
                  : placeholderImage
              }
              alt={item.title}
              className={css.poster}
              loading="lazy"
            />
            {!item.poster_path && (
              <span className={css.movieName}>{item.title}</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
