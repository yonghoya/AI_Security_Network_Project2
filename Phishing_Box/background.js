// 백그라운드 페이지 로드
chrome.runtime.onInstalled.addListener(({ reason, details }) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: "popup.html"
    });
  } else if (reason === 'update') {
    // 확장 프로그램 업데이트
    console.log('Phishing Box updated!');
  }
});

chrome.storage.local.clear().then(() => {
  // 데이터를 모두 삭제한 후, 새로운 데이터를 로컬 스토리지에 저장하거나 Django 웹 애플리케이션에서 가져올 수 있습니다.
  chrome.storage.local.set({ myKey: 'myValue' }, function() {
    console.log('데이터가 저장되었습니다.');
  });

  // 저장된 데이터 읽기 
  chrome.storage.local.get('myKey', function(result) {
    console.log('저장된 데이터:', result.myKey);
  });
});

// 이전에 검색한 URL 결과를 저장하는 객체
const cachedResults = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkURL') {
    const urlToCheck = request.url;
    
    // data 변수 정의
    const data = {
      url: urlToCheck
    };

    // 캐시된 결과가 있는지 확인
    if (cachedResults.hasOwnProperty(urlToCheck)) {
      sendResponse({ result: cachedResults[urlToCheck] }); // 캐시된 결과 반환
    } else {
      // Django 웹 애플리케이션에 데이터 전송
      fetch('http://15.164.49.80:8000/predict', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(result => {
          // 결과를 캐시에 저장
          cachedResults[urlToCheck] = result;
          // 처리된 결과를 content scripts로 반환
          sendResponse({ result });
        })
        .catch(error => {
          console.error('데이터를 가져오는 중 오류 발생:', error);
          sendResponse({ results: "ERROR" });
        });
    }

    // 비동기 응답을 유지
    return true;
  }
});

// 로컬 스토리지에서 이미 검사한 URL을 저장하는 배열
let checkedURLs = [];

// 새로운 탭이나 창이 열릴 때 초기화
chrome.tabs.onCreated.addListener(function(tab) {
  checkedURLs = [];
});

// 메시지를 수신하여 URL을 검사하고 중복 여부를 확인
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkURL') {
    const urlToCheck = request.url;

    if (!checkedURLs.includes(urlToCheck)) {
      // URL 검사, 결과를 웹 페이지로 보내거나 다른 작업을 수행
      console.log(`Checking URL: ${urlToCheck}`);

      // URL 이미 검사한 것으로 표시
      checkedURLs.push(urlToCheck);

      // 캐시를 클리어
      chrome.storage.local.clear().then(() => {
        // Django 웹 애플리케이션에 데이터 전송 및 결과를 저장
        fetch('http://15.164.49.80:8000/predict', {
          method: 'POST',
          body: JSON.stringify({ url: urlToCheck }),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        })
          .then((response) => response.json())
          .then((result) => {
            // 결과를 캐시에 저장
            cachedResults[urlToCheck] = result;
            
            // 처리된 결과를 content scripts로 반환
            chrome.notifications.create("phishingbox_noti", { type: "basic", title: urlToCheck, message: result.predict_result, iconUrl: "phishing_box.png" })
              .then(setTimeout(() => chrome.notifications.clear("phishingbox_noti"), 1500))
            
            sendResponse({ results: result.predict_result });
          })
          .catch((error) => {
            console.log('데이터를 가져오는 중 오류 발생:', error);
            
            chrome.notifications.create("phishingbox_noti", { type: "basic", title: urlToCheck, message: error.message, iconUrl: "phishing_box.png" })
              .then(setTimeout(() => chrome.notifications.clear("phishingbox_noti"), 5500))
            
            sendResponse({ results: "SERVER ERROR" });
          });
      });

    } else {
      console.log(`URL already checked: ${urlToCheck}`);
      sendResponse({ results: "URL already checked" });
    }
    // 응답을 보냄
    return true;
  }
});

// Content Script에서 메시지를 받는 이벤트 리스너 추가
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "checkURL") {
    const urlToCheck = request.url;

    // 팝업 페이지를 열고 URL 정보를 전달
    const popupViews = chrome.runtime.getViews({ type: "popup" });
    if (popupViews.length > 0) {
      popupViews[0].urlToCheck = urlToCheck;
      
      // 팝업을 열기 위한 코드
      chrome.browserAction.openPopup();
      
      // 응답을 보냄
      sendResponse({ success: true });
    }
  }
});
