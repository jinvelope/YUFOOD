import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailPage.css';

function DetailPage() {
  const [darkMode, setDarkMode] = useState(false);
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [newReview, setNewReview] = useState({
    reviewstar: '',
    content: '',
    rid: restaurantId,
    userid: '익명'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantResponse, reviewsResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/yufood/${restaurantId}`),
          axios.get(`http://localhost:8080/api/review_info/restaurant/${restaurantId}`)
        ]);

        setRestaurant(restaurantResponse.data);
        setReviews(reviewsResponse.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchData();
    document.body.classList.toggle('dark-mode', darkMode);
    return () => {
      document.body.classList.remove('dark-mode');
    };
  }, [restaurantId, darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 리뷰 삭제 핸들러 추가
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8080/api/review_info/${reviewId}`);
        
        // 리뷰 목록 새로고침
        const reviewsResponse = await axios.get(`http://localhost:8080/api/review_info/restaurant/${restaurantId}`);
        setReviews(reviewsResponse.data);
        
        alert('리뷰가 성공적으로 삭제되었습니다.');
      } catch (error) {
        console.error('리뷰 삭제 실패:', error);
        alert('리뷰 삭제에 실패했습니다.');
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        reviewstar: parseInt(newReview.reviewstar),
        content: newReview.content,
        rid: parseInt(restaurantId)
      };

      const response = await axios.post(`http://localhost:8080/api/review_info`, reviewData);

      if (response.status === 200 || response.status === 201) {
        setNewReview({
          reviewstar: '',
          content: '',
          rid: restaurantId
        });
        
        // 리뷰 목록 새로고침
        const reviewsResponse = await axios.get(`http://localhost:8080/api/review_info/restaurant/${restaurantId}`);
        setReviews(reviewsResponse.data);
        
        alert('리뷰가 성공적으로 등록되었습니다.');
      }
    } catch (error) {
      console.error('리뷰 등록 실패:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) return <div className={darkMode ? 'dark-mode' : ''}>로딩 중...</div>;
  if (error) return <div className={darkMode ? 'dark-mode' : ''}>에러: {error}</div>;
  if (!restaurant) return <div className={darkMode ? 'dark-mode' : ''}>식당 정보를 찾을 수 없습니다.</div>;

  return (
    <div className={`Detail_cmp ${darkMode ? 'dark-mode' : ''}`}>
      <header className="header">
        <div className="logo">영남대</div>
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

      <main className={darkMode ? 'dark-mode' : ''}>
        {/* 식당 정보 섹션 */}
        <div className="cmp">
          <div className='restaurant_photo'>
            {restaurant.image1 && <img src={restaurant.image1} alt="식당 사진 1" />}
            {restaurant.image2 && <img src={restaurant.image2} alt="식당 사진 2" />}
          </div>
          <div className='restaurant_info'>
            <h1>{restaurant.rname}</h1>
            <div className="rating">
              <span className="stars">{'★'.repeat(Math.floor(restaurant.rcount || 0))}{'☆'.repeat(5 - Math.floor(restaurant.rcount || 0))}</span>
              <span className="score">{(restaurant.rcount || 0).toFixed(1)}</span>
            </div>
            <div className="address">
              <p>{restaurant.addr}</p>
              <button className="map-button">지도보기</button>
            </div>
            <div className="contact">
              <p>{restaurant.phone}</p>
            </div>
            <div className="business-hours">
              <h3>영업시간</h3>
              <ul>
                <li>월: {restaurant.mon}</li>
                <li>화: {restaurant.tue}</li>
                <li>수: {restaurant.wed}</li>
                <li>목: {restaurant.thr}</li>
                <li>금: {restaurant.fri}</li>
                <li>토: {restaurant.sat}</li>
                <li>일: {restaurant.sun}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 메뉴 정보 섹션 */}
        <div className="cmp">
          <div className='menu_info'>
            <h2>메뉴정보</h2>
            <ul>
              {restaurant.menus && restaurant.menus.map((menu) => (
                <li key={menu.mid}>
                  <span className="menu-name">{menu.mname}</span>
                  <span className="menu-price">{menu.mprice}원</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <div className="cmp">
          <div className='review_info'>
            <h2>리뷰</h2>
            <div className="review-form">
              <h3>리뷰 작성</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="form-group">
                  <label htmlFor="reviewstar">평점:</label>
                  <select
                    id="reviewstar"
                    name="reviewstar"
                    value={newReview.reviewstar}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">선택하세요</option>
                    <option value="5">★★★★★</option>
                    <option value="4">★★★★☆</option>
                    <option value="3">★★★☆☆</option>
                    <option value="2">★★☆☆☆</option>
                    <option value="1">★☆☆☆☆</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="content">리뷰 내용:</label>
                  <textarea
                    id="content"
                    name="content"
                    rows="4"
                    value={newReview.content}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-review">리뷰 등록</button>
              </form>
            </div>

            {/* 리뷰 목록 */}
            <div className="review-list">
              {reviews.map((review) => (
                <div key={review.reviewid} className="review">
                  <div className="review-header">
                    <span className="reviewer-name">사용자 {review.userid}</span>
                    <div className="review-actions">
                      <span className="review-rating">{'★'.repeat(review.reviewstar)}</span>
                      <button 
                        onClick={() => handleDeleteReview(review.reviewid)}
                        className="delete-review-btn"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                  <p className="review-content">{review.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DetailPage;