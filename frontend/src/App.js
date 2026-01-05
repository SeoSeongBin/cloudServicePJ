import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import './App.css';
import Login from './login';
import Sign_up from './sign_up';
import Main from './main';

// 로그인 체크 및 라우팅 처리 담당 컴포넌트
function SessionChecker() {
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/session-check')
      .then(res => res.json())
      .then(data => {
        if (data.loggedIn) {
          navigate('/main');
        } else {
          navigate('/login');
        }
      });
  }, []);

  return <div>Loading...</div>; // 혹은 로딩 스피너
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 루트 경로에서 세션 체크 */}
        <Route path="/" element={<SessionChecker />} />

        {/* 로그인 화면 */}
        <Route path="/login" element={<Login />} />

        {/* 회원가입 */}
        <Route path="/sign_up" element={<Sign_up />} />

        {/* 메인 페이지 */}
        <Route path="/main" element={<Main />}>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
