import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MovieDetailPage from '../pages/MovieDetailPage';
import NowPlayingPage from '../pages/NowPlayingPage';
import ReviewFormPage from '../pages/ReviewFormPage';
import ReviewDetailPage from '../pages/ReviewDetailPage';
import ReviewEditPage from '../pages/ReviewEditPage';
import UpcomingMoviesPage from '../pages/UpcomingMoviesPage';
import NoticeListPage from '../pages/NoticeListPage';
import NoticeDetailPage from '../pages/NoticeDetailPage';
import NoticeFormPage from '../pages/NoticeFormPage';
import LoginPage from '../pages/member/LoginPage';
import LogoutPage from '../pages/member/LogoutPage';
import KakaoRedirect from '../pages/member/KakaoRedirectPage';
import MemberModify from '../pages/member/ModifyPage';

import App from '../App';
import AdminRoute from './AdminRoute'; // AdminRoute import

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
        element: <AdminRoute><NoticeFormPage /></AdminRoute>, // Protected
      },
      {
        path: '/notices/:id',
        element: <NoticeDetailPage />,
      },
      {
        path: '/notices/:id/edit',
        element: <AdminRoute><NoticeFormPage /></AdminRoute>, // Protected
      },
      {
        path: '/member/login',
        element: <LoginPage />,
      },
      {
        path: '/member/logout',
        element: <LogoutPage />,
      },
      // Kakao Page 경로
      {
        path: '/member/kakao', element: (
          <KakaoRedirect />
        ),
      },
      {
        path: '/member/modify', element: (
          <MemberModify />
        ),
      },
    ],
  },
]);

export default router;
