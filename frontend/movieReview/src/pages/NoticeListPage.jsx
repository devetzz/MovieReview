import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Pagination, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading'; // Loading 컴포넌트 import
import { getList } from '../api/NoticeApi.jsx';

const NoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  // Redux store에서 로그인 정보 가져오기
  const loginState = useSelector(state => state.loginSlice);
  const isAdmin = loginState?.roleNames?.includes('ADMIN');

  const fetchNotices = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getList({ page, size: 10 });
      if (response && response.content) {
        setNotices(response.content);
        setTotalPages(response.totalPages);
        setCurrentPage(response.number);
      } else {
        setNotices([]);
        setTotalPages(0);
        setCurrentPage(0);
      }
    } catch (err) {
      setError(err);
      setNotices([]); // 에러 발생 시에도 빈 배열로 초기화
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNoticeClick = (id) => {
    navigate(`/notices/${id}`);
  };

  const handleCreateNotice = () => {
    navigate('/notices/new');
  };

  if (loading) return <Loading />; // Loading 컴포넌트로 교체
  if (error) return <Container className="mt-4"><Alert variant="danger">공지사항을 불러오는 중 오류가 발생했습니다: {error.message}</Alert></Container>;

  return (
    <Container fluid className="mt-4" style={{width: '70vw'}}>
      <h1 className="mb-4">공지사항</h1>
      <div className="d-flex justify-content-end mb-3">
        {isAdmin && (
          <Button variant="primary" onClick={handleCreateNotice}>새 공지사항 작성</Button>
        )}
      </div>
      {notices.length === 0 ? (
        <Alert variant="info">작성된 공지사항이 없습니다.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th className="text-center" style={{width: '35vw'}}>제목</th>
              <th className="text-center">작성자</th>
              <th className="text-center">작성일</th>
              <th className="text-center">첨부파일</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice.id} onClick={() => handleNoticeClick(notice.id)} style={{ cursor: 'pointer' }}>
                <td className="text-center">{notice.id}</td>
                <td>{notice.title}</td>
                <td className="text-center">{notice.authorNickname}</td>
                <td className="text-center">{new Date(notice.createdAt).toLocaleDateString()}</td>
                <td className="text-center">{notice.filePath ? '있음' : '없음'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {totalPages > 1 && (
        <Pagination className="justify-content-center mt-4">
          <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />
          {[...Array(totalPages).keys()].map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => handlePageChange(page)}
            >
              {page + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
          <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage === totalPages - 1} />
        </Pagination>
      )}
    </Container>
  );
};

export default NoticeListPage;