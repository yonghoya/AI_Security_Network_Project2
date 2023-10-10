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
    const rooturl = request.rootURL;
    chrome.storage.local.get(rooturl)
      .then((result) => {
        if(Object.keys(result).length != 0){
          console.log("have data")
          chrome.notifications.create("phishingbox_noti", {type: "basic",title: urlToCheck, message: result.rooturl, iconUrl:"phishing_box.png"})
          .then(setTimeout(()=> chrome.notifications.clear("phishingbox_noti"), 1500))
          sendResponse({results: result});
      }else{
        console.log("new data")
        // Django 웹 애플리케이션에 데이터 전송
        fetch('http://15.164.49.80:8000/predict', {
          method: 'POST',
          body: JSON.stringify({url:urlToCheck}),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application / json',
          }
        })
          .then((response) => response.json())
          .then((result) => {
            // 결과를 캐시에 저장
            chrome.storage.local.set({rooturl: result.predict_result});
            // 처리된 결과를 content scripts로 반환
            chrome.notifications.create("phishingbox_noti", {type: "basic",title: urlToCheck, message: result.predict_result, iconUrl:"phishing_box.png"})
            .then(setTimeout(()=> chrome.notifications.clear("phishingbox_noti"), 1500))
            sendResponse({results: result.predict_result});
          })
          .catch((error) => {
            console.log('데이터를 가져오는 중 오류 발생:', error);
          chrome.notifications.create("phishingbox_noti", {type: "basic",title: urlToCheck, message: error.message, iconUrl:"phishing_box.png"})
          .then(setTimeout(()=> chrome.notifications.clear("phishingbox_noti"), 5500))
            sendResponse({results: "SERVER ERROR"});
            });
      };
    })
      .catch((error) => {sendResponse({results: error.message});});
    // 응답을 보냄
    setTimeout(() => sendResponse({ shite: "q123" }), 500);
  };
  return true;
});


