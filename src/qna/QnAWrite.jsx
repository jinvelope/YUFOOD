import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/QnA.css';

const QnAWrite = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token'); // JWT 토큰 가져오기
            await axios.post('http://localhost:8080/api/questions', {
                title,
                content,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('질문이 등록되었습니다.');
            navigate('/QnABoard'); // QnA 목록으로 이동
        } catch (error) {
            console.error('질문 등록 실패:', error);
            alert('질문 등록에 실패했습니다.');
        }
    };

    return (
        <div>
            <div className="qna-write-container">
                <h2>질문 작성</h2>
                <form onSubmit={handleSubmit} className="qna-form">
                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="qna-title-input"
                    />
                    <textarea
                        placeholder="내용을 입력하세요"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="qna-content-input"
                    ></textarea>
                    <button type="submit" className="qna-submit-button">등록</button>
                </form>
            </div>
        </div>
    );
};

export default QnAWrite;
