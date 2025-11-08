lucide.createIcons();

// ===== 네비게이션 버튼 =====
const mypageBtn = document.getElementById("mypage-btn");
const settingsBtn = document.getElementById("settings-btn");
const calendarBtn = document.getElementById("calendar-btn");
const mypage = document.getElementById("mypage-btn2");
const settings = document.getElementById("settings-btn2");
const ai = document.getElementById("ai-btn");
const home = document.getElementById("home-btn");
const API_URL =
  "https://kullm-chatbot-api2025-production.up.railway.app/api/chat";
// home.addEventListener("clcik", () => {
//   location.href = "main.html";
// });
if (home)
  home.addEventListener("click", () => {
    location.href = "main.html";
  });

if (ai)
  ai.addEventListener("click", () => {
    location.href = "ai.html";
  });

if (mypage)
  mypage.addEventListener("click", () => {
    location.href = "mypage.html";
  });

if (settings)
  settings.addEventListener("click", () => {
    location.href = "setting.html";
  });

if (mypageBtn)
  mypageBtn.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "mypage.html";
  });

if (calendarBtn)
  calendarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "calendar.html";
  });

if (settingsBtn)
  settingsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "setting.html";
  });

const chatInput = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSendBtn");
const chatMessages = document.getElementById("chatMessages");

async function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;

  // 메시지 생성
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("my-message");
  msgDiv.textContent = msg;

  // 메시지 추가
  chatMessages.appendChild(msgDiv);

  // 스크롤 아래로
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // 입력 초기화
  chatInput.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: msg,
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status === "success") {
      console.log(data.response);
    } else {
      console.error("API 오류:", data.error);
      return "죄송합니다. 오류가 발생했습니다.";
    }
  } catch (error) {
    console.error("네트워크 오류:", error);

    if (error.name === "TimeoutError") {
      return "⏱️ 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
    }
    return "네트워크 오류가 발생했습니다. 다시 시도해주세요.";
  }
}

chatSendBtn.addEventListener("click", sendMessage);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// 뒤로가기 버튼 기능
document.getElementById("back-btn").addEventListener("click", function () {
  location.href = "main.html";
});
