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

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});
