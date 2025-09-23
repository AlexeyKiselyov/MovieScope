import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

import css from './movieList.module.css';

import placeholderImage from '../../images/Placeholder_Movie.jpg';

import { Movie } from '../../types/types';

export function MovieList({ movies }: { movies: Movie[] }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (visibleCount >= movies.length) return;

    const newItemsCount = movies.length - visibleCount;
    let index = 0;

    const interval = setInterval(() => {
      index++;
      setVisibleCount(prev => {
        const next = prev + 1;
        if (next >= movies.length) clearInterval(interval);
        return next;
      });

      if (index >= newItemsCount) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [movies, visibleCount]);

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
