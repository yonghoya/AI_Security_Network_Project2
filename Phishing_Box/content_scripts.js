// 컨텐츠 스크립트 (content.js)

// 세부 URL을 가져옴
const detailURL = window.location.href;


(async () => {
  const response = await chrome.runtime.sendMessage({ action: 'checkURL', url: detailURL });
  // do something with response here, not outside the function
  console.log("134")
  console.log(response)
})();