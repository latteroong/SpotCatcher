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
                <div id="map"></div>
            </body>
            <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=2c5ea89bb07fbfafa9c6b8ebea734dfd&libraries=services,clusterer,drawing"></script>
            <script>
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

                // 장소 검색 객체를 생성합니다
                var ps = new kakao.maps.services.Places(); 

                function gatMinMax(coordinates){
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
                }

                function setBounds() {
                    // LatLngBounds 객체에 추가된 좌표들을 기준으로 지도의 범위를 재설정합니다
                    // 이때 지도의 중심좌표와 레벨이 변경될 수 있습니다
                    map.setBounds(bounds);
                }

                // 지도에 마커를 표시하는 함수입니다
                function displayMarker(place) {
                    // 마커를 생성하고 지도에 표시합니다
                    var marker = new kakao.maps.Marker({
                        map: map,
                        position: new kakao.maps.LatLng(place.y, place.x) 
                    });

                    // 마커에 클릭이벤트를 등록합니다
                    kakao.maps.event.addListener(marker, 'click', function() {
                        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
                        infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
                        infowindow.open(map, marker);
                    });
                }

                async function setMarker(){
                    setTimeout(() => gatMinMax(coordinates), 2000);
                    setTimeout(() => {
                        var center_x = parseFloat(x_min) + ((parseFloat(x_max) - parseFloat(x_min)) / 2);
                        var center_y = parseFloat(y_min) + ((parseFloat(y_max) - parseFloat(y_min)) / 2);
                        console.log(center_x,'oo', center_y);
                        coords = new kakao.maps.LatLng(center_x, center_y);
                        
                        var marker = new kakao.maps.Marker({
                            map: map,
                            position: coords
                        });
                        options = {
                            location: coords,
                            radius: 1000,
                        };
                        setBounds();
                    }, 3000);

                    // 키워드로 장소를 검색합니다
                    setTimeout(() => ps.keywordSearch('<?=$keyword?>', placesSearchCB, options), 3100);

                    

                    // 키워드 검색 완료 시 호출되는 콜백함수 입니다
                    function placesSearchCB (data, status, pagination) {
                        if (status === kakao.maps.services.Status.OK) {
                            for (var i=0; i<data.length; i++) {
                                displayMarker(data[i]);
                                console.log("우어우어" + data[i]);
                            }
                        } 
                    }
                }

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
                        }
                    });
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