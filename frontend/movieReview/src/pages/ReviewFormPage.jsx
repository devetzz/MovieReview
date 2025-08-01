import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import StarRating from '../components/StarRating'; // StarRating 컴포넌트 import
import Loading from '../components/Loading'; // Loading 컴포넌트 import

const ReviewFormPage = () => {
  const { id } = useParams(); // 영화 ID를 URL 파라미터에서 가져옵니다.
  const navigate = useNavigate();
  const [reviewContent, setReviewContent] = useState('');
  const [rating, setRating] = useState(5); // 기본값 5
  const [movieTitle, setMovieTitle] = useState('Loading movie...'); // 영화 제목 상태
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [errorMovie, setErrorMovie] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const currentUserEmail = 'test@test.com';

  useEffect(() => {
    const fetchMovieTitle = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/movies/${id}`);
        setMovieTitle(response.data.title);
        setLoadingMovie(false);
      } catch (err) {
        setErrorMovie(err);
        setLoadingMovie(false);
        setMovieTitle('Error loading movie title');
      }
    };

    fetchMovieTitle();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const reviewData = {
        tmdbId: parseInt(id), // tmdbId는 Long 타입이므로 parseInt로 변환
        content: reviewContent,
        rating: rating,
      };

      // 임시 사용자 이메일 (로그인 기능 구현 시 동적으로 변경 필요)
      const userEmail = 'test@test.com'; 

      await axios.post('http://localhost:8080/api/reviews', reviewData, {
        headers: {
          'X-USER-EMAIL': userEmail,
          'Content-Type': 'application/json',
        },
      });

      setSubmitSuccess(true);
      alert('리뷰가 성공적으로 작성되었습니다!');
      navigate(`/movie/${id}`); // 리뷰 작성 후 영화 상세 페이지로 이동

    } catch (err) {
      console.error('리뷰 작성 실패:', err.response ? err.response.data : err.message);
      setSubmitError('리뷰 작성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loadingMovie) return <Loading />; // Loading 컴포넌트로 교체
  if (errorMovie) return <Container className="mt-4"><div>오류: {errorMovie.message}</div></Container>;

  return (
    <Container className="mt-4 mx-auto" style={{ width: '70vw' }}>
      <h1>[{movieTitle}] 리뷰 작성</h1>
      {submitError && <Alert variant="danger">{submitError}</Alert>}
      {submitSuccess && <Alert variant="success">리뷰가 성공적으로 작성되었습니다!</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="reviewContent" >
          <Form.Label>리뷰 내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            placeholder="리뷰를 작성해주세요..."
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="rating">
          <Form.Label>평점</Form.Label>
          <StarRating rating={rating} onRatingChange={setRating} /> {/* StarRating 컴포넌트 사용 */}
        </Form.Group>

        <Button variant="primary" type="submit">
          리뷰 제출
        </Button>
      </Form>
    </Container>
  );
};

export default ReviewFormPage;
