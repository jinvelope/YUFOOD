import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';
import Logo from '../Image/Logo.png';
import SearchIcon from '../Image/Search_icon.png';

export const Header = ({ isLoggedIn }) => {

    const token = localStorage.getItem('token');
    if (token) {
      isLoggedIn = true;
    }
    else {
        isLoggedIn = false;
    }

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        alert("로그아웃 되었습니다.");
        navigate(`/`);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
        } else {
            alert("검색어를 입력해주세요.");
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleLogoClick = () => {
        navigate('/'); // 메인 페이지로 이동
    };

    return (
        <header className="Header">
            <div className="Header_top">
                <div className="Header_left" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    <img src={Logo} alt="Logo" className="Header_logo" />
                </div>
                <div className="Header_center_search">
                    <input
                        type="text"
                        placeholder="지역, 음식 또는 식당명을 입력해주세요!"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button onClick={handleSearch}>
                        <img src={SearchIcon} alt="Search" />
                    </button>
                </div>
                <div className="Header_right">
                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" className="Header_button">프로필</Link>
                            <button className="Header_button" onClick={handleLogout}>
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="Header_button">로그인</Link>
                            <Link to="/join" className="Header_button">회원가입</Link>
                        </>
                    )}
                </div>
            </div>
            <nav className="Header_nav">
                <ul className="nav_ul">
                    <li><Link to="/Notice">공지사항</Link></li>
                    <li><Link to="/about">사이트 소개</Link></li>
                    <li><Link to="/QnABoard">Q & A</Link></li>
                    <li><Link to="/roulette">룰렛</Link></li>
                    <li><Link to="/ladder">사다리 타기</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
