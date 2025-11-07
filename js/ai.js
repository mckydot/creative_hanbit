lucide.createIcons();

// ===== 네비게이션 버튼 =====
const mypageBtn = document.getElementById("mypage-btn");
const settingsBtn = document.getElementById("settings-btn");
const calendarBtn = document.getElementById("calendar-btn");
const mypage = document.getElementById("mypage-btn2");
const settings = document.getElementById("settings-btn2");
const ai = document.getElementById("ai-btn");
const home = document.getElementById("home-btn");

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
