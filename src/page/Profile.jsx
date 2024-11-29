import React, { useEffect, useState } from 'react';
import axios from 'axios';


export default function Profile() {
    const [profile, setProfile] = useState({ email: '', username: '', name: '' });
    const [editable, setEditable] = useState(false); // 수정 모드 여부
    const [error, setError] = useState('');

    // 프로필 정보 가져오기
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('로그인이 필요합니다.');
                }
                console.log("1"+token);
                const response = await axios.get('http://localhost:8080/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log("2"+token);
                setProfile(response.data);
            } catch (err) {
                console.error('프로필 정보를 가져오는 중 오류:', err);
                setError('프로필 정보를 가져올 수 없습니다.');
            }
        };

        fetchProfile();
    }, []);

    // 프로필 정보 수정
    const handleUpdateProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('로그인이 필요합니다.');
            }

            await axios.put(
                'http://localhost:8080/api/profile/update',
                {
                    username: profile.username,
                    name: profile.name,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert('프로필 정보가 성공적으로 수정되었습니다.');
            setEditable(false); // 수정 모드 종료
        } catch (err) {
            console.error('프로필 정보를 수정하는 중 오류:', err);
            setError('프로필 정보를 수정할 수 없습니다.');
        }
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="profile-container" style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center' }}>프로필</h1>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <strong>이메일:</strong>
                </label>
                <input
                    type="text"
                    value={profile.email}
                    readOnly
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#f0f0f0' }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <strong>사용자 이름:</strong>
                </label>
                <input
                    type="text"
                    value={profile.username}
                    readOnly={!editable}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        backgroundColor: editable ? '#fff' : '#f0f0f0',
                    }}
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <label>
                    <strong>이름:</strong>
                </label>
                <input
                    type="text"
                    value={profile.name}
                    readOnly={!editable}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '10px',
                        backgroundColor: editable ? '#fff' : '#f0f0f0',
                    }}
                />
            </div>
            <div style={{ textAlign: 'center' }}>
                {editable ? (
                    <>
                        <button
                            onClick={handleUpdateProfile}
                            style={{
                                padding: '10px 20px',
                                margin: '5px',
                                backgroundColor: '#4CAF50',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            저장
                        </button>
                        <button
                            onClick={() => setEditable(false)}
                            style={{
                                padding: '10px 20px',
                                margin: '5px',
                                backgroundColor: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                            }}
                        >
                            취소
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setEditable(true)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#008CBA',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        수정
                    </button>
                )}
            </div>
        </div>
    );
}
