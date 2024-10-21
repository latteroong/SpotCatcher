let locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
let detailAddr = ""
let geocoder = new kakao.maps.services.Geocoder();
let width = 500;
let height = 600;
let map;


function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

function daumPostcode(element) {
    new daum.Postcode({
        width: width, //생성자에 크기 값을 명시적으로 지정해야 합니다.
        height: height,
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
            element.value = addr;
        }
    }).open({
        left: (window.screen.width / 2) - (width / 2),
        top: (window.screen.height / 2) - (height / 2),
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
// 위치 텍스트 클릭 시 수정 가능하게 하기
async function makeLocationEditable(location) {
    // 현재 텍스트 값을 받아옴
    const currentValue = location.textContent;

    // 입력창을 생성
    const { value: inputPrompt } = await Swal.fire({
        title: "별명을 지정하세요.",
        input: "text",
        inputPlaceholder: currentValue,
        showCancelButton: true,
        icon: "info", //"info,success,warning,error" 중 택1
        iconColor: '#009900',
        confirmButtonColor: '#50b498',
        confirmButtonText: "확인"
    });

    // 사용자가 입력한 값을 텍스트로 설정
    if (inputPrompt) {
        location.textContent = inputPrompt;
    }
}

// 초기 위치 텍스트에 클릭 이벤트 추가
document.querySelectorAll('.locText').forEach((element, index) => {
    element.onclick = function() {
        makeLocationEditable(element);
    };
});
// 초기 인풋칸에 클릭 이벤트 추가
document.querySelectorAll('.location input[type="text"]').forEach(input => {
    input.onclick = function(event) {
        daumPostcode(input);
    };
});

document.getElementById('addLocationBtn').addEventListener('click', function() {
    const addButtons = document.querySelectorAll('.addLocationBtn');
    const newLocationDiv = document.createElement('div');
    newLocationDiv.className = 'location';

    const locationCount = document.querySelectorAll('.location').length + 1;
    if (locationCount > 8) {
        addButtons.disabled = true;
        Swal.fire({
            title: "알림",
            text: "위치는 최대 8개 까지 입력 가능합니다.", 
            icon: "info", //"info,success,warning,error" 중 택1
            iconColor: '#009900',
            confirmButtonColor: '#50b498',
            confirmButtonText: "확인"
        });
    } else {
        addButtons.disabled = false;
        newLocationDiv.innerHTML = `
            <p class="locText" style="cursor: pointer;">위치 ${locationCount}</p>
            <input type="text" name="locations">
            <button type="button" class="removeLocationBtn">삭제</button>
        `;

        document.getElementById('locations').appendChild(newLocationDiv);

        // 새로 추가된 삭제 버튼에 이벤트 리스너를 추가합니다.
        newLocationDiv.querySelector('.removeLocationBtn').addEventListener('click', function() {
            newLocationDiv.remove();
            updateRemoveButtons();
        });
        // 위치 텍스트에 클릭 이벤트 갱신
        document.querySelectorAll('.locText').forEach((element, index) => {
            element.onclick = function() {
                makeLocationEditable(element);
            };
        });
        // 인풋칸에 클릭 이벤트 갱신
        document.querySelectorAll('.location input[type="text"]').forEach(input => {
            input.onclick = function(event) {
                daumPostcode(input);
            };
        });

        updateRemoveButtons();
    }
    
});

// 기존의 삭제 버튼에 이벤트 리스너를 추가합니다.
document.querySelectorAll('.removeLocationBtn').forEach(function(button) {
    button.addEventListener('click', function() {
        button.parentElement.remove();
        updateRemoveButtons();
    });
});


// 폼 검증 함수
function validateForm(event) {
    const locationInputs = document.querySelectorAll('input[name="locations"]');
    const keywordInputs = document.querySelector('input[name="keyword"]');
    let isValid = true;

    locationInputs.forEach(function(input) {
        if (input.value.trim() === '') {
            isValid = false;
            input.style.borderColor = '#E3463D';
        } else {
            input.style.borderColor = '';
        }
    });

    if (keywordInputs.value.trim() === '') {
        isValid = false;
        keywordInputs.style.borderColor = '#E3463D';
    } else {
        keywordInputs.style.borderColor = '';
    }

    if (!isValid) {
        Swal.fire({
            title: "알림",
            text: "모든 위치 입력 필드를 채워주세요.", 
            icon: "info", //"info,success,warning,error" 중 택1
            iconColor: '#009900',
            confirmButtonColor: '#50b498',
            confirmButtonText: "확인"
        });
        event.preventDefault();
    }
}

// 폼 제출 이벤트에 검증 함수를 연결합니다.
document.getElementById('locationForm').addEventListener('submit',  function(event) {
    event.preventDefault();
    // 모든 locText 클래스의 p 태그 선택
    const locTexts = document.querySelectorAll('.locText');
    const values = [];
    locTexts.forEach(p => {
        values.push(p.textContent);
    });

    // 텍스트 값을 input 요소에 저장
    const keywordInput = document.createElement('input');
    keywordInput.type = 'hidden';
    keywordInput.name = 'locName'; // 서버에 전송할 키 이름
    keywordInput.value = JSON.stringify(values); // p 태그의 텍스트 값

    // 폼에 추가
    this.appendChild(keywordInput);
    validateForm();
    // 폼 제출
    this.submit(); // 폼을 제출합니다
    
    // 모든 히든 인풋 박스를 선택합니다.
    const hiddenInputs = document.querySelectorAll('input[type="hidden"]');

    // 선택한 인풋 박스를 반복하며 삭제합니다.
    hiddenInputs.forEach(input => {
        input.parentNode.removeChild(input);
    });
});

updateRemoveButtons();

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: locPosition, // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨 
};

// HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
if (navigator.geolocation) {
    
    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    navigator.geolocation.getCurrentPosition(function(position) {
        
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        
        locPosition = new kakao.maps.LatLng(lat, lon);
        
        
        searchDetailAddrFromCoords(locPosition, function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                if (result[0].road_address) {
                    detailAddr = result[0].road_address.address_name;
                } else if (result[0].address) {
                    detailAddr = result[0].address.address_name;
                } else {
                    detailAddr = "";
                }
            }
        });

        setMap(locPosition);
    });
    
} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    
    locPosition = new kakao.maps.LatLng(33.450701, 126.570667),    
        message = 'geolocation을 사용할수 없어요..'
        
    // displayMarker(locPosition, message);
    setMap(locPosition);
}

function setMap(locPosi) {
    map = new kakao.maps.Map(mapContainer, 
        mapOption = { 
        center: locPosi, // 지도의 중심좌표
        level: 2 // 지도의 확대 레벨 
    });
    map.setDraggable(false);
    map.setZoomable(false);
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

