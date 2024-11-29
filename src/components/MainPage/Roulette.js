import React, { useState, useEffect, useRef } from 'react';
import { FiArrowDown } from 'react-icons/fi';
import clsx from 'clsx';
import Logo from "../Image/Logo.png";
import "./Roulette.css";
import { Link } from 'react-router-dom';

function Roulette() {
  const [darkMode, setDarkMode] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const rotateRef = useRef(0);
  const [selectedItem, setSelectedItem] = useState(0);
  const [itemCount, setItemCount] = useState('');
  const [items, setItems] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);


  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    return () => {
      document.body.classList.remove('dark-mode');
    };
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  
  // 항목 개수 입력 처리
  const handleItemCountChange = (e) => {
    const count = parseInt(e.target.value);
    setItemCount(e.target.value);
  };

  // 항목 개수 설정 및 입력 필드 초기화
  const initializeItems = () => {
    const count = parseInt(itemCount);
    if (isNaN(count) || count < 2 || count > 8) {
      alert('2~8 사이의 숫자를 입력해주세요.');
      return;
    }
    
    setItems(Array(count).fill('').map((_, index) => ({
      id: index + 1,
      name: ''
    })));
    setIsInitialized(true);
  };

  // 항목 이름 변경 처리
  const handleNameChange = (id, value) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, name: value } : item
    ));
  };

  const handleClick = () => {
    if (spinning) return;
    
    // 빈 항목 체크
    if (items.some(item => !item.name.trim())) {
      alert('모든 항목의 이름을 입력해주세요.');
      return;
    }
    
    setSpinning(true);
    const minSpins = 5;
    const maxSpins = 10;
    const randomSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;
    const newRotate = randomSpins * 360 + Math.floor(Math.random() * 360);
    rotateRef.current += newRotate;
  
    document.querySelector('.roulette').style.transform = `rotate(${rotateRef.current}deg)`;
  
    setTimeout(() => {
      const finalRotation = rotateRef.current % 360;
      const newSelectedItem = getClosestItem(finalRotation);
      setSelectedItem(newSelectedItem);
      setSpinning(false);
      alert(`선택된 항목: ${items[newSelectedItem].name}`);
    }, 4000);
  };

  const getClosestItem = (rotation) => {
    const itemAngle = 360 / items.length;
    const normalizedRotation = (360 - rotation) % 360;
    let closestItem = 0;
    let minDifference = 360;
  
    for (let i = 0; i < items.length; i++) {
      const itemRotation = i * itemAngle;
      let difference = Math.abs(normalizedRotation - itemRotation);
      if (difference > 180) {
        difference = 360 - difference;
      }
      if (difference < minDifference) {
        minDifference = difference;
        closestItem = i;
      }
    }
  
    return closestItem;
  };

  return (
    <div className="App">
            <header className="header">
            <Link to ="/"><img src={Logo} alt="" className='Logo'/></Link>
        <div className="search-container">
          <input type="text" placeholder="지역, 음식 또는 식당명 입력" className="search-bar" />
          <button className="search-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
            </svg>
          </button>
        </div>
        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? '☀️ 라이트 모드' : '🌙 다크 모드'}
        </button>
      </header>
      <div className="wrap">
        <div className="contents">
          {!isInitialized ? (
            <div className="setup-form">
              <input
                type="number"
                min="2"
                max="8"
                value={itemCount}
                onChange={handleItemCountChange}
                placeholder="항목 개수 입력 (2~8)"
              />
              <button onClick={initializeItems}>항목 생성</button>
            </div>
          ) : (
            <>
              <div className="item-inputs">
                {items.map((item) => (
                  <div key={item.id} className="item-input">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleNameChange(item.id, e.target.value)}
                      placeholder={`항목 ${item.id}`}
                      disabled={spinning}
                    />
                  </div>
                ))}
              </div>

              <div className="rouletteOuter">
                <div className={clsx("roulette", spinning && "on")}>
                  <div>
                    {items.map((item, i) => (
                      <div
                        key={item.id}
                        style={{ transform: `rotate(${i * (360 / items.length)}deg)` }}
                        className="item"
                      >
                        <div>
                          <p className="prizeName">{item.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    {[...Array(items.length)].map((_, index) => (
                      <div
                        key={index}
                        className="line"
                        style={{
                          transform: `rotate(${index * (360 / items.length) + (360 / items.length / 2)}deg)`,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <FiArrowDown className="roulettePin" />
                <div className="rouletteOuterBtn">
                  <button
                    className="rouletteBtn"
                    onClick={handleClick}
                    disabled={spinning}
                  >
                    <p>도전</p>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Roulette;