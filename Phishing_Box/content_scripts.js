// 컨텐츠 스크립트 (content.js)

// 세부 URL을 가져옴
const detailURL = window.location.href;

function createDraggableCard(backgroundColor, text) {
  const cardDiv = document.createElement('div');
  cardDiv.style.position = 'fixed';
  cardDiv.style.top = '20px';
  cardDiv.style.right = '20px';
  cardDiv.style.backgroundColor = backgroundColor;
  cardDiv.style.padding = '20px';
  cardDiv.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)';
  cardDiv.style.borderRadius = '5px';
  cardDiv.style.zIndex = '9999';
  cardDiv.style.overflow = 'hidden';
  cardDiv.style.textOverflow = 'ellipsis';
  cardDiv.style.whiteSpace = 'nowrap';
  cardDiv.style.cursor = 'grab';

  const cardText = document.createElement('div');
  cardText.textContent = text;

  cardDiv.appendChild(cardText);

  let isDragging = false;
  let offsetX, offsetY;

  cardDiv.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - cardDiv.getBoundingClientRect().left;
    offsetY = e.clientY - cardDiv.getBoundingClientRect().top;
    cardDiv.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    cardDiv.style.right = 'auto';
    cardDiv.style.top = newY + 'px';
    cardDiv.style.left = newX + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    cardDiv.style.cursor = 'grab';
  });

  return cardDiv;
}

(async () => {
  const response = await chrome.runtime.sendMessage({ action: 'checkURL', url: detailURL, rootURL: window.location.host });
  // do something with response here, not outside the function
  console.log(window.location.host);
  console.log(response);
  switch(response.results){
    case "benign":
      const allowedDiv = createDraggableCard('green', `Allowed: ${detailURL}`);
      document.body.appendChild(allowedDiv);
      break;
    case "SERVER ERROR":
      const errorDiv = createDraggableCard('yellow', `ERROR: ${detailURL}`);
      document.body.appendChild(errorDiv);
      break;
    default:
      const blockedDiv = createDraggableCard('red', `${response.results}: ${detailURL}`);
      document.body.appendChild(blockedDiv);
      break;
  }
})();