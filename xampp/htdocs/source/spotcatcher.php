<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SpotCatcher</title>
        <link rel="stylesheet" href="style.css" />
    </head>
    <?php
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $locations = $_POST['location'];
            $keyword = $_POST['keyword'];
            // echo $keyword;
    ?>
            <body>
                <div class="header">
                    <p>SpotCatcher</p>
                </div>
                <div class="map_wrap">
                    <div id="map" style="position:relative;"></div>
                    <div id="menu_wrap" class="bg_white">
                        <div class="option">
                            <div>
                                <form onsubmit="searchPlaces(); return false;">
                                    키워드 : <input type="text" value="<?=$keyword?>" id="keyword" size="15"> 
                                    <button type="submit">검색하기</button> 
                                </form>
                            </div>
                        </div>
                        <hr>
                        <ul id="placesList"></ul>
                        <div id="pagination"></div>
                    </div>
                </div>
            </body>
            <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=2c5ea89bb07fbfafa9c6b8ebea734dfd&libraries=services,clusterer,drawing"></script>
            <script>
                const timer = ms=>new Promise(res=>setTimeout(res, ms));


                var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
                    mapOption = {
                        center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
                        level: 3 // 지도의 확대 레벨
                    };  

                // 지도를 생성합니다    
                var map = new kakao.maps.Map(mapContainer, mapOption);

                var infowindow = new kakao.maps.InfoWindow({zIndex:1});
                var coordinates = []; 
                var coords = new kakao.maps.LatLng(0.0, 0.0);

                var coo_x = [];
                var coo_y = [];

                var x_min = 0;
                var x_max = 0;
                var y_min = 0;
                var y_max = 0;

                var options;

                var bounds = new kakao.maps.LatLngBounds();
                var setRadius = 1000;
                var research = 0;

                // 마커를 담을 배열입니다
                var markers = [];

                // 장소 검색 객체를 생성합니다
                var ps = new kakao.maps.services.Places(); 

                function gatMinMax(coordinates){
                    console.log("gatMinMax 시작");
                    console.log(coordinates);
                    coordinates.forEach(function(coordinate) {
                        coo_x.push(coordinate[0]);
                        coo_y.push(coordinate[1]);
                    });
                    x_min = coo_x[0];
                    x_max = coo_x[0];
                    y_min = coo_y[0];
                    y_max = coo_y[0];
                    coo_x.forEach(function(x) {
                        if (x_max < x) {
                            x_max = x;
                        }
                        if (x_min > x) {
                            x_min = x;
                        }
                    });
                    coo_y.forEach(function(y) {
                        if (y_max < y) {
                            y_max = y;
                        }
                        if (y_min > y) {
                            y_min = y;
                        }
                    });
                    console.log(x_min, ',', x_max);
                    console.log("gatMinMax 끝");
                }

                function setBounds() {
                    // LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정합니다
                    // 이때 지도의 중심좌표와 레벨이 변경될 수 있습니다
                    map.setBounds(bounds);
                }

                function searchPlaces() {

                    var keyword = document.getElementById('keyword').value;

                    if (!keyword.replace(/^\s+|\s+$/g, '')) {
                        alert('키워드를 입력해주세요!');
                        return false;
                    }

                    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
                    ps.keywordSearch(keyword, placesSearchCBbutton, options);
                }

                // 지도에 마커를 표시하는 함수입니다
                function displayMarker(places) {
                    var listEl = document.getElementById('placesList'), 
                    menuEl = document.getElementById('menu_wrap'),
                    fragment = document.createDocumentFragment(), 
                    bounds = new kakao.maps.LatLngBounds(), 
                    listStr = '';
                    
                    // 검색 결과 목록에 추가된 항목들을 제거합니다
                    removeAllChildNods(listEl);

                    // 지도에 표시되고 있는 마커를 제거합니다
                    removeMarker();

                    console.log(places);

                    for (let j=0; j<places.length; j++ ) {

                        // 마커를 생성하고 지도에 표시합니다
                        var placePosition = new kakao.maps.LatLng(places[j].y, places[j].x),
                            marker = addMarker(placePosition, j), 
                            itemEl = getListItem(j, places[j]); // 검색 결과 항목 Element를 생성합니다

                        fragment.appendChild(itemEl);
                        // 마커에 클릭이벤트를 등록합니다
                        (function(marker, place) { // 클로저를 사용하여 현재 'j' 값을 캡처합니다.
                            kakao.maps.event.addListener(marker, 'click', function() {
                                infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                                infowindow.open(map, marker);
                            });

                            itemEl.onmouseover =  function () {
                                displayInfowindow(marker, place);
                            };

                            itemEl.onmouseout =  function () {
                                infowindow.close();
                            };
                        })(marker, places[j]);

                        listEl.appendChild(fragment);
                        menuEl.scrollTop = 0;
                    }
                }

                // 검색결과 항목을 Element로 반환하는 함수입니다
                function getListItem(index, places) {
                    var el = document.createElement('li'),
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
                    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
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
                    for ( var i = 0; i < markers.length; i++ ) {
                        markers[i].setMap(null);
                    }   
                    markers = [];
                }

                // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
                function displayPagination(pagination) {
                    var paginationEl = document.getElementById('pagination'),
                        fragment = document.createDocumentFragment(),
                        i; 

                    // 기존에 추가된 페이지번호를 삭제합니다
                    while (paginationEl.hasChildNodes()) {
                        paginationEl.removeChild (paginationEl.lastChild);
                    }

                    for (i=1; i<=pagination.last; i++) {
                        var el = document.createElement('a');
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
                    if (status === kakao.maps.services.Status.OK) {
                        displayMarker(data);
                        displayPagination(pagination);
                    } else if (research < 4){
                        research += 1;
                        console.log("다시 서치");
                        setRadius += 2000;
                        setMarker();
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
                    var center_x = parseFloat(x_min) + ((parseFloat(x_max) - parseFloat(x_min)) / 2);
                    var center_y = parseFloat(y_min) + ((parseFloat(y_max) - parseFloat(y_min)) / 2);
                    console.log(center_x,'oo', center_y);
                    coords = new kakao.maps.LatLng(center_x, center_y);
                    
                    // var marker = new kakao.maps.Marker({
                    //     map: map,
                    //     position: coords
                    // });
                    options = {
                        location: coords,
                        radius: setRadius,
                    };
                    setBounds();
                    console.log("getCenter 끝");
                }

                async function setMarker(){
                    await searchLoc();
                    await timer(500);

                    await gatMinMax(coordinates);
                    await timer(500);

                    await getCenter();
                    await timer(500);

                    // 키워드로 장소를 검색합니다
                    await ps.keywordSearch('<?=$keyword?>', placesSearchCB, options);
                }

                async function searchLoc() {
                    for (let i = 0; i < <?=count($locations)?>; i++) {
                        document.write("위치 " + (i+1) + ": " + <?=json_encode($locations)?>[i] + "<br>");
                        // 주소-좌표 변환 객체를 생성합니다
                        var geocoder = new kakao.maps.services.Geocoder();
                        // 주소로 좌표를 검색합니다
                        geocoder.addressSearch(<?=json_encode($locations)?>[i], function(result, status) {

                            // 정상적으로 검색이 완료됐으면 
                            if (status === kakao.maps.services.Status.OK) {

                                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                                coordinates.push([result[0].y, result[0].x]);
                                console.log([result[0].y, result[0].x]);
                                // 결과값으로 받은 위치를 마커로 표시합니다
                                var marker = new kakao.maps.Marker({
                                    map: map,
                                    position: coords
                                });

                                bounds.extend(coords);

                                // 인포윈도우로 장소에 대한 설명을 표시합니다
                                var infowindow = new kakao.maps.InfoWindow({
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
            </script>
    <?php
        } else {
    ?>
            <body>
                <div class="header">
                    <p>SpotCatcher</p>
                </div>
                <form id="locationForm" action="spotcatcher.php" method="post">
                    <div>
                        <p>키워드 입력</p>
                        <input type="text" name="keyword">
                    </div>
                    <div id="locations">
                        <div class="location">
                            <p>위치 1 입력</p>
                            <input type="text" onclick="daumPostcode(1)" id="loc1" name="location[]">
                            <button type="button" class="removeLocationBtn">삭제</button>
                        </div>
                        <div class="location">
                            <p>위치 2 입력</p>
                            <input type="text" onclick="daumPostcode(2)" id="loc2" name="location[]">
                            <button type="button" class="removeLocationBtn">삭제</button>
                        </div>
                    </div>
                    <button type="button" id="addLocationBtn">위치 추가</button>
                    <button type="submit">제출</button>
                </form>
                <div id="map" style="width:100%;height:350px;"></div>
            </body>
            <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
            <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=2c5ea89bb07fbfafa9c6b8ebea734dfd&libraries=services,clusterer,drawing"></script>
            <script src="script.js"></script>
            <?php
        }
    ?>
</html>