import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQnAPosts } from '../hooks/useQnAPosts';
import '../styles/QnA.css';
import Header from "../components/common/Header";
import NavBar from "../components/common/NavBar";

const QnABoard = () => {
    const { posts, isLoading, error } = useQnAPosts();
    const navigate = useNavigate();

    if (isLoading) return (
        <div className="board-wrapper">
            <div className="loading">Loading...</div>
        </div>
    );

    if (error) return (
        <div className="board-wrapper">
            <div className="error">Error: {error.message}</div>
        </div>
    );

    return (
        <div>
            <Header />
            <NavBar />
            <div className="qna-banner">
                <h2>QnA</h2>
                <div
                    className="qna-tag"
                    onClick={() => navigate('/QnABoard/write')}
                    style={{ cursor: 'pointer' }}
                >
                    글작성
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
                        {posts.map((post) => (
                            <tr
                                key={post.id}
                                onClick={() => navigate(`/QnABoard/${post.id}`)}
                            >
                                <td>{post.id}</td>
                                <td>{post.title}</td>
                                <td>{post.author}</td>
                                <td>{post.date}</td>
                                <td>{post.views}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QnABoard;