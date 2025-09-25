import { useEffect, useState } from 'react';
import {
  Link,
  Outlet,
  useLocation,
  useParams,
  useNavigate,
} from 'react-router-dom';

import Footer from '../../Components/Footer/Footer';
import Container from '../../Components/Common/Container/Container';
import ErrorMassage from '../../Components/Common/ErrorMassage/ErrorMassage';
import { Loader } from '../../Components/Common/Loader/Loader';

import getMovieDetails from '../../serveсes/getMovieDetails';

import { MdOutlineKeyboardBackspace } from 'react-icons/md';
import { FcFilm } from 'react-icons/fc';
import { CiLink } from 'react-icons/ci';
import { ImInfo } from 'react-icons/im';
import { FaStar } from 'react-icons/fa';

import filmImagePlaceholder from '../../images/Placeholder_Movie.jpg';

import css from './movieDetailsPage.module.css';
import { MovieDetailsSEO } from '../../Components/SEO/presets';

interface MovieDetails {
  genres: { name: string }[];
  poster_path: string;
  overview: string;
  original_title: string;
  vote_average: number;
}

export default function MovieDetailsPage() {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation();
  const backLinkHref = location.state?.from ?? '/movies';

  const { movieId } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    try {
      window.dispatchEvent(new Event('lenis:scrollTop'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (_) {
      window.scrollTo({ top: 0 });
    }
  }, [movieId]);

  useEffect(() => {
    if (!movieId) return;

    const controller = new AbortController();
    const signal = controller.signal;

    getMovieDetails(setLoading, setError, setMovieDetails, movieId, signal);

    return () => {
      controller.abort();
    };
  }, [movieId]);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        navigate('/movies', { replace: true });
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [error, navigate]);

  if (!movieDetails) {
    return <Loader loading={true} color="blue" />;
  }

  const { genres, poster_path, overview, original_title, vote_average } =
    movieDetails;

  return (
    <>
      <Container>
        <MovieDetailsSEO
          movieId={movieId as string}
          original_title={original_title}
          overview={overview}
          poster_path={poster_path}
          vote_average={vote_average}
        />

        <Link to={backLinkHref} className={css.backLink}>
          <MdOutlineKeyboardBackspace />
          <span>Back</span>
        </Link>

        {movieDetails && (
          <div className={css.detailsWrapper}>
            <div className={css.posterImageWrapper}>
              {typeof vote_average === 'number' && (
                <span
                  className={`${css.ratingBadge} ${
                    vote_average >= 7
                      ? css.good
                      : vote_average >= 5
                      ? css.medium
                      : css.bad
                  }`}
                  aria-label={`Rating ${vote_average.toFixed(1)}`}
                  title={`Rating: ${vote_average.toFixed(1)}`}
                >
                  <FaStar size={14} aria-hidden="true" />
                  {vote_average.toFixed(1)}
                </span>
              )}
              <img
                src={
                  poster_path
                    ? `https://image.tmdb.org/t/p/w500${poster_path}`
                    : filmImagePlaceholder
                }
                alt={original_title}
                className={css.posterImage}
                loading="lazy"
              />
            </div>

            <div className={css.movieInfo}>
              <div className={css.titleWrapper}>
                <FcFilm size={40} className={css.titleImage} />
                <h2 className={css.movieTitle}>{original_title}</h2>
              </div>
              <p className={css.movieOverview}>
                {overview && overview.trim().length > 0
                  ? overview
                  : 'No overview available.'}
              </p>
              <p>
                <span className={css.ratingText}>Rating:</span>
                {typeof vote_average === 'number' ? vote_average.toFixed(1) : 0}
              </p>
              <div className={css.genresRow}>
                <span className={css.genreText}>Genres:</span>
                {genres.length > 0 ? (
                  <ul className={css.genreChips} aria-label="Genres list">
                    {genres.map(genre => (
                      <li key={genre.name} className={css.genreChip}>
                        {genre.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>
          </div>
        )}

        <div className={css.additionalWrapper}>
          <div className={css.additionalTitleWrapper}>
            <h2 className={css.additionalTitle}>Additional information</h2>
            <ImInfo size={35} />
          </div>

          <ul className={css.additionalList}>
            <li className={css.additionalItem}>
              <CiLink size={40} />
              <Link
                to={'cast'}
                state={{ from: backLinkHref }}
                className={css.additionalLink}
              >
                Cast{' '}
              </Link>
            </li>
            <li className={css.additionalItem}>
              <CiLink size={40} />
              <Link
                to={'reviews'}
                state={{ from: backLinkHref }}
                className={css.additionalLink}
              >
                Reviews
              </Link>
            </li>
          </ul>
        </div>

        <Outlet />

        {error && <ErrorMassage />}

        {loading && !error && <Loader loading={loading} color="blue" />}
      </Container>

      <Footer />
    </>
  );
}
