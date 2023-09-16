var element = document.querySelector('div.feedmain');
element.parentElement.removeChild(element);
// 컨텐츠 스크립트 (content.js)


const detailURL = window.location.href;

// 백그라운드 스크립트에 메시지를 보냄
chrome.runtime.sendMessage({ action: 'checkURL', url: detailURL }, function(response) {
  if (response && response.result) {
    alert(response.result); 
  } else {
    alert('응답이 없거나 유효하지 않습니다.');
  }
});
