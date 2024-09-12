document.addEventListener('DOMContentLoaded', (event) => {
    // PHP에서 전달된 데이터에 접근
    if (typeof window.phpData !== 'undefined') {
        let locations = window.phpData.locations;
        let keyword = window.phpData.keyword;

        console.log('Locations:', locations); // ["서울", "부산", "대구"]
        console.log('Keyword:', keyword);     // 예제 키워드

        // 위치 목록을 담을 컨테이너 div를 생성
        const containerDiv = document.createElement('div');
        containerDiv.className = 'input-container';

        // locations 배열을 순회하며 인풋 박스와 버튼 추가
        locations.forEach((location, index) => {
            // 새로운 div 요소 생성
            const locationDiv = document.createElement('div');
            locationDiv.className = 'weightValues';
            
            // 주소 텍스트 생성
            const addressLabel = document.createElement('span');
            addressLabel.textContent = index+1;
            addressLabel.className = 'address-label';

            // 새로운 인풋 박스 생성
            const inputBox = document.createElement('input');
            inputBox.type = 'number';
            inputBox.value = 1; // 초기 값으로 1 설정
            inputBox.id = `weight${index}`;
            inputBox.name = `inputWeight[]`;
            inputBox.min = 1;  // 최소값 설정
            inputBox.max = 10; // 최대값 설정
            inputBox.step = 1; // 단계 설정

            // 주소 텍스트와 인풋 박스를 div에 추가
            locationDiv.appendChild(addressLabel);
            locationDiv.appendChild(inputBox);

            // 컨테이너 div에 추가
            containerDiv.appendChild(locationDiv);
        });
        // 제출 버튼 생성
        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.textContent = '제출';
        submitButton.className = 'submit-button';
        submitButton.onclick = async function() {
            console.log("버튼클릭");
            const inputBoxValue = document.querySelectorAll('input[name="inputWeight[]"]');
            
            await inputBoxValue.forEach((boxvalue, index) => {
                weight = weight.with(index, parseInt(boxvalue.value));
                console.log(index, boxvalue.value);
            });
            await console.log(weight);
            // 배열 2개 초기화
            data.length = 0;
            await timer(500);
            await setMarker();
        };   

        // 기존의 #map_wrap div에 새로 생성한 컨테이너를 추가
        const mapWrap = document.querySelector('.map_wrap');
        if (mapWrap) {
            mapWrap.appendChild(containerDiv);
            mapWrap.appendChild(submitButton);
        } else {
            console.log('map_wrap element not found');
        }
    } else {
        console.log('PHP data not available');
    }
});

const timer = ms=>new Promise(res=>setTimeout(res, ms));


const mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  

// 지도를 생성합니다    
const map = new kakao.maps.Map(mapContainer, mapOption);

let infowindow = new kakao.maps.InfoWindow({zIndex:1});
let coordinates = []; 
let coords = new kakao.maps.LatLng(0.0, 0.0);

let options;

let bounds = new kakao.maps.LatLngBounds();
let setRadius = 100;
let research = 0;
let weight = [0,0,0,0,0,0,0,0];

// 마커를 담을 배열입니다
let markers = [];

// 장소 검색 객체를 생성합니다
let ps = new kakao.maps.services.Places(); 

// 주소-좌표 변환 객체를 생성합니다
let geocoder = new kakao.maps.services.Geocoder();

// 현재 클릭한 주소 아이디
let clickId = "";

function setBounds() {
    // LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정합니다
    // 이때 지도의 중심좌표와 레벨이 변경될 수 있습니다
    map.setBounds(bounds);
}

function searchPlaces() {

    let keyword = document.getElementById('keyword').value;

    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch(keyword, placesSearchCBbutton, options);
}

