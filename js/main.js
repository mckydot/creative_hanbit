// ✅ Supabase 메인 페이지 스크립트

// Supabase 설정
const SUPABASE_URL = "https://bawmwecykdaqsjklyjhb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd213ZWN5a2RhcXNqa2x5amhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjgxNzQsImV4cCI6MjA3NzU0NDE3NH0.KtTxYldOR_VCjUvI5BiAGBENkqHFRmApWM67PdKbGYQ";

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM 로드 완료 후 실행
document.addEventListener("DOMContentLoaded", async () => {
  lucide.createIcons();

  // ===== 로그인 확인 =====
  console.log("🔍 로그인 상태 확인 중...");

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.error("❌ 세션 확인 오류:", error);
    alert("로그인 정보를 확인할 수 없습니다.");
    location.href = "index.html";
    return;
  }

  if (!session) {
    console.log("❌ 로그인되지 않음");
    alert("로그인이 필요합니다.");
    location.href = "index.html";
    return;
  }

  console.log("✅ 로그인 확인 완료");
  console.log("👤 사용자:", session.user.email);

  // ===== 사용자 키워드 가져오기 =====
  const userId = session.user.id;
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("keywords")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("❌ 사용자 정보 조회 실패:", userError);
  }

  const userKeywords = userData?.keywords || [];
  console.log("🔖 사용자 키워드:", userKeywords);

  // ===== 카테고리 버튼 동적 생성 =====
  const categoryScroll = document.querySelector(".category-scroll");

  if (categoryScroll && userKeywords.length > 0) {
    // 기존 버튼 모두 제거
    categoryScroll.innerHTML = "";

    // "전체" 버튼 추가
    const allBtn = document.createElement("button");
    allBtn.className = "category-btn active";
    allBtn.textContent = "전체";
    categoryScroll.appendChild(allBtn);

    // 사용자 키워드 버튼들 추가
    userKeywords.forEach((keyword) => {
      const btn = document.createElement("button");
      btn.className = "category-btn";
      btn.textContent = keyword;
      categoryScroll.appendChild(btn);
    });

    console.log("✅ 카테고리 버튼 생성 완료");
  }

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
  const jobCards = document.querySelectorAll(".job-card");

  jobCards.forEach((card) => {
    const tags = Array.from(card.querySelectorAll(".tag")).map((t) =>
      t.textContent.trim()
    );
    card.dataset.categories = tags.join(",");
  });

  // 동적으로 생성된 버튼에 이벤트 리스너 추가
  categoryScroll?.addEventListener("click", (e) => {
    if (e.target.classList.contains("category-btn")) {
      const categoryButtons = document.querySelectorAll(".category-btn");
      categoryButtons.forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");

      const selected = e.target.textContent.trim();

      jobCards.forEach((card) => {
        if (selected === "전체") {
          card.style.display = "block";
        } else {
          const categories = card.dataset.categories.split(",");
          card.style.display = categories.includes(selected) ? "block" : "none";
        }
      });
    }
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
