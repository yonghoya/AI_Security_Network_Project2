// 컨텐츠 스크립트 (content.js)

// 세부 URL을 가져옴
const detailURL = window.location.href;
let cardDiv;
let isDragging = false;
let isPopoverVisible = false;
let offsetX, offsetY, popoverOffsetX, popoverOffsetY;

function createDraggableCard(backgroundColor, text) {
  cardDiv = document.createElement('div'); // 전역 변수로 설정
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

  // 아이콘 및 텍스트를 포함하는 div 생성
  const contentDiv = document.createElement('div');
  contentDiv.style.display = 'flex'; // 내용을 수평으로 정렬

  const cardText = document.createElement('div');
  cardText.textContent = text;

  contentDiv.appendChild(cardText);

  cardDiv.appendChild(contentDiv);

  cardDiv.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - cardDiv.getBoundingClientRect().left;
    offsetY = e.clientY - cardDiv.getBoundingClientRect().top;

    // 팝오버 위치 초기화
    const popoverDiv = document.querySelector('.popover');
    if (popoverDiv) {
      popoverOffsetX = e.clientX - popoverDiv.getBoundingClientRect().left;
      popoverOffsetY = e.clientY - popoverDiv.getBoundingClientRect().top;
    }

    cardDiv.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;

    cardDiv.style.right = 'auto';
    cardDiv.style.top = newY + 'px';
    cardDiv.style.left = newX + 'px';

    // 팝오버 위치 업데이트
    const popoverDiv = document.querySelector('.popover');
    if (popoverDiv) {
      const newPopoverX = e.clientX - popoverOffsetX;
      const newPopoverY = e.clientY - popoverOffsetY;
      popoverDiv.style.left = newPopoverX + 'px';
      popoverDiv.style.top = newPopoverY + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    cardDiv.style.cursor = 'grab';
  });

  return cardDiv;
}

