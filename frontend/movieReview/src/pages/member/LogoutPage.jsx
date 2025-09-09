import { Container, Card, Button } from "react-bootstrap";
import NavigationBar from '../../components/NavigationBar';
import useCustomLogin from "../../hooks/useCustomLogin";

const LogoutPage = () => {
  const { doLogout, moveToPath } = useCustomLogin()
  const handleClickLogout = () => {
    doLogout()
    alert("로그아웃되었습니다.");
    moveToPath("/");
  }

  return (
    <Container>
      <div className="d-grid gap-2 mt-5">
        <Container className="p-5">
          <Card className="text-center">
            <Card.Header>Logout Component</Card.Header>
            <Card.Body>
              <Card.Title>로그아웃을 진행합니다.</Card.Title>
              <div className="d-grid gap-2 mt-3">
                <Button variant="outline-primary" onClick={handleClickLogout}>
                  로그아웃
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </Container>
  );
};

export default LogoutPage;
