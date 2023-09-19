// popup.js

document.addEventListener('DOMContentLoaded', function() {
    // 백그라운드 스크립트로부터 URL 정보를 가져옴
    const urlToCheck = chrome.extension.getBackgroundPage().urlToCheck;
  
    // 가져온 URL 정보를 팝업 페이지에 표시
    const urlElement = document.getElementById('urlElement'); // 팝업 HTML에서 해당 요소의 ID를 찾아야 합니다.
    if (urlElement) {
      urlElement.textContent = urlToCheck;
    }
    

  });
  

  //1919