(async () => {
  const response = await chrome.runtime.sendMessage({ action: 'checkURL', url: detailURL, rootURL: window.location.host });
  console.log(window.location.host);
  console.log(response);
  switch (response.results) {
    case "benign":
      const allowedDiv = createDraggableCard('#19C37D', '');

      // 아이콘 및 텍스트를 포함하는 div 생성
      const benignContent = document.createElement('div');
      benignContent.style.display = 'flex'; // 내용을 수평으로 정렬

      // 아이콘 스타일 조정 (SVG 코드로 직접 삽입)
      const benignIcon = document.createElement('span');
      benignIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shield-fill-check" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.240.829.240s.548-.108.829-.240a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm2.146 5.146a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647z"/>
        </svg>
      `;
      benignIcon.style.marginRight = '7px'; // 아이콘과 텍스트 사이의 간격 조절
      benignIcon.style.color = 'white'; // 아이콘 색상 설정

      // 텍스트 스타일 조정
      const benignText = document.createElement('span');
      benignText.textContent = '안전한 사이트 입니다.';
      benignText.style.fontSize = '14px'; // 텍스트 크기 조절
      benignText.style.color = 'white'; // 텍스트 색상 설정

      benignContent.appendChild(benignIcon);
      benignContent.appendChild(benignText);

      allowedDiv.appendChild(benignContent);
      document.body.appendChild(allowedDiv);
      break;
    case "SERVER ERROR":
      const errorDiv = createDraggableCard('yellow', 'Server ERROR');
      errorDiv.style.color = 'black'; 
      errorDiv.style.fontSize = '14px'; // 텍스트 크기 조절
      document.body.appendChild(errorDiv);
      break;
    default:
      //#4285F4
      const blockedDiv = createDraggableCard("#EA2A3D", '');
      blockedDiv.classList.add('flash-animation'); // 애니메이션 클래스 추가
      const styleSheet = document.createElement('style');
      styleSheet.type = 'text/css';

      // 애니메이션을 정의
      styleSheet.innerHTML = `
        @keyframes flashBackground {
          0% { background-color: #EA2A3D; }
          50% { background-color: #4285F4; }
          100% { background-color: #EA2A3D; }
        }

        .flash-animation {
          animation: flashBackground 2s 2;
        }
      `;

      // <head> 요소에 CSS 스타일 시트를 추가
      document.head.appendChild(styleSheet);
      const blockedcontain = document.createElement('div');
      blockedcontain.style.display = 'flex';
      blockedcontain.style.flexDirection = 'column'; // 내용을 세로로 정렬
      blockedcontain.style.alignItems = 'center';

      // 아이콘 및 텍스트를 포함한 div 생성
      const blockedContent = document.createElement('div');
      blockedContent.style.display = 'flex'; // 내용을 수평으로 정렬

      // 아이콘 스타일 조정 (SVG 코드로 직접 삽입)
      const blockedIcon = document.createElement('span');
      blockedIcon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shield-fill-exclamation" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.240.829.240s.548-.108.829-.240a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm-.55 8.502L7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0"/>
        </svg>
      `;
      blockedIcon.style.marginRight = '7px'; // 아이콘과 텍스트 사이의 간격 조절
      blockedIcon.style.color = 'white'; // 아이콘 색상 설정

      // 텍스트 스타일 조정
      const blockedText = document.createElement('span');
      blockedText.textContent = '의심스러운 사이트 입니다.';
      blockedText.style.fontSize = '14px'; // 텍스트 크기 조절
      blockedText.style.color = 'white'; // 텍스트 색상 설정

      // 버튼 스타일 조정
      const button = document.createElement('button');
      button.textContent = 'Click Me'; // 버튼 텍스트 설정
      button.style.marginTop = '8px'; // 버튼과 텍스트 사이의 간격 조절

      // 버튼 내부 여백 및 카드 스타일 설정
      button.style.padding = '10px'; // 내부 여백을 적용
      button.style.border = '1px solid white'; // 테두리 굵기 설정
      button.style.borderRadius = '5px'; // 카드의 모서리를 둥글게 만듦
      button.style.backgroundColor = 'transparent'; // 배경색을 투명으로 설정
      button.style.color = 'white'; // 버튼 글씨 색상을 흰색으로 설정
      button.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)'; // 그림자 추가 (선택 사항)

      // 버튼 클릭 이벤트 처리
      button.addEventListener('click', () => {
        if (!isPopoverVisible) {
          // 팝 오버 스타일을 적용할 div 요소 생성
          const popoverDiv = document.createElement('div');
          popoverDiv.classList.add('popover'); // 팝 오버를 식별하기 위한 클래스 추가
          popoverDiv.style.position = 'absolute'; // 절대 위치로 설정
      
          // 팝 오버 위치 계산 및 설정
          const cardRect = cardDiv.getBoundingClientRect();
          const topOffset = 3; // 원하는 상단 간격을 픽셀 단위로 설정
          popoverDiv.style.top = cardRect.bottom + topOffset + 'px'; // cardDiv 바로 아래에 표시
          popoverDiv.style.left = cardRect.left + 'px'; // cardDiv의 왼쪽에 표시
      
          popoverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'; // 배경색
          popoverDiv.style.color = 'white'; // 텍스트 색상
          popoverDiv.style.padding = '8px'; // 내부 여백
          popoverDiv.style.borderRadius = '5px'; // 모서리 둥글게
      
          // 제목 요소 추가
          const titleElement = document.createElement('h3');
          titleElement.textContent = '팝오버 제목';
          titleElement.style.textAlign = 'center'; // 제목 가운데 정렬
      
          // 내용 요소 추가
          const contentElement = document.createElement('p');
          contentElement.textContent = '팝오버 내용을 이곳에 추가하세요.';
      
          // 제목과 내용 요소를 팝오버에 추가
          popoverDiv.appendChild(titleElement);
          popoverDiv.appendChild(contentElement);
      
          // 팝 오버 div을 body에 추가
          document.body.appendChild(popoverDiv);
      
          isPopoverVisible = true; // 팝 오버를 표시 중으로 설정
        } else {
          // 팝 오버가 이미 표시 중이면 숨김 처리
          const popoverDiv = document.querySelector('.popover');
          if (popoverDiv) {
            document.body.removeChild(popoverDiv); // 팝 오버 div 제거
          }
      
          isPopoverVisible = false; // 팝 오버를 숨김 처리
        }
      });

      blockedContent.appendChild(blockedIcon);
      blockedContent.appendChild(blockedText);

      blockedcontain.appendChild(blockedContent);
      blockedcontain.appendChild(button); // 버튼을 blockedcontain에 추가

      blockedDiv.appendChild(blockedcontain);
      document.body.appendChild(blockedDiv);
      break;
  }
})();
