// useNotices.js
import { useState, useEffect } from 'react';

const useNotices = () => {
    const [notices, setNotices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch notices:", error);
                setError(error);
                setIsLoading(false);
            }
        };
        fetchNotices();
    }, []);

    return { notices, isLoading, error };
};

export default useNotices;
