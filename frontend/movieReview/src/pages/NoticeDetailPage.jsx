import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import Loading from '../components/Loading'; // Loading 컴포넌트 import

const NoticeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 임시 사용자 이메일 (로그인 기능 구현 시 동적으로 변경 필요)
  const currentUserEmail = 'test@example.com';

  const fetchNotice = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8080/api/notices/${id}`);
      setNotice(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const handleEdit = () => {
    navigate(`/notices/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8080/api/notices/${id}`, {
          headers: {
            'X-USER-EMAIL': currentUserEmail,
          },
        });
        alert('공지사항이 삭제되었습니다.');
        navigate('/notices'); // 삭제 후 목록 페이지로 이동
      } catch (err) {
        console.error('공지사항 삭제 실패:', err.response ? err.response.data : err.message);
        alert('공지사항 삭제에 실패했습니다.');
      }
    }
  };

  const handleDownload = () => {
    if (notice && notice.filePath) {
      window.open(`http://localhost:8080/api/notices/download/${notice.filePath}`, '_blank');
    }
  };

  // 파일이 이미지인지 확인하는 헬퍼 함수
  const isImageFile = (filePath) => {
    if (!filePath) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
    return imageExtensions.includes(ext);
  };

  if (loading) return <Loading />; // Loading 컴포넌트로 교체
  if (error) return <Container className="mt-4"><Alert variant="danger">공지사항을 불러오는 중 오류가 발생했습니다: {error.message}</Alert></Container>;
  if (!notice) return <Container className="mt-4"><Alert variant="info">공지사항을 찾을 수 없습니다.</Alert></Container>;

  return (
    <Container className="mt-4" style={{ width: '70vw' }}>
      <h1 className="mb-4">공지사항 상세</h1>
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2"> {/* 제목과 작성자/작성일 정렬 */}
            <Card.Title className="mb-0">{notice.title}</Card.Title>
            <Card.Subtitle className="text-muted">
              작성자: {notice.authorNickname} | 작성일: {new Date(notice.createdAt).toLocaleDateString()}
            </Card.Subtitle>
          </div>
          <hr /> {/* 구분선 */}
          <Card.Text className="mt-3">{notice.content}</Card.Text>
          {notice.filePath && isImageFile(notice.filePath) && ( // 이미지 파일인 경우
            <div className="mt-3 text-center">
              <img src={`http://localhost:8080/api/notices/download/${notice.filePath}`} alt="첨부 이미지" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          )}
          {notice.filePath && !isImageFile(notice.filePath) && ( // 이미지 파일이 아닌 경우
            <Button variant="link" onClick={handleDownload}>첨부파일 다운로드</Button>
          )}
        </Card.Body>
      </Card>
      <div className="d-flex justify-content-end mt-3">
        {notice.authorNickname === 'test' && ( // 임시로 작성자 닉네임이 'test'일 경우에만 수정/삭제 버튼 표시
          <>
            <Button variant="secondary" className="me-2" onClick={handleEdit}>수정</Button>
            <Button variant="danger" onClick={handleDelete}>삭제</Button>
          </>
        )}
        <Button variant="outline-secondary" className="ms-2" onClick={() => navigate('/notices')}>목록으로</Button>
      </div>
    </Container>
  );
};

export default NoticeDetailPage;