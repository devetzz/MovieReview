import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const loginState = useSelector(state => state.loginSlice);

  // 사용자 역할에 ADMIN이 포함되어 있는지 확인
  const isAdmin = loginState?.roleNames?.includes('ADMIN');

  // 로그인이 되어 있지 않거나 ADMIN 역할이 없으면 로그인 페이지로 리디렉션
  if (!isAdmin) {
    // 사용자에게 접근 거부 알림
    alert('접근 권한이 없습니다.');
    return <Navigate to="/member/login" replace />;
  }

  // ADMIN 역할이 있으면 요청된 자식 컴포넌트를 렌더링
  return children;
};

export default AdminRoute;
