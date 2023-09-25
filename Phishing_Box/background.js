chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'checkURL') {
    const urlToCheck = request.url;
    const rooturl = request.rootURL;

    chrome.storage.local.get(rooturl, function (result) {
      if (Object.keys(result).length !== 0) {
        console.log("Cached data found");
        sendResponse({ results: result[rooturl] });
      } else {
        console.log("New data");

        
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
            
            const dataToCache = {};
            dataToCache[rooturl] = result.predict_result;
            chrome.storage.local.set(dataToCache);

            sendResponse({ results: result.predict_result });
          })
          .catch((error) => {
            console.error('데이터를 가져오는 중 오류 발생:', error);
            sendResponse({ results: "SERVER ERROR" });
          });
      }
    });

    return true;
  }
});
