const myPage = document.getElementById("mypage-btn");
const settings = document.getElementById("settings-btn");

lucide.createIcons(); // Lucide 아이콘 렌더링

myPage.addEventListener("click", function (e) {
  e.preventDefault();
  location.href = "myPage.html";
});

settings.addEventListener("click", function (e) {
  e.preventDefault();
  location.href = "setting.html";
});
