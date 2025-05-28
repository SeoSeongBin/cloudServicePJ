import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Login from './login';
import Sign_up from './sign_up';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* 루트 경로 접속 시 /login으로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 다른 경로들이 있다면 추가 */}
        <Route path="/sign_up" element={<Sign_up />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;