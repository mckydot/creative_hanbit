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

// ===== 페이지 네비게이션 =====
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

// ===== 채팅 관련 =====
const chatInput = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSendBtn");
const chatMessages = document.getElementById("chatMessages");

// ✅ 메시지 추가 함수
function addMessage(text, sender = "user") {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("chat-message", sender);
  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return msgDiv;
}

// ✅ 초기 AI 인사 메시지
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    addMessage(
      "안녕하세요! 👋 \n저는 한빛모아의 AI 도우미입니다.\n무엇을 도와드릴까요?\n\n예시)\n- 25세 청년 지원 정책 추천해줘\n- 30세 면접 관련 정책 추천해줘",
      "bot"
    );
  }, 400);
});

// ✅ 로딩 메시지 추가 함수
function showLoading() {
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("chat-message", "bot", "loading");
  loadingDiv.innerHTML = `
    <div class="loading-dots">
      <span></span><span></span><span></span>
    </div>
  `;
  chatMessages.appendChild(loadingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return loadingDiv;
}

async function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  chatInput.value = "";

  const loadingDiv = showLoading();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
      signal: AbortSignal.timeout(120000),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // 🔹 Content-Type 확인 후 JSON / HTML 처리
    const contentType = response.headers.get("Content-Type") || "";
    let data;
    if (contentType.includes("application/json")) {
      data = await response.json();
      if (data.status === "success" && data.response) {
        addMessage(data.response, "bot");
      } else {
        addMessage("죄송합니다. 오류가 발생했습니다.", "bot");
      }
    } else if (contentType.includes("text/html")) {
      // HTML 응답이면 innerHTML로 렌더링
      const html = await response.text();
      const msgDiv = addMessage("", "bot");
      msgDiv.innerHTML = html;
    } else {
      addMessage("알 수 없는 형식의 응답입니다.", "bot");
    }

    loadingDiv.remove();
  } catch (error) {
    console.error("네트워크 오류:", error);
    loadingDiv.remove();
    if (error.name === "TimeoutError") {
      addMessage(
        "⏱️ 응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
        "bot"
      );
    } else {
      addMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.", "bot");
    }
  }
}

// ===== 이벤트 등록 =====
chatSendBtn.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// 뒤로가기 버튼 기능
document.getElementById("back-btn").addEventListener("click", function () {
  location.href = "main.html";
});
