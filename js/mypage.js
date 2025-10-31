lucide.createIcons();

const mypage = document.getElementById("mypage-btn");
const settings = document.getElementById("settings-btn");
const calendar = document.getElementById("calendar-btn");
const mypage2 = document.getElementById("mypage-btn2");
const home = document.getElementById("home-btn");
const ai = document.getElementById("ai-btn");
const settings2 = document.getElementById("settings-btn2");

mypage.addEventListener("click", () => {
  location.href = "mypage.html";
});
settings.addEventListener("click", () => {
  location.href = "setting.html";
});
calendar.addEventListener("click", () => {
  location.href = "calendar.html";
});
mypage2.addEventListener("click", () => {
  location.href = "mypage.html";
});
home.addEventListener("click", () => {
  location.href = "main.html";
});
ai.addEventListener("click", () => {
  location.href = "";
});
settings2.addEventListener("click", () => {
  location.href = "setting.html";
});

// 버튼 이벤트 예시
document.querySelector(".photo-edit-btn").addEventListener("click", () => {
  alert("사진 편집 기능");
});

document.querySelector(".edit-btn").addEventListener("click", () => {
  alert("정보 수정 페이지로 이동");
});

document.querySelector(".add-keyword-btn").addEventListener("click", () => {
  alert("키워드 추가 기능");
});
