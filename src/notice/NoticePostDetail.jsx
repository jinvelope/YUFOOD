import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';



const NoticePostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        // 실제 API 호출로 대체해야 합니다
        const fetchPost = async () => {
            const sampleNoticePost = {
                id: id,
                title: "시스템 점검 안내",
                author: "관리자",
                date: "2024.10.01",
                content: `10월 5일 새벽 2시부터 4시까지 시스템 점검이 있을 예정입니다.

■ 점검 일시
2024년 10월 5일 새벽 2:00 ~ 4:00 (약 2시간)

■ 점검 내용
- 서버 안정화
- 보안 업데이트
- 시스템 최적화

■ 참고사항
- 점검 시간 동안 서비스 이용이 제한됩니다.
- 점검 완료 후 정상적으로 서비스 이용이 가능합니다.

이용에 불편을 드려 죄송합니다.
더 나은 서비스를 제공하도록 하겠습니다.`,
                views: 150
            };
            setPost(sampleNoticePost);
        };

        fetchPost();
    }, [id]);

    if (!post) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <div className="qna-banner">
                <h2>공지사항</h2>
                <div className="qna-tag">
                    공지 작성
                </div>
            </div>

            <div className="content-wrapper">
                <div className="post-detail-container">
                    <h1 className="post-title">{post.title}</h1>

                    <div className="post-info">
                        <div className="info-item">
                            <span className="label">작성자</span>
                            <span className="value">{post.author}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">작성일</span>
                            <span className="value">{post.date}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">조회수</span>
                            <span className="value">{post.views}</span>
                        </div>
                    </div>

                    <div className="post-content">
                        {post.content.split('\n').map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>

                    <div className="button-container">
                        <button
                            onClick={() => window.history.back()}
                            className="post-button secondary-button"
                        >
                            목록으로
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticePostDetail;