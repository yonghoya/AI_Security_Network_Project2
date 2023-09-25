chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'updateIcon') {
    const icon = document.getElementById('icon');
    if (message.isMalicious) {
      icon.src = 'red_icon.png';
    } else {
      icon.src = 'green_icon.png';
    }
  }
});

