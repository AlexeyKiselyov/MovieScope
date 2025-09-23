import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader } from '../Common/Loader/Loader';
import getMovieCredits from '../../serveсes/getMovieCredits';
import ErrorMassage from '../Common/ErrorMassage/ErrorMassage';

import { GiFilmProjector } from 'react-icons/gi';
import { PiFilmSlate } from 'react-icons/pi';
import css from './movieCast.module.css';

import notFoundImage from '../../images/No_photo.jpg';

interface MovieActor {
  id: number;
  name: string;
  profile_path: string;
  character: string;
}

export function MovieCast() {
  const [cast, setCast] = useState<MovieActor[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const castRef = useRef<HTMLDivElement | null>(null);

  const { movieId } = useParams();

  useEffect(() => {
    if (!movieId) return;

    const controller = new AbortController();
    const signal = controller.signal;

    getMovieCredits(setLoading, setError, setCast, movieId, signal, castRef);

    return () => {
      controller.abort();
    };
  }, [movieId]);

  return (
    <>
      <div className={css.castWrapper} ref={castRef}>
        <div className={css.castTitleWrapper}>
          <h2 className={css.castTitle}>Movie Cast</h2>
          <PiFilmSlate size={40} />
        </div>

        {cast.length !== 0 && (
          <ul className={css.castList}>
            {cast.map(actor => (
              <li key={actor.id} className={css.castItem}>
                <div className={css.actorImageWrapper}>
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                        : notFoundImage
                    }
                    alt={actor.name}
                    className={css.castImage}
                  />
                </div>

                <div className={css.actorInfo}>
                  <p className={css.actorName}>{actor.name}</p>
                  <p>
                    <GiFilmProjector /> <span>{actor.character}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {cast.length === 0 && <p className={css.noCastText}>No info...😒</p>}
      </div>

      {error && <ErrorMassage />}

      <Loader loading={loading} color="blue" />
    </>
  );
}
