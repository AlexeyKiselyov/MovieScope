import axios from 'axios';
import toast from 'react-hot-toast';

import { MovieDetails } from '../types/types';

const token: string = import.meta.env.VITE_TMDB_VIDEO_API_TOKEN;
const basicUrl = 'https://api.themoviedb.org/3/movie/';

async function getMovieDetails(
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void,
  setMovieDetails: (movieDetails: MovieDetails | null) => void,
  movieId: string | null,
  signal?: AbortSignal
) {
  try {
    setLoading(true);
    setError('');

    const response = await axios<MovieDetails>(`${basicUrl}/${movieId}`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      signal,
    });

    const results = response.data;

    setMovieDetails(results);
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
  }
}

export default getMovieDetails;
