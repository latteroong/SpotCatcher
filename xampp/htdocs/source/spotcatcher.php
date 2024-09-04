<!DOCTYPE html>
<html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SpotCatcher</title>
        <link rel="stylesheet" href="mainStyle.css"/>
    </head>
    <?php
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $locations = $_POST['location'];
            $keyword = $_POST['keyword'];
            $locations = json_encode($locations);
    ?>
            <link rel="stylesheet" href="resultStyle.css"/>
            <script>
                var locations = <?=$locations?>;
                var keyword = '<?=$keyword?>';
                window.phpData = {
                    locations: locations,
                    keyword: keyword
                };
            </script>
            <body>
                <div class="header">
                    <p>SpotCatcher</p>
                </div>
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
            </body>
            <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=2c5ea89bb07fbfafa9c6b8ebea734dfd&libraries=services,clusterer,drawing"></script>
            <script src="resultScript.js"></script>
    <?php
        } else {
    ?>
            <link rel="stylesheet" href="searchStyle.css"/>
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
                <div id="map"></div>
            </body>
            <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
            <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=2c5ea89bb07fbfafa9c6b8ebea734dfd&libraries=services,clusterer,drawing"></script>
            <script src="searchScript.js"></script>
            <?php
        }
    ?>
</html>