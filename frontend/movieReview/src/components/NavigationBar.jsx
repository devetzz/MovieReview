import React, { useState } from 'react'; // useState import 추가
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const NavigationBar = () => {
  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 상태 관리

  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

  return (
    <Navbar variant="dark" expand="lg" className="navbar-pattern">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/movies/now-playing"
          className="me-5"
          style={{ fontSize: '1.8em', fontWeight: 'bold', color: '#fd1a84' }}
        >
          MovieReview
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown
              title={<strong style={{ opacity: 0.9 }}>Movies</strong>} // opacity 추가
              id="basic-nav-dropdown"
              show={showDropdown} // show 속성으로 드롭다운 제어
              onMouseEnter={handleMouseEnter} // 마우스 진입 시
              onMouseLeave={handleMouseLeave}
              className="me-3" // me-3 추가
            >
              <NavDropdown.Item as={Link} to="/movies/now-playing" onClick={() => setShowDropdown(false)}>지금 상영 중</NavDropdown.Item> {/* 텍스트 변경 및 클릭 시 드롭다운 닫기 */}
              <NavDropdown.Item as={Link} to="/movies/upcoming" onClick={() => setShowDropdown(false)}>개봉 예정작</NavDropdown.Item> {/* 클릭 시 드롭다운 닫기 */}
            </NavDropdown>
            <Nav.Link as={Link} to="/notices" className="me-3"><strong style={{ opacity: 0.9 }}>공지사항</strong></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
