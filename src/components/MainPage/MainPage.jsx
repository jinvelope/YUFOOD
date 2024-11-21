import React, { Component } from 'react';
import axios from 'axios';
import './MainPage.css';
import Logo from '../Image/Logo.png';
import Search_icon from '../Image/Search_icon.png';
import { useNavigate } from 'react-router-dom';
import NavigateWrapper from './NavigateWrapper';
import { Link } from 'react-router-dom';

const foodTags = {
    "일식": "restaurantsJapanese",
    "중식": "restaurantsChinese",
    "양식": "restaurantsWestern",
    "카페": "restaurantsCafeBakery",
};
class MainPage extends Component {
    state = {
        // 각 음식 태그별 식당 목록
        restaurantsJapanese: [],
        restaurantsChinese: [],
        restaurantsWestern: [],
        restaurantsCafeBakery: [],
        // 각 카테고리의 페이지 인덱스
        pageIndex: {
            restaurantsJapanese: 0,
            restaurantsChinese: 0,
            restaurantsWestern: 0,
            restaurantsCafeBakery: 0,
        },
        // 모달 상태
        isModalOpen: false,
        selectedLocation: "영대 정문", // 기본값 설정
    };

    componentDidMount() {
        Object.entries(foodTags).forEach(([tag, stateKey]) => {
            const encodedTag = encodeURIComponent(tag);
            axios.get(`http://localhost:8080/api/yufood/category/${encodedTag}`)
                .then(response => {
                    console.log(`Response for ${stateKey}:`, response.data); // 응답 데이터 확인
                    this.setState({ [stateKey]: Array.isArray(response.data) ? response.data : [] });
                })
                .catch(error => {
                    console.error(`There was an error fetching data for ${tag}!`, error);
                    this.setState({ [stateKey]: [] });
                });
        });
    }

    // 페이지 이동 핸들러
    handleNextPage = (stateKey) => {
        this.setState((prevState) => ({
            pageIndex: {
                ...prevState.pageIndex,
                [stateKey]: prevState.pageIndex[stateKey] + 1,
            },
        }));
    };

    handlePrevPage = (stateKey) => {
        this.setState((prevState) => ({
            pageIndex: {
                ...prevState.pageIndex,
                [stateKey]: prevState.pageIndex[stateKey] - 1,
            },
        }));
    };
    fetchRestaurantsByLocation = () => {
        const { selectedLocation } = this.state;

        Object.entries(foodTags).forEach(([tag, stateKey]) => {
            const encodedTag = encodeURIComponent(tag);
            const encodedLocation = encodeURIComponent(selectedLocation);

            axios.get(`http://localhost:8080/api/yufood/category/${encodedTag}/location/${encodedLocation}`)
                .then(response => {
                    this.setState({ [stateKey]: response.data });
                })
                .catch(error => {
                    console.error(`There was an error fetching data for ${tag} at ${selectedLocation}!`, error);
                });
        });
    };
    handleLocationChange = (location) => {
        this.setState({ selectedLocation: location }, () => {
            this.fetchRestaurantsByLocation();
            this.closeModal();
        });
    };
    // 모달 열기 및 닫기 핸들러
    openModal = () => {
        this.setState({ isModalOpen: true });
    };

    closeModal = () => {
        this.setState({ isModalOpen: false });
    };
    handleMoreButtonClick = () => {
        this.props.navigate('./search');
    };

