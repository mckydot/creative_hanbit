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
// Lucide 아이콘이 완전히 로드된 뒤에 실행되도록
window.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  // 북마크 버튼 클릭 기능
  document.querySelectorAll(".bookmark-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");

      // 애니메이션 효과
      btn.animate([{ transform: "scale(1.3)" }, { transform: "scale(1)" }], {
        duration: 250,
        easing: "ease-out",
      });
    });
  });
});
