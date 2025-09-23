import { Route, Routes } from 'react-router-dom';

import { Toaster } from 'react-hot-toast';

import NotFound from './NotFound/NotFound';
import Spotlight from './Spotlight/Spotlight';
import Navigation from './Navigation/Navigation';
import ScrollToTopBtn from './ScrollToTopBtn/ScrollToTopBtn';
import { MovieCast } from './MovieCast/MovieCast';
import { MovieReviews } from './MovieReviews/MovieReviews';
import HomePage from '../Pages/HomePage/HomePage';
import MoviesPage from '../Pages/MoviesPage/MoviesPage';
import MovieDetailsPage from '../Pages/MovieDetailsPage/MovieDetailsPage';

import useScrollToTop from '../hooks/useScrollToTop';

export default function App() {
  const { isVisible, scrollToTop } = useScrollToTop();

  return (
    <>
      <Spotlight />

      <Navigation />

      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/movies" element={<MoviesPage />}></Route>
        <Route path="/movies/:movieId" element={<MovieDetailsPage />}>
          <Route path="cast" element={<MovieCast />}></Route>
          <Route path="reviews" element={<MovieReviews />}></Route>
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>

      {isVisible && <ScrollToTopBtn scrollToTop={scrollToTop} />}

      <Toaster />
    </>
  );
}
