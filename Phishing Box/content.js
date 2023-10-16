var element = document.querySelector('div.feedmain');
element.parentElement.removeChild(element);
// 컨텐츠 스크립트 (content.js)

// 세부 URL을 가져옴
const detailURL = window.location.href;

// 백그라운드 스크립트에 메시지를 보냄
chrome.runtime.sendMessage({ action: 'checkURL', url: detailURL }, function(response) {
  // 백그라운드 스크립트에서 응답이 올 경우 처리할 로직을 추가할 수 있음
  alert(response);
});
