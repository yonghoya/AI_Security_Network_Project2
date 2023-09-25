const predictionResults = {};

function updateIcon(isMalicious) {
  const iconPath = isMalicious ? "red.png" : "green.png";
  chrome.browserAction.setIcon({ path: iconPath });
}


function getPrediction(urlToCheck, sendResponse) {
  if (predictionResults[urlToCheck]) {
    const isMalicious = predictionResults[urlToCheck] === 'malicious';
    updateIcon(isMalicious);
    sendResponse({ result: predictionResults[urlToCheck] });
  } else {
    fetch('http://15.164.49.80:8000/predict', {
      method: 'POST',
      body: JSON.stringify({ url: urlToCheck }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(result => {
        const isMalicious = result.status === 'malicious';
        predictionResults[urlToCheck] = result.status; 
        updateIcon(isMalicious); 
        sendResponse({ result: result.status });
      })
      .catch(error => {
        console.error('error', error);
        alert('error');
        sendResponse({ result: 'error' });
      });
  }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === 'checkURL') {
    const urlToCheck = message.url;
    getPrediction(urlToCheck, sendResponse);
    return true; 
  }
});
