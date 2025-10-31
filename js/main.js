// DOM 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", () => {
  // Lucide 아이콘 렌더링 (한 번만 실행)
  lucide.createIcons();

  // 상단 네비게이션 버튼
  const mypageBtn = document.getElementById("mypage-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const calendarBtn = document.getElementById("calendar-btn");
  const mypage = document.getElementById("mypage-btn2");
  const settings = document.getElementById("settings-btn2");

  mypage.addEventListener("click", () => {
    location.href("mypage.html");
  });
  settings.addEventListener("click", () => {
    location.href = "setting.html";
  });

  if (mypageBtn) {
    mypageBtn.addEventListener("click", (e) => {
      e.preventDefault();
      location.href = "mypage.html";
    });
  }
  if (calendarBtn) {
    calendarBtn.addEventListener("click", (e) => {
      e.preventDefault();
      location.href = "calendar.html";
    });
  }
  if (settingsBtn) {
    settingsBtn.addEventListener("click", (e) => {
      e.preventDefault();
      location.href = "setting.html";
    });
  }

  // 카테고리 버튼 활성화
  const categoryButtons = document.querySelectorAll(".category-btn");
  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // 북마크 버튼 클릭 기능
  const bookmarkButtons = document.querySelectorAll(".bookmark-btn");
  bookmarkButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // 카드 클릭 이벤트와 분리
      btn.classList.toggle("active");

      // SVG 아이콘을 완전히 채워진 형태로 변경
      const svg = btn.querySelector("svg");
      if (btn.classList.contains("active")) {
        // 채워진 북마크로 변경
        svg.innerHTML =
          '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"></path>';
      } else {
        // 빈 북마크로 변경
        svg.innerHTML =
          '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>';
      }

      // 부드러운 애니메이션 효과
      btn.animate([{ transform: "scale(1.3)" }, { transform: "scale(1)" }], {
        duration: 250,
        easing: "ease-out",
      });
    });
  });
});
