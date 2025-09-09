import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate import 추가
import axios from 'axios';
import jwtAxios from '../util/jwtUtil'; // jwtAxios import 추가
import { Container, Card, Spinner, Alert, Row, Col, Button } from 'react-bootstrap'; // Button import 추가
import { useSelector } from 'react-redux'; // useSelector import 추가

const ReviewDetailPage = () => {
  const { movieId, reviewId } = useParams();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 로그인한 사용자 정보 가져오기
  const loginState = useSelector(state => state.loginSlice);
  const currentUserEmail = loginState.email;

  const handleEditReview = () => {
    navigate(`/movie/${movieId}/review/${reviewId}/edit`);
  };

  const handleDeleteReview = async () => {
    if (window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      try {
        // 리뷰 삭제는 인증이 필요하므로 jwtAxios 사용
        await jwtAxios.delete(`http://localhost:8080/api/reviews/${reviewId}`);
        alert('리뷰가 삭제되었습니다.');
        navigate(`/movie/${movieId}`); // 삭제 후 영화 상세 페이지로 이동
      } catch (err) {
        console.error('리뷰 삭제 실패:', err.response ? err.response.data : err.message);
        alert('리뷰 삭제에 실패했습니다.');
      }
    }
  };

  useEffect(() => {
    const fetchReviewDetail = async () => {
      try {
        // 리뷰 정보는 인증이 필요 없으므로 일반 axios 사용
        const response = await axios.get(`http://localhost:8080/api/reviews/${reviewId}`);
        setReview(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchReviewDetail();
  }, [reviewId]);

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

  if (loading) return <Container className="mt-4"><Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">리뷰를 불러오는 중 오류가 발생했습니다: {error.message}</Alert></Container>;
  if (!review) return <Container className="mt-4"><Alert variant="info">리뷰를 찾을 수 없습니다.</Alert></Container>;

  return (
    <Container className="mt-4">
      <Row>
        <Col className="mx-auto">
          <h1>리뷰 상세 보기</h1>
          <Card style={{ width: '70vw' }}>
            <Card.Body>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>{review.memberNickname}</span>
                <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
              </Card.Title>
              {renderStars(review.rating)}
              <Card.Subtitle className="mb-2 text-muted">평점: {review.rating}점</Card.Subtitle>
              <Card.Text>{review.content}</Card.Text>
            </Card.Body>
          </Card>
          <div className="d-flex justify-content-between mt-3" style={{ width: '70vw', margin: '0 auto' }}> {/* justify-content-between으로 변경 */}
            <Button variant="secondary" onClick={() => navigate(`/movie/${movieId}`)}>영화 상세 페이지로 돌아가기</Button>
            {review.memberEmail === currentUserEmail && ( // 현재 사용자가 작성한 리뷰인 경우에만 버튼 표시
              <div> {/* 수정/삭제 버튼을 감싸는 div */}
                <Button variant="outline-secondary" className="me-2" onClick={handleEditReview}>수정</Button>
                <Button variant="outline-danger" onClick={handleDeleteReview}>삭제</Button>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ReviewDetailPage;
