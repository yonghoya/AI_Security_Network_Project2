// content.js
const allowedWebsites = ["https://www.naver.com/", "https://www.google.com/"]; // 허용할 웹사이트 목록

const currentURL = window.location.href;

if (allowedWebsites.includes(currentURL)) {
  
  const allowedDiv = createDraggableCard('green', `Allowed: ${currentURL}`);
  document.body.appendChild(allowedDiv);
} else {
  
  const blockedDiv = createDraggableCard('red', `Blocked: ${currentURL}`);
  document.body.appendChild(blockedDiv);
}

// 드래그 가능한 카드를 생성하는 함수
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
