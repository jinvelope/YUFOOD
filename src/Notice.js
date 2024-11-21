import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/QnA.css';  // 스타일 파일 이름은 필요에 따라 변경하세요

const BoardTable = () => {
    const [notices, setNotices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                // 실제 API 호출로 대체해야 합니다
                const sampleNotices = [
                    {
                        id: 1,
                        title: "시스템 점검 안내",
                        author: "관리자",
                        date: "2024.10.01",
                        content: "10월 5일 새벽 2시부터 4시까지 시스템 점검이 있을 예정입니다.",
                        views: 150
                    },
                    // 더 많은 샘플 데이터를 추가할 수 있습니다
                ];
                setNotices(sampleNotices);
            } catch (error) {
                console.error("Failed to fetch notices:", error);
                // TODO: 사용자에게 에러 메시지를 표시하는 로직 추가
            }
        };
        fetchNotices();
    }, []);

    const handleRowClick = (id) => {
        navigate(`/notice/${id}`);
    };

    return (
        <div className="board-container">
            <table className="board-table">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회</th>
                </tr>
                </thead>
                <tbody>
                {notices.map((notice) => (
                    <tr key={notice.id} onClick={() => handleRowClick(notice.id)} className="clickable-row">
                        <td>{notice.id}</td>
                        <td>{notice.title}</td>
                        <td>{notice.author}</td>
                        <td>{notice.date}</td>
                        <td>{notice.views}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

const NavBar = () => {
    return (
        <nav className="nav-menu">
            <ul>
                <li><Link to="/main">홈</Link></li>
                <li><Link to="/notice" className="active">공지사항</Link></li>
                <li><Link to="/QnABoard">QnA</Link></li>
            </ul>
        </nav>
    );
};

export default function Notice() {
    return (
        <div>
            <div className="top-bar">
                <Link to="/" className="logo">
                    <span style={{color: '#26baa4'}}>🍴</span>다이닝코드
                </Link>
                <div className="right-section">
                    <div className="search-bar">
                        <input type="text" placeholder="검색어를 입력하세요"/>
                        <span className="search-icon">🔍</span>
                    </div>
                    <Link to="/login" className="home-button">Login</Link>
                </div>
            </div>
            <div>
                <NavBar />
            </div>
            <div className="blue-banner">
                <h2>공지사항</h2>
                <button className="button button-teal">
                    공지 작성
                </button>
            </div>
            <div className="content-area">
                <BoardTable />
            </div>
        </div>
    );
}