    renderCategorySection(categoryName, restaurants, stateKey) {
        const { pageIndex } = this.state;
        const itemsPerPage = 5;
        const currentPage = pageIndex[stateKey];
        const startIndex = currentPage * itemsPerPage;
        const visibleRestaurants = restaurants.slice(startIndex, startIndex + itemsPerPage);

        return (
            <section className="Section">
                <button className="Section_Button"
                        onClick={() => this.handlePrevPage(stateKey)}
                        disabled={currentPage === 0}
                >
                    ◀️
                </button>
                <div className="Section_Wrap">
                    <div className="Section_Title">
                        <h2 className="Title_Name">#{categoryName}</h2>
                        <button className="More_button" onClick={this.handleMoreButtonClick}>자세히 보기</button>
                    </div>
                    <span className="Line"></span>
                    <div className="Section_Slide">
                        <ul className="Restaurant_Card_List">
                            {visibleRestaurants && visibleRestaurants.length > 0 ? (
                                visibleRestaurants.map((restaurant, index) => (
                                    <li className="Restaurant_Card" key={index}>
                                        <a href={`http://localhost:3000/restaurant/${restaurant.rid}`} target="_blank" rel="noopener noreferrer">
                                            <img src={restaurant.image1} alt={restaurant.rname} className="Restaurant_Image" />
                                            <div className="Restaurant_Info">
                                                <h3 className="Restaurant_Name">{restaurant.rname}</h3>
                                                <p className="Restaurant_Address">{restaurant.addr}</p>
                                                <p className="Restaurant_Rating">⭐ {restaurant.rating}</p>
                                            </div>
                                        </a>
                                    </li>
                                ))
                            ) : (
                                <p>식당 정보를 불러오는 중입니다...</p>
                            )}
                        </ul>
                    </div>
                </div>
                <button className="Section_Button"
                        onClick={() => this.handleNextPage(stateKey)}
                        disabled={startIndex + itemsPerPage >= restaurants.length}
                >
                    ▶️
                </button>
            </section>
        );
    }

    render() {
        const { restaurantsJapanese, restaurantsChinese, restaurantsWestern, restaurantsCafeBakery, isModalOpen } = this.state;

        return (
            <div className="Container">
                <div className="Header">
                    <img src={Logo} alt="" className="Header_left_logo"/>
                    <div className="Header_center_search">
                        <input type="text" placeholder="지역,음식 또는 식당명을 입력해주세요!" />
                        <button className="search_button">
                            <img src={Search_icon} alt="search" />
                        </button>
                    </div>
                    <Link to ='/login'><div className="Header_right">로그인</div></Link>
                    <Link to ='/join'><div className="Header_right">회원가입</div></Link>
                </div>
                <nav>
                    <ul className="nav_ul">
                        <li><a href="http://localhost:3000/">Home</a></li>
                        <li><a href="http://localhost:3000/">공지사항</a></li>
                        <li><a href="http://localhost:3000/">사이트 소개</a></li>
                        <li><a href="http://localhost:3000/">Q & A</a></li>
                    </ul>
                </nav>
                <div className="Choice_Location">
                    <div className="Location_text">
                        <div className="text1">당신을 위한</div>
                        <span className="weight_font">영남대 </span>
                        <span>맛집 추천</span>
                    </div>
                    <div className="Location_button">
                        <button className="button1" onClick={this.openModal}>위치 선택</button>
                    </div>
                </div>
                <main className="Content">
                    <div className="BodyBox">
                        {this.renderCategorySection("일식", restaurantsJapanese, "restaurantsJapanese")}
                        {this.renderCategorySection("중식", restaurantsChinese, "restaurantsChinese")}
                        {this.renderCategorySection("양식", restaurantsWestern, "restaurantsWestern")}
                        {this.renderCategorySection("카페", restaurantsCafeBakery, "restaurantsCafeBakery")}
                    </div>
                </main>

                {isModalOpen && (
                    <div className="modal" onClick={this.closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close" onClick={this.closeModal}>&times;</span>
                            <h3>위치를 선택하세요:</h3>
                            <button  className="LocationChoiceButton" onClick={() => this.handleLocationChange("정문")}>영대 정문</button>
                            <button className="LocationChoiceButton" onClick={() => this.handleLocationChange("후문")}>영대 후문</button>
                            <button className="LocationChoiceButton" onClick={() => this.handleLocationChange("미뒷")}>미대 뒷길</button>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default NavigateWrapper(MainPage);
