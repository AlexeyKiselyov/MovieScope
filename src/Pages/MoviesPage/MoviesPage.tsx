import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { MovieList } from '../../Components/MovieList/MovieList';
import Container from '../../Components/Common/Container/Container';
import Footer from '../../Components/Footer/Footer';
import ErrorMassage from '../../Components/Common/ErrorMassage/ErrorMassage';
import { Loader } from '../../Components/Common/Loader/Loader';

import findMovie from '../../serveсes/findMovie';

import { Movie } from '../../types/types';

import { MdSearch } from 'react-icons/md';
import { LuTextSearch } from 'react-icons/lu';
import css from './moviesPage.module.css';
import LoadMoreBtn from '../../Components/LoadMoreBtn/LoadMoreBtn';
import { MoviesSEO } from '../../Components/SEO/presets';

const STORAGE_KEY_MOVIES = 'moviesPageState';

interface SavedStateMovies {
  query: string;
  page: number;
  movieId: string;
  movies: Movie[];
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [restoredMovieId, setRestoredMovieId] = useState<string | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('query') ?? '';

  useEffect(() => {
    // Restore state from localStorage
    const saved = localStorage.getItem(STORAGE_KEY_MOVIES);
    if (saved) {
      try {
        const parsed: SavedStateMovies = JSON.parse(saved);
        setMovies(parsed.movies);
        setPage(parsed.page);
        setRestoredMovieId(parsed.movieId);
        setSearchParams({ query: parsed.query });
        // Clear after restoring
        localStorage.removeItem(STORAGE_KEY_MOVIES);
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
  }, [setSearchParams]);

  useEffect(() => {
    if (query === '') {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    findMovie(
      setLoading,
      setError,
      setMovies,
      query,
      page,
      setTotalPages,
      signal
    );

    return () => {
      controller.abort();
    };
  }, [query, page]);

  useEffect(() => {
    if (restoredMovieId !== null && movies.length > 0) {
      // Scroll to the saved movie card
      const movieElement = document.querySelector(
        `[data-movie-id="${restoredMovieId}"]`
      );
      if (movieElement) {
        setTimeout(() => {
          movieElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setRestoredMovieId(null);
        }, 200);
      }
    }
  }, [restoredMovieId, movies]);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const form = event.currentTarget;
    const queryInput = form.elements.namedItem('query') as HTMLInputElement;
    const query = queryInput.value;

    queryInput.blur();

    const updateSearchParams = new URLSearchParams(searchParams);

    if (query !== '') {
      updateSearchParams.set('query', query);
    } else {
      updateSearchParams.delete('query');
    }

    setSearchParams(updateSearchParams);

    form.reset();
  };

  const handlePage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const isMorePages = totalPages !== null && totalPages > page;

  return (
    <>
      <Container>
        <MoviesSEO query={query} />

        <div className={css.titleWrapper}>
          <h2 className={css.title}>Find a movie by title</h2>
          <LuTextSearch size={45} />
        </div>

        <form onSubmit={onFormSubmit} className={css.form}>
          <label htmlFor="query"></label>
          <input
            placeholder="Enter movie title"
            name="query"
            id="query"
            className={css.input}
            autoComplete="off"
            autoFocus
          />

          <button type="submit" className={css.button}>
            <MdSearch size={28} className={css.searchIcon} />
          </button>
        </form>

        <MovieList
          movies={movies}
          page={page}
          pageType="movies"
          query={query}
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
