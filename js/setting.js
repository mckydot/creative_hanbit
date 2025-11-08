lucide.createIcons();

const mypage1 = document.getElementById("mypage-btn");
const settings1 = document.getElementById("settings-btn");
const ai = document.getElementById("ai-btn");
const calendar = document.getElementById("calendar-btn");
const home = document.getElementById("home-btn");
const mypage2 = document.getElementById("mypage-btn2"); // ✅ 오타 수정
const settings2 = document.getElementById("settings-btn2");

mypage1.addEventListener("click", () => {
  location.href = "mypage.html";
});
mypage2.addEventListener("click", () => {
  location.href = "mypage.html";
});
settings1.addEventListener("click", () => {
  location.href = "settings.html";
});
settings2.addEventListener("click", () => {
  location.href = "settings.html"; // ✅ 오타 수정 (settigs -> settings)
});
home.addEventListener("click", () => {
  location.href = "main.html";
});
ai.addEventListener("click", () => {
  location.href = "ai.html";
});
calendar.addEventListener("click", () => {
  location.href = "calendar.html";
});
