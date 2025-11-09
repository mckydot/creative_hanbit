// DOM 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", async () => {
  lucide.createIcons();

  // ===== 네비게이션 버튼 =====
  const mypageBtn = document.getElementById("mypage-btn");
  const settingsBtn = document.getElementById("settings-btn");
  const calendarBtn = document.getElementById("calendar-btn");
  const mypage = document.getElementById("mypage-btn2");
  const settings = document.getElementById("settings-btn2");
  const ai = document.getElementById("ai-btn");

  ai?.addEventListener("click", () => (location.href = "ai.html"));
  mypage?.addEventListener("click", () => (location.href = "mypage.html"));
  settings?.addEventListener("click", () => (location.href = "setting.html"));
  mypageBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "mypage.html";
  });
  calendarBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "calendar.html";
  });
  settingsBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "setting.html";
  });

  // ===== 로그인 확인 =====
  const token = localStorage.getItem("accessToken");

  console.log(
    "🔍 저장된 토큰:",
    token ? `${token.substring(0, 30)}...` : "없음"
  );

  // ✅ 토큰 없으면 로그인 페이지로
  if (!token) {
    alert("로그인이 필요합니다.");
    location.href = "index.html";
    return;
  }

  console.log("✅ 로그인 확인 완료 - 메인 페이지 로드");

  // ===== 북마크 버튼 클릭 기능 =====
  const bookmarkButtons = document.querySelectorAll(".bookmark-btn");
  bookmarkButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      btn.classList.toggle("active");

      const svg = btn.querySelector("svg");
      if (btn.classList.contains("active")) {
        svg.innerHTML =
          '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"></path>';
      } else {
        svg.innerHTML =
          '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>';
      }

      btn.animate([{ transform: "scale(1.3)" }, { transform: "scale(1)" }], {
        duration: 250,
        easing: "ease-out",
      });
    });
  });

  // ===== 카테고리 필터링 기능 =====
  const categoryButtons = document.querySelectorAll(".category-btn");
  const jobCards = document.querySelectorAll(".job-card");

  jobCards.forEach((card) => {
    const tags = Array.from(card.querySelectorAll(".tag")).map((t) =>
      t.textContent.trim()
    );
    card.dataset.categories = tags.join(",");
  });

  categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
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

fabBtn?.addEventListener("click", () => {
  fabBtn.classList.toggle("active");
  fabMenu.classList.toggle("active");
  fabOverlay.classList.toggle("active");
});

fabOverlay?.addEventListener("click", () => {
  fabBtn.classList.remove("active");
  fabMenu.classList.remove("active");
  fabOverlay.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".fab-container") &&
    !e.target.closest(".fab-overlay")
  ) {
    fabBtn?.classList.remove("active");
    fabMenu?.classList.remove("active");
    fabOverlay?.classList.remove("active");
  }
});
matchingBtn?.addEventListener("click", () => {
  alert("직원 매칭 시스템 페이지로 이동합니다.");
  location.href = "matching.html";
});

historyBtn?.addEventListener("click", () => {
  alert("작년 공지 확인 페이지로 이동합니다.");
  // location.href = 'history.html';
});
