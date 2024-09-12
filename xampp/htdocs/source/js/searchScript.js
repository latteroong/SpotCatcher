let locPosition = new kakao.maps.LatLng(0.0, 0.0);
let detailAddr = ""
let geocoder = new kakao.maps.services.Geocoder();

function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

function daumPostcode(num) {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }
            
            // 주소 정보를 해당 필드에 넣는다.
            document.getElementById("loc"+num).value = addr;
        }
    }).open({
        q: detailAddr
    });
}

// 삭제 버튼 상태를 업데이트하는 함수
function updateRemoveButtons() {
    const removeButtons = document.querySelectorAll('.removeLocationBtn');
    if (removeButtons.length === 2) {
        removeButtons[0].disabled = true;
        removeButtons[1].disabled = true;
    } else {
        removeButtons.forEach(button => button.disabled = false);
    }
}

document.getElementById('addLocationBtn').addEventListener('click', function() {
    const newLocationDiv = document.createElement('div');
    newLocationDiv.className = 'location';

    const locationCount = document.querySelectorAll('.location').length + 1;

    newLocationDiv.innerHTML = `
        <p>위치 ${locationCount} 입력</p>
        <input type="text" onclick="daumPostcode(${locationCount})" id="loc${locationCount}" name="location[]">
        <button type="button" class="removeLocationBtn">삭제</button>
    `;

    document.getElementById('locations').appendChild(newLocationDiv);

    // 새로 추가된 삭제 버튼에 이벤트 리스너를 추가합니다.
    newLocationDiv.querySelector('.removeLocationBtn').addEventListener('click', function() {
        newLocationDiv.remove();
        updateLocationLabels();
        updateRemoveButtons();
    });

    updateLocationLabels();
    updateRemoveButtons();
});

// 기존의 삭제 버튼에 이벤트 리스너를 추가합니다.
document.querySelectorAll('.removeLocationBtn').forEach(function(button) {
    button.addEventListener('click', function() {
        button.parentElement.remove();
        updateLocationLabels();
        updateRemoveButtons();
    });
});

// 위치 라벨을 업데이트하는 함수
function updateLocationLabels() {
    document.querySelectorAll('.location').forEach(function(locationDiv, index) {
        locationDiv.querySelector('p').textContent = `위치 ${index + 1} 입력`;
    });
}

// 폼 검증 함수
function validateForm(event) {
    const locationInputs = document.querySelectorAll('input[name="location[]"]');
    const keywordInputs = document.querySelector('input[name="keyword"]');
    let isValid = true;

    locationInputs.forEach(function(input) {
        if (input.value.trim() === '') {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });

    if (keywordInputs.value.trim() === '') {
        isValid = false;
        keywordInputs.style.borderColor = 'red';
    } else {
        keywordInputs.style.borderColor = '';
    }

    if (!isValid) {
        alert('모든 위치 입력 필드를 채워주세요.');
        event.preventDefault();
    }
}

// 폼 제출 이벤트에 검증 함수를 연결합니다.
document.getElementById('locationForm').addEventListener('submit', validateForm);

updateRemoveButtons();

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨 
    }; 

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
if (navigator.geolocation) {
    
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        
        locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            message = '<div style="padding:5px;">현재 위치</div>'; // 인포윈도우에 표시될 내용입니다
        
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
        
        searchDetailAddrFromCoords(locPosition, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                detailAddr = !!result[0].road_address ? result[0].road_address.address_name:"";
            }
        });
            
    });
    
} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    
    locPosition = new kakao.maps.LatLng(33.450701, 126.570667),    
        message = 'geolocation을 사용할수 없어요..'
        
    displayMarker(locPosition, message);
}

// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(locPosition, message) {

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({  
        map: map, 
        position: locPosition
    }); 
    
    var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

    // 인포윈도우를 생성합니다
    var infowindow = new kakao.maps.InfoWindow({
        content : iwContent,
        removable : iwRemoveable
    });
    
    // 인포윈도우를 마커위에 표시합니다 
    infowindow.open(map, marker);
    
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);      
}

let box_observer = new ResizeObserver(entries => {
    for (let entry of entries) {
      // 감시 대상의 크기가 변화했을 때 실행할 코드
      console.log('사이즈 변했음!');
      map.setCenter(locPosition); 
    }
  });

const box = document.querySelector('#map');

box_observer.observe(box);

