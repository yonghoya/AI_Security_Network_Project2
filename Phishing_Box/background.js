chrome.runtime.onInstalled.addListener(({ reason, details }) => {
  if (reason === 'install') {
    chrome.tabs.create({
      url: "popup.html"
    });
  } else if (reason === 'update') {
    console.log('Phishing Box updated!');
  }
});


const cachedResults = {};


let checkedURLs = [];


chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
  if (request.action === 'checkURL') {
    const urlToCheck = request.url;

    if (!checkedURLs.includes(urlToCheck)) {
      
      console.log(`Checking URL: ${urlToCheck}`);

      try {
        
        const data = { url: urlToCheck };

        if (cachedResults.hasOwnProperty(urlToCheck)) {
          sendResponse({ result: cachedResults[urlToCheck] }); 
        } else {
          const response = await fetch('https://example.com/predict', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('서버에서 오류 응답');
          }

          const result = await response.json();
          
          cachedResults[urlToCheck] = result;
          
          sendResponse({ result });
        }

        checkedURLs.push(urlToCheck);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        sendResponse({ results: "ERROR" });
      }
    } else {
      console.log(`URL already checked: ${urlToCheck}`);
      sendResponse({ results: "URL already checked" });
    }
   
    return true;
  }
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'updateIcon') {
    
    chrome.extension.getViews({ type: 'popup' }).forEach(function(popup) {
      popup.postMessage({ action: 'updateIcon', isMalicious: message.isMalicious }, '*');
    });
  }
});


