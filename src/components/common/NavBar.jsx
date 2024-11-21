import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-links">
                    <Link
                        to="/"
                        className={location.pathname === '/' ? 'active' : ''}
                    >
                        홈
                    </Link>
                    <Link
                        to="/notice"
                        className={location.pathname === '/notice' ? 'active' : ''}
                    >
                        공지사항
                    </Link>
                    <Link
                        to="/QnABoard"
                        className={location.pathname === '/QnABoard' ? 'active' : ''}
                    >
                        QnA
                    </Link>
                    <Link
                        to="/QnABoard"
                        className={location.pathname === '/QnABoard' ? 'active' : ''}
                    >
                        룰렛
                    </Link>
                    <Link
                        to="/QnABoard"
                        className={location.pathname === '/QnABoard' ? 'active' : ''}
                    >
                        사다리타기
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;