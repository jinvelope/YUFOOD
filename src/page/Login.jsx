import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import '../styles/Join.css';
import '../styles/QnA.css';



export default function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [pwValid, setPwValid] = useState(false);
    const [notAllow, setNotAllow] = useState(true);
    const navigate = useNavigate(); // useNavigate 초기화

    useEffect(() => {
        // 이메일과 비밀번호 유효성 검증 결과에 따라 버튼 활성화/비활성화
        if (emailValid && pwValid) {
            setNotAllow(false);
        } else {
            setNotAllow(true);
        }
    }, [emailValid, pwValid]);

    const handleEmail = (e) => {
        setEmail(e.target.value);
        const regex =
            /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        setEmailValid(regex.test(e.target.value));
    };

    const handlePw = (e) => {
        setPw(e.target.value);
        const regex =
            /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])(?!.*[^a-zA-Z0-9$`~!@$!%*#^?&\\(\\)\-_=+]).{8,20}$/;
        setPwValid(regex.test(e.target.value));
    };

    const onClickConfirmButton = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/login', {
                email: email,
                password: pw,
            });
            
            if (response.status === 200) {
                const { token } = response.data; // JWT 토큰
                localStorage.setItem('token', token); // 토큰 저장
                setIsLoggedIn(true); // 로그인 상태 업데이트
                alert('로그인에 성공했습니다.');
                navigate('/'); // 메인 화면으로 이동
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('이메일 또는 비밀번호를 확인해주세요.');
            } else {
                alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onClickConfirmButton();
        }
    };

    return (
        <div className="page-container">
            <div className="qna-banner">
                <h2>로그인</h2>
            </div>
            <div className="join-container">
                <div className="join-form">
                    <div className="input-group">
                        <div className="input-label">이메일</div>
                        <div className="input-wrapper">
                            <input
                                className={`input-field ${!emailValid && email.length > 0 ? 'error' : ''}`}
                                type="text"
                                placeholder="test@gmail.com"
                                value={email}
                                onChange={handleEmail}
                            />
                        </div>
                        {!emailValid && email.length > 0 && (
                            <div className="error-message">올바른 이메일을 입력해주세요.</div>
                        )}
                    </div>
                    <div className="input-group">
                        <div className="input-label">비밀번호</div>
                        <div className="input-wrapper">
                            <input
                                className={`input-field ${!pwValid && pw.length > 0 ? 'error' : ''}`}
                                type="password"
                                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                                value={pw}
                                onChange={handlePw}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        {!pwValid && pw.length > 0 && (
                            <div className="error-message">영문, 숫자, 특수문자 포함 8자 이상 입력해주세요.</div>
                        )}
                    </div>
                </div>
                <button
                    className="submit-button"
                    onClick={onClickConfirmButton}
                    disabled={notAllow}
                >
                    로그인
                </button>
                <div className="login-links">
                    <Link to="/join" className="link">회원가입</Link>
                    <span className="divider">|</span>
                    <Link to="/FindIdPage" className="link">아이디 찾기</Link>
                    <span className="divider">|</span>
                    <Link to="/FindPasswordPage" className="link">비밀번호 찾기</Link>
                </div>
            </div>
        </div>
    );
}
