import axios from 'axios';
import toast from 'react-hot-toast';

import { Movie } from '../types/types';

const token: string = import.meta.env.VITE_TMDB_VIDEO_API_TOKEN;
const basicUrl = 'https://api.themoviedb.org/3/trending/movie/';

interface TrendMoviesResponse {
  results: Movie[];
  total_pages: number;
}

async function getTrendMovies(
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void,
  setMovies: (movies: Movie[] | ((prev: Movie[]) => Movie[])) => void,
  period: 'week' | 'day' = 'week',
  page: number,
  setTotalPages: (totalPages: number) => void,
  signal?: AbortSignal
) {
  try {
    setLoading(true);
    setError('');

    const response = await axios<TrendMoviesResponse>(
      `${basicUrl}/${period}?page=${page}`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal,
      }
    );

    const results = response.data.results;

    setMovies(prev => (page === 1 ? results : [...prev, ...results]));

    setTotalPages(response.data.total_pages);
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

export default getTrendMovies;
