import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Profile() {
    const [profile, setProfile] = useState({ username: '', email: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // JWT 토큰 가져오기
                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(response.data);
            } catch (err) {
                setError('프로필 정보를 가져오지 못했습니다.');
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>프로필</h1>
            <p><strong>사용자 이름:</strong> {profile.username}</p>
            <p><strong>이메일:</strong> {profile.email}</p>
        </div>
    );
}
