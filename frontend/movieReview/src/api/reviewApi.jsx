import jwtAxios from "../util/jwtUtil.jsx";
import { API_SERVER_HOST } from "./memberApi";

const host = `${API_SERVER_HOST}/api/reviews`;

// 특정 영화의 모든 리뷰 조회
export const getMovieReviews = async (tmdbId) => {
  const res = await jwtAxios.get(host, { params: { tmdbId } });
  return res.data;
};

// 리뷰 삭제
export const deleteReview = async (reviewId) => {
  const res = await jwtAxios.delete(`${host}/${reviewId}`);
  return res.data;
};
