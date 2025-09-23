import axios from 'axios';
import { RefObject } from 'react';
import toast from 'react-hot-toast';

const token: string = import.meta.env.VITE_TMDB_VIDEO_API_TOKEN;
const basicUrl = 'https://api.themoviedb.org/3/movie/';

interface MovieReview {
  id: number;
  author: string;
  author_details: { avatar_path: string | null; rating: number };
  content: string;
  character: string;
}

interface MovieReviewsResponse {
  results: MovieReview[];
}

async function getMovieReviews(
  setLoading: (loading: boolean) => void,
  setError: (error: string) => void,
  setCast: (movieCast: MovieReview[]) => void,
  movieId: string | null,
  signal?: AbortSignal,
  reviewsRef?: RefObject<HTMLDivElement | null>
) {
  try {
    setLoading(true);
    setError('');

    const response = await axios<MovieReviewsResponse>(
      `${basicUrl}/${movieId}/reviews?page=1`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal,
      }
    );

    const results = response.data.results;

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
      if (reviewsRef?.current) {
        reviewsRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 100);
  }
}

export default getMovieReviews;
