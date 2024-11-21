import React from 'react';
import useNotices from '../hooks/useNotices';
import { useNavigate } from 'react-router-dom';
import '../styles/QnA.css';
import Header from "../components/common/Header";
import NavBar from "../components/common/NavBar"; // QnA.css 스타일 재사용

const NoticeBoard = () => {
    const { notices, isLoading, error } = useNotices();
    const navigate = useNavigate();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const handleRowClick = (id) => {
        navigate(`/notice/${id}`);  // 경로 수정
    };

    return (
        <div>
            <Header/>
            <NavBar/>
            <div className="qna-banner"> {/* QnA.css의 스타일 재사용 */}
                <h2>공지사항</h2>
                <div
                    className="qna-tag"
                    onClick={() => navigate('/notice/write')}
                    style={{ cursor: 'pointer' }}
                >
                    공지 작성
                </div>
            </div>

            <div className="board-wrapper">
                <div className="board-container">
                    <table className="board-table">
                        <thead>
                        <tr>
                            <th className="col-number">번호</th>
                            <th className="col-title">제목</th>
                            <th className="col-author">작성자</th>
                            <th className="col-date">작성일</th>
                            <th className="col-views">조회</th>
                        </tr>
                        </thead>
                        <tbody>
                        {notices.map((notice) => (
                            <tr
                                key={notice.id}
                                onClick={() => handleRowClick(notice.id)}
                                className="clickable-row"
                            >
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
            </div>
        </div>
    );
};

export default NoticeBoard;