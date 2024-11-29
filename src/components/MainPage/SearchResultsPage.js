import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./SearchResultsPage.css";
import Logo from '../Image/Logo.png';

const SearchResultsPage = () => {
    const location = useLocation();
    const [results, setResults] = useState([]);
    const [sortedResults, setSortedResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [sortType, setSortType] = useState("rating");
    const [query, setQuery] = useState(""); // 검색어 저장
    const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
    const itemsPerPage = 20; // 한 페이지에 표시할 최대 아이템 수

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const queryParam = params.get("query");
        if (queryParam) {
            setQuery(queryParam);
            fetchSearchResults(queryParam);
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => console.error("Error fetching location:", error)
        );
    }, [location]);

    const fetchSearchResults = (query) => {
        setIsLoading(true);
        axios
            .get(`http://localhost:8080/api/yufood/search?query=${encodeURIComponent(query)}`)
            .then((response) => {
                setResults(response.data);
                setSortedResults(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching search results:", error);
                setIsLoading(false);
            });
    };

    const sortByRating = () => {
        const sorted = [...results].sort((a, b) => b.rating - a.rating);
        setSortedResults(sorted);
        setSortType("rating");
    };

    const sortByDistance = () => {
        if (!currentPosition) {
            alert("현재 위치를 가져올 수 없습니다.");
            return;
        }

        const sorted = [...results].sort((a, b) => {
            const distanceA = calculateDistance(currentPosition, a.location || {});
            const distanceB = calculateDistance(currentPosition, b.location || {});
            return distanceA - distanceB;
        });

        setSortedResults(sorted);
        setSortType("distance");
    };

    const calculateDistance = (pos1, pos2) => {
        if (!pos2 || typeof pos2.latitude !== "number" || typeof pos2.longitude !== "number") {
            return Infinity;
        }
        const dx = pos1.latitude - pos2.latitude;
        const dy = pos1.longitude - pos2.longitude;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const paginatedResults = sortedResults.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <div className="search-results-container">
            <h1>"{query}" 검색결과</h1>

            <div className="sort-buttons">
                <button
                    className={`sort-button ${sortType === "rating" ? "active" : ""}`}
                    onClick={sortByRating}
                >
                    별점순
                </button>
                <button
                    className={`sort-button ${sortType === "distance" ? "active" : ""}`}
                    onClick={sortByDistance}
                >
                    거리순
                </button>
            </div>

            {isLoading ? (
                <p>검색 중입니다...</p>
            ) : paginatedResults.length > 0 ? (
                <>
                    <div className="results-grid">
                        {paginatedResults.map((result, index) => (
                            <div className="result-card" key={result.rid}>
                                <a
                                    href={`http://localhost:3000/restaurant/${result.rid}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={result.image1 || "/default-image.jpg"}
                                        alt={result.rname}
                                        className="result-image"
                                    />
                                    <div className="result-info">
                                        <h3 className="result-name">{result.rname}</h3>
                                        <p className="result-address">{result.addr}</p>
                                        <p className="result-rating">⭐ {result.rating}</p>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="pagination">
                        {Array.from(
                            { length: Math.ceil(sortedResults.length / itemsPerPage) },
                            (_, pageIndex) => (
                                <button
                                    key={pageIndex}
                                    className={pageIndex === currentPage ? "active" : ""}
                                    onClick={() => handlePageChange(pageIndex)}
                                >
                                    {pageIndex + 1}
                                </button>
                            )
                        )}
                    </div>
                </>
            ) : (
                <p>검색 결과가 없습니다.</p>
            )}
        </div>
    );
};

export default SearchResultsPage;
