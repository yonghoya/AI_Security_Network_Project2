// background.js

// clear storage data upon opening browser
chrome.storage.local.clear().then(
  ()=>{//cleared
});
// 데이터 캐싱 및 저장 (올바른 key와 value 사용)
chrome.storage.local.set({ myKey: 'myValue' }, function() {
  console.log('데이터가 저장되었습니다.');
});

// 저장된 데이터 읽기 (올바른 key 사용)
chrome.storage.local.get('myKey', function(result) {
  console.log('저장된 데이터:', result.myKey);
});

// 이벤트 리스너 추가: content scripts에서 메시지를 기다림
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkURL') {
    const urlToCheck = request.url;
    chrome.storage.local.get(urlToCheck)
      .then((result) => {
        if(Object.keys(result).length != 0){
          console.log("have data")
          sendResponse({results: result});
      }else{
        console.log("new data")
        // Django 웹 애플리케이션에 데이터 전송
        /*fetch('https://your-django-app-url.com/api/endpoint', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then((response) => response.json())
          .then((result) => {
            // 결과를 캐시에 저장
            chrome.storage.local.set({urlToCheck: result});
            // 처리된 결과를 content scripts로 반환
            sendResponse({results: result});
          })
          .catch((error) => {
            console.error('데이터를 가져오는 중 오류 발생:', error);
            sendResponse({results: "ERROR"});
          });*/
      };})
      .then(chrome.notifications.create("phishingbox_noti", {type: "basic",title: urlToCheck, message: "CLEAN", iconUrl:"phishing_box.png"}))
      .then(setTimeout(()=> chrome.notifications.clear("phishingbox_noti"), 1500))
      .catch((error) => {sendResponse({results: "CLEAN"});});
    // 응답을 보냄
    setTimeout(() => sendResponse({ shite: "q123" }), 500);
  };
  return true;
});


