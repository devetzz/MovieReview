import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import Loading from '../components/Loading'; // Loading 컴포넌트 import

const NowPlayingPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  // 아이콘 색상 상태
  const [prevIconColor, setPrevIconColor] = useState('gray');
  const [nextIconColor, setNextIconColor] = useState('gray');

  const handleCardClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handlePrev = () => {
    carouselRef.current.prev();
  };

  const handleNext = () => {
    carouselRef.current.next();
  };

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/movies/now-playing');
        setMovies(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchNowPlayingMovies();
  }, []);

  if (loading) return <Loading />; // Loading 컴포넌트로 교체
  if (error) return <Container className="mt-4"><div>오류: {error.message}</div></Container>;

  const slides = [];
  for (let i = 0; i < movies.length; i += 4) {
    slides.push(movies.slice(i, i + 4));
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col xs={10} className="offset-1">
          <h1>지금 상영 중</h1>
        </Col>
      </Row>
      {movies.length > 0 ? (
        <Row className="align-items-center">
          <Col xs={1} className="text-center">
            <Button
              onClick={handlePrev}
              style={{ width: '40px', height: '40px', border: 'none', background: 'transparent', fontSize: '2em' }}
              onMouseEnter={() => setPrevIconColor('white')} // 호버 시 색상 변경
              onMouseLeave={() => setPrevIconColor('gray')} // 호버 아웃 시 색상 복구
            >
              <FontAwesomeIcon icon={faCircleChevronLeft} style={{ color: prevIconColor }} />
            </Button>
          </Col>
          <Col xs={10}>
            <Carousel indicators={false} interval={null} controls={false} ref={carouselRef}>
              {slides.map((slideMovies, index) => (
                <Carousel.Item key={index}>
                  <Row className="justify-content-center">
                    {slideMovies.map((movie) => (
                      <Col key={movie.id} sm={6} md={4} lg={3} className="mb-4">
                        <Card className="review-card" onClick={() => handleCardClick(movie.id)} style={{ cursor: 'pointer', minHeight: '600px' }}>
                          <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} style={{ height: '420px', objectFit: 'cover' }} />
                          <Card.Body>
                            <Card.Title style={{fontSize: '1em', fontWeight: '800'}}>{movie.title}</Card.Title>
                            <Card.Text style={{ height: '100px', overflow: 'hidden', fontSize: '0.8em' }}>
                              {movie.overview ? `${movie.overview.substring(0, 80)}...` : 'No overview available.'}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col xs={1} className="text-center">
            <Button
              onClick={handleNext}
              style={{ width: '40px', height: '40px', border: 'none', background: 'transparent', fontSize: '2em' }}
              onMouseEnter={() => setNextIconColor('white')} // 호버 시 색상 변경
              onMouseLeave={() => setNextIconColor('gray')} // 호버 아웃 시 색상 복구
            >
              <FontAwesomeIcon icon={faCircleChevronRight} style={{ color: nextIconColor }} />
            </Button>
          </Col>
        </Row>
      ) : (
        <div>상영 중인 영화가 없습니다.</div>
      )}
    </Container>
  );
};

export default NowPlayingPage;
