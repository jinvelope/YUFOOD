import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QnA.css';



const QnABoard = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/questions'); // 백엔드 API 경로
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, []);

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
                                <td>{post.user?.username || '알 수 없음'}</td>
                                <td>{new Date(post.createdAt).toLocaleDateString()}</td>
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