// 지도에 마커를 표시하는 함수입니다
function displayMarker(places) {
    let listEl = document.getElementById('placesList'), 
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment();
    
    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    console.log(places);

    for (let j=0; j<places.length; j++ ) {

        // 마커를 생성하고 지도에 표시합니다
        let placePosition = new kakao.maps.LatLng(places[j].y, places[j].x),
            marker = addMarker(placePosition, j), 
            itemEl = getListItem(j, places[j]); // 검색 결과 항목 Element를 생성합니다

        fragment.appendChild(itemEl);
        // 마커에 클릭이벤트를 등록합니다
        (function(marker, place) { // 클로저를 사용하여 현재 'j' 값을 캡처합니다.
            kakao.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                infowindow.open(map, marker);
                clickId = place.id;
            });

            itemEl.onclick =  function () {
                infowindow.close();
                infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                infowindow.open(map, marker);
                clickId = place.id;
            };
        })(marker, places[j]);

        listEl.appendChild(fragment);
        menuEl.scrollTop = 0;
    }
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {
    let el = document.createElement('li'),
    itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
                '<div class="info">' +
                '   <h5>' + places.place_name + '</h5>';

    if (places.road_address_name) {
        itemStr += '    <span>' + places.road_address_name + '</span>' +
                    '   <span class="jibun gray">' +  places.address_name  + '</span>';
    } else {
        itemStr += '    <span>' +  places.address_name  + '</span>'; 
    }
                
    itemStr += '  <span class="tel">' + places.phone  + '</span>' +
                '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
    let imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions =  {
            spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
            marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage 
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for ( let i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
    let paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i; 

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild (paginationEl.lastChild);
    }

    for (i=1; i<=pagination.last; i++) {
        let el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i===pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function(i) {
                return function() {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
}

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCB (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK && data.length >= 3) {
        displayMarker(data);
        displayPagination(pagination);
    } else if (research < 4){
        research += 1;
        console.log("다시 서치");
        setRadius += 500;
        options = {
            location: coords,
            radius: setRadius,
        };
        ps.keywordSearch(keyword, placesSearchCB, options);
    } else {
        // 검색결과가 없습니다.
        alert("키워드 <?=$keyword?> 검색결과가 없습니다.");
        history.back();  
    }
}

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
function placesSearchCBbutton (data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        displayMarker(data);
        displayPagination(pagination);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;
    } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
    }
}


function getCenter() {
    console.log("getCenter 시작");
    const avgPointResult = getAvgPoint(data);
    center_x = avgPointResult.x;
    center_y = avgPointResult.y;
    coords = new kakao.maps.LatLng(center_x, center_y);
    console.log("coords", coords);

    options = {
        location: coords,
        radius: setRadius,
    };

    setBounds();
    console.log("끝");
    }

async function setMarker(){
    await searchLoc();
    await timer(500);

    await getCenter();
    await timer(500);

    // 키워드로 장소를 검색합니다
    await ps.keywordSearch(keyword, placesSearchCB, options);
}

async function searchLoc() {
    for (let i = 0; i < locations.length; i++) {
        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(locations[i], function(result, status) {
            // 정상적으로 검색이 완료됐으면 
            if (status === kakao.maps.services.Status.OK) {
                let coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                if (weight[i] == 0) {
                    data.push(Point(parseFloat(result[0].y), parseFloat(result[0].x), 1));
                    console.log("0 입니다.");
                } else {
                    data.push(Point(parseFloat(result[0].y), parseFloat(result[0].x), parseInt(weight[i])));
                    console.log(weight, "0 이 아닙니다.", i);
                }
                
                console.log(data);
                console.log("===");
                // 결과값으로 받은 위치를 마커로 표시합니다
                removeMarker();

                let marker = new kakao.maps.Marker({
                    map: map,
                    position: coords
                });

                bounds.extend(coords);

                // 인포윈도우로 장소에 대한 설명을 표시합니다
                let infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="width:150px;text-align:center;padding:6px 0;">' + (i+1) + '</div>'
                });
                infowindow.open(map, marker);
            } else {
                // 검색결과가 없습니다.
                alert((i+1) + "번째 주소 검색결과가 없습니다.");
                history.back();                     
            }
        });
    }
    console.log("searchLoc 끝");
}

setMarker();

//box크기 변화에 따른 중심점 변경
let box_observer = new ResizeObserver(entries => {
    for (let entry of entries) {
    // 감시 대상의 크기가 변화했을 때 실행할 코드
    console.log('사이즈 변했음!');
    map.setBounds(bounds);
    }
});
const box = document.querySelector('#map');
box_observer.observe(box);

// 가중치 계산 식
// Point
const Point = (x,y,w) => ({
    x,
    y,
    w,
});

const data = [];

function weightedAverage(v1, w1, v2, w2) {
    if (w1 === 0) return v2;
    if (w2 === 0) return v1;
    return ((v1 * w1) + (v2 * w2)) / (w1 + w2);
}
  
function avgPoint(p1, p2) {
    console.log("p1", p1);
    console.log("p2", p2);
    return {
        x: weightedAverage(p1.x, p1.w, p2.x, p2.w),
        y: weightedAverage(p1.y, p1.w, p2.y, p2.w),
        w: p1.w + p2.w,
    }
}

function getAvgPoint(arr) {
    console.log("arr",arr);
    return arr.reduce(avgPoint, {
        x: 0,
        y: 0,
        w: 0
    });
}

// 길찾기
function directions() {
    if (clickId == "") {
        alert("찾을 위치를 클릭해주세요.");
    } else {
        location.href=`https://map.kakao.com/link/to/${clickId}`;
    }
    
}
