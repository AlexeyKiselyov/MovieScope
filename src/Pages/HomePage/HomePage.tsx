import { useEffect, useState } from 'react';

import Container from '../../Components/Common/Container/Container';
import { MovieList } from '../../Components/MovieList/MovieList';
import { Loader } from '../../Components/Common/Loader/Loader';
import ErrorMassage from '../../Components/Common/ErrorMassage/ErrorMassage';
import LoadMoreBtn from '../../Components/LoadMoreBtn/LoadMoreBtn';

import { Movie } from '../../types/types';
import getTrendMovies from '../../serveсes/getTrendMovies';

import popcorn_image from '../../images/Popcorn.png';
import css from './homePage.module.css';
import Footer from '../../Components/Footer/Footer';
import { HomeSEO } from '../../Components/SEO/presets';

const STORAGE_KEY = 'homePageState';

interface SavedState {
  period: 'week' | 'day';
  page: number;
  movieId: string;
  movies: Movie[];
}

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState<'week' | 'day'>('week');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [restoredMovieId, setRestoredMovieId] = useState<string | null>(null);

  useEffect(() => {
    // Restore state from localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: SavedState = JSON.parse(saved);
        setMovies(parsed.movies);
        setPeriod(parsed.period);
        setPage(parsed.page);
        setRestoredMovieId(parsed.movieId);
        // Clear after restoring
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    getTrendMovies(
      setLoading,
      setError,
      setMovies,
      period,
      page,
      setTotalPages,
      signal
    );

    return () => {
      controller.abort();
    };
  }, [period, page]);

  useEffect(() => {
    if (restoredMovieId !== null && movies.length > 0) {
      // Scroll to the saved movie card
      const movieIndex = movies.findIndex(
        movie => movie.id === restoredMovieId
      );
      if (movieIndex !== -1) {
        const movieElement = document.querySelector(
          `[data-movie-id="${restoredMovieId}"]`
        );
        if (movieElement) {
          setTimeout(() => {
            movieElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            setRestoredMovieId(null);
          }, 200);
        }
      }
    }
  }, [restoredMovieId, movies]);

  const handleTrendPeriod = (newPeriod: 'week' | 'day') => {
    if (newPeriod === period) return;
    setMovies([]);
    setPage(1);
    setTotalPages(null);
    setPeriod(newPeriod);
  };

  const handlePage = () => {
    setPage(prev => prev + 1);
  };

  const isMorePages = totalPages !== null && totalPages > page;

  return (
    <>
      <Container>
        <HomeSEO />

        <div className={css.titleWrapper}>
          <h2 className={css.title}>Trending</h2>
          <img src={popcorn_image} alt="Popcorn" className={css.popcornImage} />
        </div>

        <div className={css.periodWrapper}>
          <div
            className={`${css.toggle} ${
              period === 'day' ? css.dayActive : css.weekActive
            }`}
            role="group"
            aria-label="Trending period switcher"
          >
            <div className={css.slider} aria-hidden="true" />
            <button
              type="button"
              onClick={() => handleTrendPeriod('week')}
              className={`${css.toggleBtn} ${
                period === 'week' ? css.active : ''
              }`}
              aria-pressed={period === 'week'}
            >
              Week
            </button>

            <button
              type="button"
              onClick={() => handleTrendPeriod('day')}
              className={`${css.toggleBtn} ${
                period === 'day' ? css.active : ''
              }`}
              aria-pressed={period === 'day'}
            >
              Day
            </button>
          </div>
        </div>

        <MovieList
          movies={movies}
          period={period}
          page={page}
          pageType="home"
        />

        {movies.length > 0 && isMorePages && (
          <LoadMoreBtn onMorePage={handlePage} />
        )}

        {error && <ErrorMassage />}

        {loading && !error && <Loader loading={loading} color="blue" />}
      </Container>

      <Footer />
    </>
  );
}
