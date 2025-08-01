import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MovieDetailPage from './pages/MovieDetailPage';
import NowPlayingPage from './pages/NowPlayingPage';
import ReviewFormPage from './pages/ReviewFormPage';
import ReviewDetailPage from './pages/ReviewDetailPage';
import ReviewEditPage from './pages/ReviewEditPage';
import UpcomingMoviesPage from './pages/UpcomingMoviesPage';
import NoticeListPage from './pages/NoticeListPage';
import NoticeDetailPage from './pages/NoticeDetailPage';
import NoticeFormPage from './pages/NoticeFormPage';
import App from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <NowPlayingPage />,
      },
      {
        path: '/movies/now-playing',
        element: <NowPlayingPage />,
      },
      {
        path: '/movies/upcoming',
        element: <UpcomingMoviesPage />,
      },
      {
        path: '/movie/:id',
        element: <MovieDetailPage />,
      },
      {
        path: '/movie/:id/review',
        element: <ReviewFormPage />,
      },
      {
        path: '/movie/:movieId/review/:reviewId',
        element: <ReviewDetailPage />,
      },
      {
        path: '/movie/:movieId/review/:reviewId/edit',
        element: <ReviewEditPage />,
      },
      {
        path: '/notices',
        element: <NoticeListPage />,
      },
      {
        path: '/notices/new',
        element: <NoticeFormPage />,
      },
      {
        path: '/notices/:id',
        element: <NoticeDetailPage />,
      },
      {
        path: '/notices/:id/edit',
        element: <NoticeFormPage />,
      },
    ],
  },
]);

export default router;
