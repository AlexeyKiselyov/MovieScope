import axios from 'axios';
import { RefObject } from 'react';
import toast from 'react-hot-toast';

const token: string = import.meta.env.VITE_TMDB_VIDEO_API_TOKEN;
const basicUrl = 'https://api.themoviedb.org/3/movie/';

interface MovieActor {
  id: number;
  name: string;
  profile_path: string;
  character: string;
}

interface MovieCastResponse {
  cast: MovieActor[];
}

async function getMovieCredits(
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void,
  setCast: (movieCast: MovieActor[]) => void,
  movieId: string | null,
  signal?: AbortSignal,
  castRef?: RefObject<HTMLDivElement | null>
) {
  try {
    setLoading(true);
    setError('');

    const response = await axios<MovieCastResponse>(
      `${basicUrl}/${movieId}/credits`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal,
      }
    );

    const results = response.data.cast;

    setCast(results);
  } catch (error: unknown) {
    if (axios.isCancel(error)) {
      return;
    }

    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.status_message || 'Something went wrong';
      setError(`Ooops, some error: ${message}`);
      toast.error(`Ooops, some error: ${message}`);
    } else {
      setError('An unknown error occurred');
      toast.error('An unknown error occurred');
    }
  } finally {
    setLoading(false);

    setTimeout(() => {
      if (castRef?.current) {
        castRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  }
}

export default getMovieCredits;
