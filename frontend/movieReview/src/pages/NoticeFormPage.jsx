import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Spinner, Alert } from 'react-bootstrap';

const NoticeFormPage = () => {
  const { id } = useParams(); // id가 있으면 수정 모드, 없으면 생성 모드
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [existingFilePath, setExistingFilePath] = useState(''); // 기존 파일 경로
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // 임시 사용자 이메일 (로그인 기능 구현 시 동적으로 변경 필요)
  const currentUserEmail = 'test@test.com';

  useEffect(() => {
    if (id) { // 수정 모드
      setIsEditMode(true);
      const fetchNotice = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`http://localhost:8080/api/notices/${id}`);
          setTitle(response.data.title);
          setContent(response.data.content);
          setExistingFilePath(response.data.filePath || ''); // 기존 파일 경로 설정
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchNotice();
    } else { // 생성 모드
      setLoading(false);
      setIsEditMode(false);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('request', JSON.stringify({ title, content, filePath: existingFilePath })); // filePath도 함께 보냄
    if (file) {
      formData.append('file', file);
    }

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8080/api/notices/${id}`, formData, {
          headers: {
            'X-USER-EMAIL': currentUserEmail,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('공지사항이 성공적으로 수정되었습니다!');
        navigate(`/notices/${id}`); // 수정 후 상세 페이지로 이동
      } else {
        await axios.post('http://localhost:8080/api/notices', formData, {
          headers: {
            'X-USER-EMAIL': currentUserEmail,
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('공지사항이 성공적으로 작성되었습니다!');
        navigate('/notices'); // 작성 후 목록 페이지로 이동
      }
    } catch (err) {
      console.error('공지사항 처리 실패:', err.response ? err.response.data : err.message);
      setError('공지사항 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setExistingFilePath(''); // 기존 파일 경로도 제거
  };

  if (loading) return <Container className="mt-4"><Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner></Container>;
  if (error) return <Container className="mt-4"><Alert variant="danger">오류: {error.message}</Alert></Container>;

  return (
    <Container className="mt-4" style={{width: '70vw'}}>
      <h1 className="mb-4">{isEditMode ? '공지사항 수정' : '새 공지사항 작성'}</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="content">
          <Form.Label>내용</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="file">
          <Form.Label>첨부 파일</Form.Label>
          <Form.Control type="file" onChange={handleFileChange} />
          {existingFilePath && !file && ( // 기존 파일이 있고 새 파일이 선택되지 않았을 때
            <div className="mt-2">
              현재 파일: {existingFilePath}
              <Button variant="link" size="sm" onClick={handleRemoveFile} className="ms-2">파일 제거</Button>
            </div>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {isEditMode ? '수정 완료' : '작성 완료'}
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)} disabled={loading}>
          취소
        </Button>
      </Form>
    </Container>
  );
};

export default NoticeFormPage;
