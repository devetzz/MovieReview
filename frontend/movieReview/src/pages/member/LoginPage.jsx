import { React, useState } from "react";
import { Container, FloatingLabel, Form, Button } from 'react-bootstrap';
import useCustomLogin from "../../hooks/useCustomLogin";
import KakaoLoginComponent from "../../components/KakaoLoginComponent";

const initState = {
  email: "",
  pw: "",
};

const LoginPage = () => {
  const [loginParam, setLoginParam] = useState({ ...initState });
  // const navigate = useNavigate();
  // const dispatch = useDispatch();
  const { doLogin, moveToPath } = useCustomLogin();

  const handleChange = (e) => {
    loginParam[e.target.name] = e.target.value;
    setLoginParam({ ...loginParam });
  };

  const handleClickLogin = (e) => {
    doLogin(loginParam)
      // loginSlice 의 비동기 호출
      .then(data => {
        console.log(data);
        if (data.error) {
          alert("이메일과 패스워드를 다시 확인하세요");
        } else {
          alert("로그인 성공");
          moveToPath('/');
        }
      })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleClickLogin();
    }
  };

  return (
    <Container>
      <div className="d-grid gap-2 mt-5 p-5">
        <h2 className="text-center mb-3">Login</h2>
        <FloatingLabel
          controlId="floatingInput"
          label="Email address"
          className="mb-3"
        >
          <Form.Control
            name="email"
            type="email"
            placeholder="name@example.com"
            value={loginParam.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FloatingLabel>
        <FloatingLabel controlId="floatingPassword" label="Password">
          <Form.Control
            name="pw"
            type="password"
            placeholder="Password"
            value={loginParam.pw}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </FloatingLabel>
        <div className="d-grid gap-2 mt-3">
          <Button variant="outline-primary" onClick={handleClickLogin}>
            로그인
          </Button>
        </div>
        <KakaoLoginComponent />
      </div>
    </Container>
  );
};

export default LoginPage;