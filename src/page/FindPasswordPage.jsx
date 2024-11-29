import React, { useState } from 'react';
import { Form } from '../components/Form';
import { FormItem } from '../components/FormItem';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import '../styles/QnA.css';  // QnA 스타일 재사용
import './FindId.css';


const FindPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSendVerificationCode = () => {
        // 실제 구현에서는 이메일로 인증 코드를 보내는 로직을 추가해야 합니다.
        console.log('인증 코드 전송 to', email);
        setIsCodeSent(true);
    };

    const handleVerify = () => {
        // 실제 구현에서는 인증 코드를 확인하는 로직을 추가해야 합니다.
        console.log('인증 코드 확인', verificationCode);
        setIsVerified(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        console.log('비밀번호 재설정 요청', { email, newPassword });
    };

    return (
        <div>
            <div className="qna-banner">
                <h2>비밀번호 찾기</h2>
            </div>

            <div className="content-area">
                <div className="board-container">
                    <Form onSubmit={handleSubmit}>
                        <FormItem className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-grow"
                            />
                            <Button
                                type="button"
                                onClick={handleSendVerificationCode}
                                className="verification-button"
                                disabled={isCodeSent}
                            >
                                {isCodeSent ? '전송됨' : '인증번호 전송'}
                            </Button>
                        </FormItem>

                        {isCodeSent && (
                            <FormItem className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="인증번호"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    required
                                    className="flex-grow"
                                />
                                <Button
                                    type="button"
                                    onClick={handleVerify}
                                    className="verification-button"
                                    disabled={isVerified}
                                >
                                    {isVerified ? '인증됨' : '인증'}
                                </Button>
                            </FormItem>
                        )}

                        {isVerified && (
                            <>
                                <FormItem>
                                    <Input
                                        type="password"
                                        placeholder="새 비밀번호"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </FormItem>
                                <FormItem>
                                    <Input
                                        type="password"
                                        placeholder="새 비밀번호 확인"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </FormItem>
                            </>
                        )}

                        <Button
                            type="submit"
                            className="submit-button"
                            disabled={!isVerified}
                        >
                            비밀번호 재설정
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default FindPasswordPage;