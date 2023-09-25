const currentURL = window.location.href;

chrome.runtime.sendMessage({ action: 'checkURL', url: currentURL }, function(response) {
  if (response && response.result) {
    if (response.result === 'malicious') {
      
      chrome.runtime.sendMessage({ action: 'updateIcon', isMalicious: true });
    } else if (response.result === 'safe') {
      
      chrome.runtime.sendMessage({ action: 'updateIcon', isMalicious: false });
    } else {
      alert('error');
    }
  } else {
    alert('No response');
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'checkURL') {
    fetch('http://example.com/check', {  
      method: 'POST',
      body: JSON.stringify({ url: message.url }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(result => {
      if (result.status === 'malicious') {
        chrome.runtime.sendMessage({ action: 'updateIcon', isMalicious: true });
      } else {
        chrome.runtime.sendMessage({ action: 'updateIcon', isMalicious: false });
      }
      sendResponse({ result: result.status });
    })
    .catch(error => {
      console.error('error', error);
      alert('error');
      sendResponse({ result: 'error' });
    });
    
    return true;
  }
});
