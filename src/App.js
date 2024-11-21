import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage.jsx';
import SearchPage from './components/MainPage/SearchPage.js'; // 새로 만든 페이지
import DetailPage from './components/DetailPage/DetailPage.jsx';
import Login from "./page/Login.jsx";
import Join from "./page/Join.jsx";
import QnABoard from "./qna/QnABoard.jsx";
import PostDetail from "./PostDetail.js";
import NoticePostDetail from "./notice/NoticePostDetail.jsx"; // 경로 수정
import Notice from "./Notice.jsx";
import FindIdPage from "./page/FindIdPage";
import FindPasswordPage from "./page/FindPasswordPage";
import ThemeToggle from './components/common/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/darkMode.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

    useEffect(() => {
        // JWT 토큰이 localStorage에 있으면 로그인 상태로 설정
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        // 로그아웃 시 토큰 삭제 및 상태 초기화
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const ProtectedRoute = ({ element }) => {
        // 로그인 상태를 확인하여 보호된 경로에 접근 여부 결정
        return isLoggedIn ? element : <Navigate to="/login" />;
    };

    return (
        <ThemeProvider>
            <Router>
                <ThemeToggle /> {/* ThemeToggle 컴포넌트 */}
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/restaurant/:restaurantId" element={<DetailPage />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/join" element={<Join />} />
                    <Route path="/QnABoard" element={<QnABoard />} />
                    <Route path="/QnABoard/:id" element={<PostDetail />} />
                    <Route path="/Notice" element={<Notice />} />
                    <Route path="/notice/:id" element={<NoticePostDetail />} />
                    <Route path="/FindIdPage" element={<FindIdPage />} />
                    <Route path="/FindPasswordPage" element={<FindPasswordPage />} />

                    {/* 보호된 경로 */}
                    <Route
                        path="/profile"
                        element={<ProtectedRoute element={<div>프로필 페이지</div>} />}
                    />
                    <Route
                        path="/review"
                        element={<ProtectedRoute element={<div>리뷰 작성 페이지</div>} />}
                    />
                    <Route
                        path="/qna"
                        element={<ProtectedRoute element={<div>Q&A 작성 페이지</div>} />}
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
