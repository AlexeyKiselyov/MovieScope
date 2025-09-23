import axios from 'axios';
import toast from 'react-hot-toast';
import { Movie } from '../types/types';

const token: string = import.meta.env.VITE_TMDB_VIDEO_API_TOKEN;
const basicUrl = 'https://api.themoviedb.org/3/search/movie';

interface FindMovieResponse {
  results: Movie[];
  total_pages: number;
}

async function findMovie(
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void,
  setMovies: (movies: Movie[] | ((prev: Movie[]) => Movie[])) => void,
  query: string,
  page: number,
  setTotalPages: (totalPages: number) => void,
  signal?: AbortSignal
) {
  try {
    setLoading(true);
    setError('');

    const response = await axios<FindMovieResponse>(
      `${basicUrl}?query=${query}&page=${page}`,
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

    if (results.length === 0) {
      toast.success('Nothing found');
    }
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

export default findMovie;
