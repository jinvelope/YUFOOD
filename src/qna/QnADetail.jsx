import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";



const QuestionDetail = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/questions/${id}`);
                setQuestion(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <div className="question-detail">
                <h1>{question.title}</h1>
                <p>{question.content}</p>
                <p>
                    <strong>작성자:</strong> {question.author}
                </p>
                <p>
                    <strong>작성일:</strong> {new Date(question.createdAt).toLocaleDateString()}
                </p>
                <p>
                    <strong>조회수:</strong> {question.views}
                </p>
            </div>
        </div>
    );
};

export default QuestionDetail;
