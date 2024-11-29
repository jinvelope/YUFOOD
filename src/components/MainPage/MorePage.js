import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import KakaoMap from "../common/KakaoMap";
import "./MorePage.css";

function SearchPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const initialCategory = params.get("category") || "일식";
    const initialLocation = params.get("location") || "영대 정문";

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [activeTab, setActiveTab] = useState(initialLocation);
    const [restaurants, setRestaurants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const locationMapping = {
        "영대 정문": "정문",
        "영대 후문": "후문",
        "미대 뒷길": "미뒷",
    };

    useEffect(() => {
        fetchRestaurants(page);
        navigate(`/more?category=${encodeURIComponent(activeCategory)}&location=${encodeURIComponent(activeTab)}`);
    }, [activeCategory, activeTab, page]);

    const fetchRestaurants = async (currentPage = 0) => {
        setIsLoading(true);
        setError(null);

        try {
            const mappedLocation = locationMapping[activeTab] || activeTab;

            const url = `http://localhost:8080/api/yufood/paged/category/${encodeURIComponent(
                activeCategory
            )}/location/${encodeURIComponent(mappedLocation)}?page=${currentPage}&size=20`;

            const response = await axios.get(url);
            const fetchedData = response.data.content || [];

            setRestaurants(fetchedData);
            setTotalPages(response.data.totalPages || 1);
        } catch (err) {
            console.error("Failed to fetch restaurants:", err);
            setError("식당 데이터를 불러오지 못했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabChange = (location) => {
        setActiveTab(location);
        setPage(0); // 지역 변경 시 첫 페이지로 이동
    };

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
        setPage(0); // 카테고리 변경 시 첫 페이지로 이동
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="search-page-container">
            <h1>더 보기 페이지</h1>

            <p className="selected-info">
                <strong>지역:</strong> {activeTab} | <strong>카테고리:</strong> {activeCategory}
            </p>

            {/* 지역 버튼 */}
            <div className="tabs">
                {["영대 정문", "영대 후문", "미대 뒷길"].map((location) => (
                    <button
                        key={location}
                        className={`tab-button ${activeTab === location ? "active" : ""}`}
                        onClick={() => handleTabChange(location)}
                    >
                        {location}
                    </button>
                ))}
            </div>

            {/* 카테고리 버튼 */}
            <div className="category-buttons">
                {["일식", "양식", "중식", "카페"].map((category) => (
                    <button
                        key={category}
                        className={`category-button ${activeCategory === category ? "active" : ""}`}
                        onClick={() => handleCategoryChange(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* 지도와 리스트 */}
            <KakaoMap restaurants={restaurants} />

            {/* 페이지네이션 */}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={index === page ? "active" : ""}
                        onClick={() => handlePageChange(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>

    );
}

export default SearchPage;
