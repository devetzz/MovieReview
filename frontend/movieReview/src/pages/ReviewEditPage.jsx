import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtAxios from '../util/jwtUtil'; // jwtAxios import 추가
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';
import StarRating from '../components/StarRating'; // StarRating 컴포넌트 import
import Loading from '../components/Loading'; // Loading 컴포넌트 import

const ReviewEditPage = () => {
  const { movieId, reviewId } = useParams();
  const navigate = useNavigate();
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieTitle, setMovieTitle] = useState('Loading movie...'); // 영화 제목 상태
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [errorMovie, setErrorMovie] = useState(null);

  // 기존 리뷰 데이터 불러오기
  useEffect(() => {
    const fetchReviewAndMovieDetail = async () => {
      try {
        // 영화 제목 가져오기 (인증 불필요)
        const movieResponse = await axios.get(`http://localhost:8080/api/movies/${movieId}`);
        setMovieTitle(movieResponse.data.title);
        setLoadingMovie(false);

        // 리뷰 상세 정보 가져오기 (인증 불필요)
        const reviewResponse = await axios.get(`http://localhost:8080/api/reviews/${reviewId}`);
        setReviewContent(reviewResponse.data.content);
        setRating(reviewResponse.data.rating);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        setErrorMovie(err);
        setLoadingMovie(false);
      }
    };

    fetchReviewAndMovieDetail();
  }, [movieId, reviewId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedReviewData = {
        tmdbId: parseInt(movieId), // movieId를 tmdbId로 사용
        content: reviewContent,
        rating: rating,
      };

      // 리뷰 수정은 인증이 필요하므로 jwtAxios 사용
      await jwtAxios.put(`http://localhost:8080/api/reviews/${reviewId}`, updatedReviewData);

      alert('리뷰가 성공적으로 수정되었습니다!');
      navigate(`/movie/${movieId}/review/${reviewId}`); // 수정 후 리뷰 상세 페이지로 이동
    } catch (err) {
      console.error('리뷰 수정 실패:', err.response ? err.response.data : err.message);
      alert('리뷰 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading || loadingMovie) return <Loading />; // Loading 컴포넌트로 교체
  if (error || errorMovie) return <Container className="mt-4"><Alert variant="danger">데이터를 불러오는 중 오류가 발생했습니다: {error ? error.message : errorMovie.message}</Alert></Container>;

  return (
    <Container className="mt-4 mx-auto" style={{ width: '70vw' }}>
      <h1>[{movieTitle}] 리뷰 수정</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="reviewContent">
          <Form.Label>리뷰 내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="rating">
          <Form.Label>평점</Form.Label>
          <StarRating rating={rating} onRatingChange={setRating} /> {/* StarRating 컴포넌트 사용 */}
        </Form.Group>

        <Button variant="primary" type="submit">
          수정 완료
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>
          취소
        </Button>
      </Form>
    </Container>
  );
};

export default ReviewEditPage;
