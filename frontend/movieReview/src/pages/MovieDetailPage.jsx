import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Image, Card, Button, ListGroup } from 'react-bootstrap';
import Loading from '../components/Loading'; // Loading 컴포넌트 import
import { getMovieReviews, deleteReview as apiDeleteReview } from '../api/reviewApi.jsx';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [errorMovie, setErrorMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorReviews, setErrorReviews] = useState(null);
  const navigate = useNavigate();

  const handleWriteReviewClick = () => {
    navigate(`/movie/${id}/review`);
  };

  const handleEditReview = (reviewId) => {
    // TODO: 리뷰 수정 페이지로 이동하는 로직 구현
    alert(`리뷰 수정: ${reviewId}`);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      try {
        await apiDeleteReview(reviewId);
        alert('리뷰가 삭제되었습니다.');
        fetchReviews();
      } catch (err) {
        console.error('리뷰 삭제 실패:', err.response ? err.response.data : err.message);
        alert('리뷰 삭제에 실패했습니다.');
      }
    }
  };

  // 평점을 별표로 렌더링하는 함수
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i} style={{ color: 'gold' }}>★</span>); // 채워진 별
      } else {
        stars.push(<span key={i} style={{ color: 'gray' }}>☆</span>); // 비워진 별
      }
    }
    return <div>{stars}</div>;
  };

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/movies/${id}`);
        setMovie(response.data);
        setLoadingMovie(false);
      } catch (err) {
        setErrorMovie(err);
        setLoadingMovie(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  // Fetch reviews (함수를 분리하여 재사용 가능하게 함)
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const data = await getMovieReviews(id);
      setReviews(data);
    } catch (err) {
      setErrorReviews(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id]); // id가 변경될 때마다 리뷰를 다시 불러옴

  if (loadingMovie) return <Loading />; // Loading 컴포넌트로 교체
  if (errorMovie) return <Container className="mt-4"><div>오류: {errorMovie.message}</div></Container>;
  if (!movie) return <Container className="mt-4"><div>영화를 찾을 수 없습니다.</div></Container>;

  return (
    <Container className="mt-4">
      <Row>
        <Col md={4}>
          <Image src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} fluid rounded style={{ height: '450px', objectFit: 'cover' }} />
        </Col>
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>{movie.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{movie.original_title}</Card.Subtitle>
              <Card.Text>
                <strong>개봉일:</strong> {movie.release_date}<br />
                <strong>평점:</strong> {movie.vote_average} ({movie.vote_count}표)<br />
                <strong>인기도:</strong> {movie.popularity}<br />
                <strong>개요:</strong> {movie.overview}
              </Card.Text>
            </Card.Body>
          </Card>
          <Button variant="primary" className="mt-3" onClick={handleWriteReviewClick}>리뷰 작성</Button>
        </Col>
      </Row>

      <h2 className="mt-5">리뷰</h2>
      {loadingReviews && <Loading />} {/* Loading 컴포넌트로 교체 */}
      {errorReviews && <div>리뷰 불러오기 오류: {errorReviews.message}</div>}
      {!loadingReviews && reviews.length === 0 && <div>아직 작성된 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</div>}
      {!loadingReviews && reviews.length > 0 && (
        <Row className="mt-3">
          {reviews.map((review) => (
            <Col key={review.id} sm={6} md={4} lg={3} className="mb-4">
              <Card className="review-card" style={{ height: '200px', overflow: 'auto', cursor: 'pointer' }} onClick={() => navigate(`/movie/${id}/review/${review.id}`)}>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    <span>{review.memberNickname}</span>
                    <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                  </Card.Title>
                  {renderStars(review.rating)} {/* 별표 렌더링 */}
                  <Card.Subtitle className="mb-2 text-muted">평점: {review.rating}점</Card.Subtitle>
                  <Card.Text className="flex-grow-1">{review.content}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MovieDetailPage;