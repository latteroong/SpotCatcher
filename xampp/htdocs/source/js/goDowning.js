document.getElementById('goDown').addEventListener('click', function() {
    // .inputKeyWord 클래스를 가진 div 요소를 선택
    const inputDiv = document.querySelector('.inputKeyWord');
    // .show 클래스를 추가하여 애니메이션 시작
    inputDiv.classList.add('show');
    // 애니메이션이 끝난 후 input에 포커스
    setTimeout(() => {
        const input = inputDiv.querySelector('input');
        input.focus();
    }, 500); // 애니메이션 시간과 일치하도록 설정 (여기서는 500ms)
});