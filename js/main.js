// ✅ 청년센터 API 설정
const YOUTH_API_URL = "https://www.youthcenter.go.kr/opi/youthPlcyList.do";
const YOUTH_API_KEY = "fa19e38e-58a0-4847-b18a-a8e272bd8f40";

// Supabase 설정
const SUPABASE_URL = "https://bawmwecykdaqsjklyjhb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd213ZWN5a2RhcXNqa2x5amhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjgxNzQsImV4cCI6MjA3NzU0NDE3NH0.KtTxYldOR_VCjUvI5BiAGBENkqHFRmApWM67PdKbGYQ";

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== 청년센터 API에서 공지사항 가져오기 =====
async function fetchPolicies(count = 10) {
  try {
    console.log("📋 청년센터 API에서 정책 정보 가져오는 중...");

    // 청년센터 API 파라미터 (공식 문서 기준)
    const params = new URLSearchParams({
      openApiVlak: YOUTH_API_KEY,
      display: count.toString(),
      pageIndex: "1",
    });

    const targetUrl = `${YOUTH_API_URL}?${params.toString()}`;

    console.log("🔗 요청 URL:", targetUrl);

    // allorigins 프록시 사용
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      targetUrl
    )}`;

    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`프록시 요청 실패: ${response.status}`);
    }

    const proxyData = await response.json();

    // HTML이 반환되는 경우 처리
    if (
      proxyData.contents.startsWith("<!DOCTYPE") ||
      proxyData.contents.startsWith("<html")
    ) {
      console.error("❌ HTML 응답 받음");
      throw new Error("API가 HTML을 반환했습니다. API 키를 확인해주세요.");
    }

    const data = JSON.parse(proxyData.contents);
    console.log("📋 파싱된 데이터:", data);

    // 청년센터 API 응답 구조: { youthPolicy: [...] }
    if (data && data.youthPolicy && Array.isArray(data.youthPolicy)) {
      console.log(`✅ ${data.youthPolicy.length}개의 정책 정보 로드 성공`);
      return data.youthPolicy;
    } else if (data && data.empl && Array.isArray(data.empl)) {
      console.log(`✅ ${data.empl.length}개의 정책 정보 로드 성공`);
      return data.empl;
    } else {
      console.error("❌ 정책 데이터를 찾을 수 없음. 응답:", data);
      throw new Error("정책 데이터를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("❌ API 호출 실패:", error);
    throw error;
  }
}

// ===== 공지사항 카드 렌더링 =====
function renderPolicyCards(policies) {
  const jobList = document.querySelector(".job-list");
  if (!jobList) return;

  // 기존 카드 제거
  jobList.innerHTML = "";

  if (policies.length === 0) {
    jobList.innerHTML =
      '<p style="text-align:center; padding:40px; color:#999;">표시할 공지사항이 없습니다.</p>';
    return;
  }

  policies.forEach((policy) => {
    const card = document.createElement("article");
    card.className = "job-card";
    card.dataset.policyNo = policy.plcyNo;

    // 카테고리 태그 생성
    const categories = [];
    if (policy.lclsfNm) categories.push(policy.lclsfNm);
    if (policy.mclsfNm) categories.push(policy.mclsfNm);
    if (policy.plcyKywdNm) categories.push(policy.plcyKywdNm);

    const tagsHtml = categories
      .slice(0, 4)
      .map((cat) => `<span class="tag">${cat}</span>`)
      .join("");

    // 나이 제한 표시
    let ageRange = "";
    if (policy.sprtTrgtMinAge || policy.sprtTrgtMaxAge) {
      const minAge = policy.sprtTrgtMinAge || "제한없음";
      const maxAge = policy.sprtTrgtMaxAge || "제한없음";
      ageRange = `만 ${minAge}세 ~ 만 ${maxAge}세`;
    }

    // 기간 표시
    let period = "상시";
    if (policy.bizPrdBgngYmd && policy.bizPrdEndYmd) {
      const start = policy.bizPrdBgngYmd.replace(
        /(\d{4})(\d{2})(\d{2})/,
        "$1.$2.$3"
      );
      const end = policy.bizPrdEndYmd.replace(
        /(\d{4})(\d{2})(\d{2})/,
        "$1.$2.$3"
      );
      period = `${start} ~ ${end}`;
    } else if (policy.bizPrdEtcCn) {
      period = policy.bizPrdEtcCn;
    }

    card.innerHTML = `
      <button class="bookmark-btn" aria-label="즐겨찾기">
        <i data-lucide="bookmark"></i>
      </button>
      <h3 class="job-title">${policy.plcyNm}</h3>
      <div class="job-tags">${tagsHtml}</div>
      <div class="job-info">
        ${ageRange ? `<p><i data-lucide="user"></i> ${ageRange}</p>` : ""}
        <p><i data-lucide="clock"></i> ${period}</p>
        ${
          policy.sprvsnInstCdNm
            ? `<p><i data-lucide="building"></i> ${policy.sprvsnInstCdNm}</p>`
            : ""
        }
      </div>
      <p class="job-pay">${
        policy.plcyExplnCn?.substring(0, 100) || "상세 내용 확인 필요"
      }${policy.plcyExplnCn?.length > 100 ? "..." : ""}</p>
    `;

    // 카드 클릭 시 상세 페이지로 이동
    card.addEventListener("click", (e) => {
      if (!e.target.closest(".bookmark-btn")) {
        window.open(policy.aplyUrlAddr || policy.refUrlAddr1, "_blank");
      }
    });

    // 카테고리 데이터 저장
    card.dataset.categories = categories.join(",");

    jobList.appendChild(card);
  });

  // 아이콘 다시 생성
  lucide.createIcons();

  // 북마크 기능 다시 바인딩
  bindBookmarkButtons();
}

// ===== 북마크 기능 바인딩 =====
function bindBookmarkButtons() {
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
}

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

  // ===== 공지사항 로드 (기본 10개) =====
  try {
    console.log("📋 공지사항 로딩 중... (10개)");
    const policies = await fetchPolicies(10);
    console.log(`✅ ${policies.length}개의 공지사항 로드 완료`);

    // 공지사항 카드 렌더링
    renderPolicyCards(policies);
  } catch (error) {
    console.error("❌ 정책 정보 로드 실패:", error);
    const jobList = document.querySelector(".job-list");
    if (jobList) {
      jobList.innerHTML = `
        <div style="text-align:center; padding:40px; color:#e74c3c;">
          <p style="font-size:18px; margin-bottom:10px;">⚠️ 정책 정보를 불러올 수 없습니다.</p>
          <p style="font-size:14px; color:#999;">${error.message}</p>
          <button onclick="location.reload()" style="margin-top:20px; padding:10px 20px; background:#3498db; color:white; border:none; border-radius:5px; cursor:pointer;">
            새로고침
          </button>
        </div>
      `;
    }
    return;
  }

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

  if (ai) ai.addEventListener("click", () => (location.href = "ai.html"));
  if (mypage)
    mypage.addEventListener("click", () => (location.href = "mypage.html"));
  if (settings)
    settings.addEventListener("click", () => (location.href = "setting.html"));
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

  // ===== 검색 기능 =====
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.trim().toLowerCase();
      const jobCards = document.querySelectorAll(".job-card");

      jobCards.forEach((card) => {
        const title =
          card.querySelector(".job-title")?.textContent.toLowerCase() || "";
        const tags = card.dataset.categories?.toLowerCase() || "";
        const description =
          card.querySelector(".job-pay")?.textContent.toLowerCase() || "";

        const matches =
          title.includes(searchTerm) ||
          tags.includes(searchTerm) ||
          description.includes(searchTerm);

        card.style.display = matches ? "block" : "none";
      });
    });
  }

  // ===== 카테고리 필터링 기능 (키워드 중 하나라도 일치하면 표시) =====
  if (categoryScroll) {
    categoryScroll.addEventListener("click", (e) => {
      if (e.target.classList.contains("category-btn")) {
        const categoryButtons = document.querySelectorAll(".category-btn");
        categoryButtons.forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");

        const selected = e.target.textContent.trim();
        const jobCards = document.querySelectorAll(".job-card");

        jobCards.forEach((card) => {
          if (selected === "전체") {
            card.style.display = "block";
          } else {
            // 카드의 모든 카테고리 가져오기
            const categories = card.dataset.categories?.split(",") || [];
            // 선택한 키워드가 카테고리 중 하나라도 포함되어 있으면 표시
            const matches = categories.some(
              (cat) =>
                cat.toLowerCase().includes(selected.toLowerCase()) ||
                selected.toLowerCase().includes(cat.toLowerCase())
            );
            card.style.display = matches ? "block" : "none";
          }
        });
      }
    });
  }
});

// =============================
// 플로팅 액션 버튼 (FAB)
// =============================
const fabBtn = document.getElementById("fabBtn");
const fabMenu = document.getElementById("fabMenu");
const fabOverlay = document.getElementById("fabOverlay");
const matchingBtn = document.getElementById("matchingBtn");
const historyBtn = document.getElementById("historyBtn");

if (fabBtn && fabMenu && fabOverlay) {
  fabBtn.addEventListener("click", () => {
    fabBtn.classList.toggle("active");
    fabMenu.classList.toggle("active");
    fabOverlay.classList.toggle("active");
  });

  fabOverlay.addEventListener("click", () => {
    fabBtn.classList.remove("active");
    fabMenu.classList.remove("active");
    fabOverlay.classList.remove("active");
  });
}

if (matchingBtn) {
  matchingBtn.addEventListener("click", () => {
    alert("직원 매칭 시스템 페이지로 이동합니다.");
    location.href = "matching.html";
  });
}

if (historyBtn) {
  historyBtn.addEventListener("click", () => {
    alert("작년 공지 확인 페이지로 이동합니다.");
    // location.href = 'history.html';
  });
}
