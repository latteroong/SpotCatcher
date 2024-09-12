<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SpotCatcher</title>
        <link rel="stylesheet" href="css/mainStyle.css"/>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&display=swap" rel="stylesheet">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Gothic+A1:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
   </head>
   <header>
        <a href = "spotcatcher.php">
            <p>SpotCatcher</p>
        </a>
    </header>
    <?php
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $locations = $_POST['location'];
            $keyword = $_POST['keyword'];
            $locations = json_encode($locations);
    ?>
            <link rel="stylesheet" href="css/resultStyle.css"/>
            <script>
                var locations = <?=$locations?>;
                var keyword = '<?=$keyword?>';
                window.phpData = {
                    locations: locations,
                    keyword: keyword
                };
            </script>
            <body>
                <div class="map_wrap">
                    <div id="map"></div>
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
                <div class="input-container"></div>
                <button onclick="directions()">길찾기</button>
                <div id="btnKakao">
                    <img src="img/arrow_down.png" id="kakao-link-btn" alt="카카오톡 링크 공유하기">
                </div>
            </body>
            <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=2c5ea89bb07fbfafa9c6b8ebea734dfd&libraries=services,clusterer,drawing"></script>
            <script src="js/resultScript.js"></script>
            
    <?php
        } else {
    ?>
            <link rel="stylesheet" href="css/searchStyle.css"/>
            <body>
                <div class="introduce">
                    <div class="Intro_explain_1" style="margin : 10px;">
                        <h4>
                        원하는 장소,원하는 거리 비율로<br>
                        장소를 추천해드립니다
                        </h4>
                        <p>현재 위치와 원하는 인원 수를 입력해 <br>주세요.</p>
                    </div>
                    <div class="Intro_explain_2" style="margin : 10px;">
                    <h4> Spot Catcher로<br>
                        약속 장소를 정해 보세요</h4>
                        <form id="goDown">
                            <button type="button"><img src='img/arrow_down.png' style="border : none; width : 50px; height : 50px; "></button>
                        </form>
                    </div>
                </div>
                <form id="locationForm" action="spotcatcher.php" method="post">
                    <div class="inputKeyWord">
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
                    <table>
                        <tr>
                            <td>
                                <button type="button" id="addLocationBtn">위치 추가</button>
                            </td>
                            <td>
                                <button type="submit">제출</button>
                            </td>
                            
                        </tr>
                    </table>
                </form>
                <div id="map"></div>
            </body>
            <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
            <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=2c5ea89bb07fbfafa9c6b8ebea734dfd&libraries=services,clusterer,drawing"></script>
            <script src="js/searchScript.js"></script>
            <?php
        }
    ?>
</html>