// DOM 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", () => {
  // Lucide 아이콘 렌더링 (한 번만 실행)
  lucide.createIcons();

  // ===== 네비게이션 버튼 =====
  const mypageBtn = document.getElementById("mypage-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const calendarBtn = document.getElementById("calendar-btn");
  const mypage = document.getElementById("mypage-btn2");
  const settings = document.getElementById("settings-btn2");
  const ai = document.getElementById("ai-btn");

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

  // ===== 북마크 버튼 클릭 기능 =====
  const bookmarkButtons = document.querySelectorAll(".bookmark-btn");
  bookmarkButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // 카드 클릭 이벤트와 분리
      btn.classList.toggle("active");

      // SVG 아이콘 채우기 / 비우기
      const svg = btn.querySelector("svg");
      if (btn.classList.contains("active")) {
        svg.innerHTML =
          '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"></path>';
      } else {
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

  // ===== 카테고리 필터링 기능 =====
  const categoryButtons = document.querySelectorAll(".category-btn");
  const jobCards = document.querySelectorAll(".job-card");

  // 각 카드에 data-categories 속성 자동 추가
  jobCards.forEach((card) => {
    const tags = Array.from(card.querySelectorAll(".tag")).map((t) =>
      t.textContent.trim()
    );
    card.dataset.categories = tags.join(","); // 예: "청년,복지,취업지원"
  });

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // 버튼 active 상태 업데이트
      categoryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const selected = btn.textContent.trim();

      jobCards.forEach((card) => {
        if (selected === "전체") {
          card.style.display = "block";
        } else {
          const categories = card.dataset.categories.split(",");
          card.style.display = categories.includes(selected) ? "block" : "none";
        }
      });
    });
  });
});
// =============================
// 플로팅 액션 버튼 (FAB)
// =============================
const fabBtn = document.getElementById("fabBtn");
const fabMenu = document.getElementById("fabMenu");
const fabOverlay = document.getElementById("fabOverlay");
const matchingBtn = document.getElementById("matchingBtn");
const historyBtn = document.getElementById("historyBtn");

// FAB 메뉴 토글
fabBtn.addEventListener("click", () => {
  fabBtn.classList.toggle("active");
  fabMenu.classList.toggle("active");
  fabOverlay.classList.toggle("active");
});

// 오버레이 클릭 시 메뉴 닫기
fabOverlay.addEventListener("click", () => {
  fabBtn.classList.remove("active");
  fabMenu.classList.remove("active");
  fabOverlay.classList.remove("active");
});

// 메뉴 외부 클릭 시 닫기
document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".fab-container") &&
    !e.target.closest(".fab-overlay")
  ) {
    fabBtn.classList.remove("active");
    fabMenu.classList.remove("active");
    fabOverlay.classList.remove("active");
  }
});

// 직원 매칭 시스템
matchingBtn.addEventListener("click", () => {
  alert("직원 매칭 시스템 페이지로 이동합니다.");
  // location.href = 'matching.html';
});

// 작년 공지 확인
historyBtn.addEventListener("click", () => {
  alert("작년 공지 확인 페이지로 이동합니다.");
  // location.href = 'history.html';
});
