/* global kakao */
import React, { useEffect, useRef, useState } from "react";
import "./KakaoMap.css";

const KakaoMap = ({ restaurants }) => {
    const mapRef = useRef(null);
    const [markers, setMarkers] = useState([]); // 마커 상태 관리

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps) {
            console.error("카카오 지도 API가 로드되지 않았습니다.");
            return;
        }

        const mapContainer = mapRef.current;
        const mapOption = {
            center: new kakao.maps.LatLng(35.836, 128.754), // 영남대 중심 좌표
            level: 4,
        };

        const map = new kakao.maps.Map(mapContainer, mapOption);
        const geocoder = new kakao.maps.services.Geocoder();
        const bounds = new kakao.maps.LatLngBounds();

        const tempMarkers = []; // 임시 마커 배열

        // 주소를 마커로 변환
        restaurants.forEach((restaurant) => {
            if (!restaurant.addr) return;

            geocoder.addressSearch(restaurant.addr, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    const latitude = parseFloat(result[0].y);
                    const longitude = parseFloat(result[0].x);

                    const markerPosition = new kakao.maps.LatLng(latitude, longitude);

                    // 기본 마커 이미지
                    const defaultMarkerImage = new kakao.maps.MarkerImage(
                        "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                        new kakao.maps.Size(24, 35)
                    );

                    // 강조 마커 이미지
                    const highlightedMarkerImage = new kakao.maps.MarkerImage(
                        "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
                        new kakao.maps.Size(36, 52)
                    );

                    const marker = new kakao.maps.Marker({
                        position: markerPosition,
                        image: defaultMarkerImage,
                        map,
                    });

                    // 지도 범위에 마커 위치 추가
                    bounds.extend(markerPosition);

                    // 마커 데이터 저장
                    tempMarkers.push({
                        marker,
                        id: restaurant.rid,
                        defaultMarkerImage,
                        highlightedMarkerImage,
                    });
                }
            });
        });

        Promise.all(
            restaurants.map(
                (restaurant) =>
                    new Promise((resolve) =>
                        geocoder.addressSearch(restaurant.addr, (result, status) => {
                            if (status === kakao.maps.services.Status.OK) {
                                const position = new kakao.maps.LatLng(result[0].y, result[0].x);
                                bounds.extend(position);
                                resolve(position);
                            } else {
                                resolve(null);
                            }
                        })
                    )
            )
        ).then(() => {
            setMarkers(tempMarkers); // 모든 마커 업데이트
            if (bounds.isEmpty()) {
                map.setCenter(new kakao.maps.LatLng(35.836, 128.754)); // 영남대 중심 좌표
            } else {
                map.setBounds(bounds); // 모든 마커를 포함하는 범위 설정
            }
        });

        return () => {
            if (mapContainer) {
                mapContainer.innerHTML = ""; // 지도 DOM 초기화
            }
        };
    }, [restaurants]);

    const handleMouseOver = (restaurantId) => {
        const targetMarker = markers.find((m) => m.id === restaurantId);
        if (targetMarker) {
            targetMarker.marker.setImage(targetMarker.highlightedMarkerImage); // 강조 마커 이미지 설정
        }
    };

    const handleMouseOut = (restaurantId) => {
        const targetMarker = markers.find((m) => m.id === restaurantId);
        if (targetMarker) {
            targetMarker.marker.setImage(targetMarker.defaultMarkerImage); // 기본 마커 이미지로 복원
        }
    };

    return (
        <div>
            {/* 지도 */}
            <div ref={mapRef} id="map" style={{ width: "100%", height: "400px", margin: "20px 0" }} />

            {/* 가게 리스트 */}
            <div className="restaurant-list">
                {restaurants.map((restaurant) => (
                    <div
                        key={restaurant.rid}
                        className="restaurant-item"
                        onMouseOver={() => handleMouseOver(restaurant.rid)}
                        onMouseOut={() => handleMouseOut(restaurant.rid)}
                    >
                        <img src={restaurant.image1} alt={restaurant.rname} className="restaurant-image" />
                        <h3>{restaurant.rname}</h3>
                        <p>{restaurant.addr}</p>
                        <p>⭐ {restaurant.rating}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KakaoMap;
