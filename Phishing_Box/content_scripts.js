// 현재 페이지 URL 가져오기
const currentURL = window.location.href;

// 백그라운드 스크립트에 현재 URL을 보내기
chrome.runtime.sendMessage({ action: 'checkURL', url: currentURL }, function(response) {
  if (response && response.result) {
    // 서버에서 받은 결과에 따라 올바른 종류의 결과 페이지를 출력합니다.
    if (response.result === 'malicious') {
      // 악성 페이지
      alert('malicious');
    } else if (response.result === 'safe') {
      // 안전한 페이지
      alert('safe');
    } else {
      // 다른 결과
      alert('?');
    }
  } else {
    alert('응답이 없거나 유효하지 않습니다.');
  }
});
const urlToCheck = "실제로 확인할 URL"; 

chrome.runtime.sendMessage({ action: "checkURL", url: urlToCheck }, function(response) {
  console.log("Content Script에서 백그라운드로 메시지 전송");
});


// 0919
