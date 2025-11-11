// ✅ 기업마당 API 설정
const BIZINFO_API_URL = "https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do";
const BIZINFO_API_KEY = "gQ0k25";

// Supabase 설정
const SUPABASE_URL = "https://bawmwecykdaqsjklyjhb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd213ZWN5a2RhcXNqa2x5amhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjgxNzQsImV4cCI6MjA3NzU0NDE3NH0.KtTxYldOR_VCjUvI5BiAGBENkqHFRmApWM67PdKbGYQ";

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== 전역 변수 =====
let currentPage = 1;
let allPolicies = []; // 전체 정책 데이터 저장
let isLoading = false;

// ===== 기업마당 API에서 공지사항 가져오기 =====
async function fetchPolicies(keywords = [], count = 5) {
  const params = new URLSearchParams({
    crtfcKey: BIZINFO_API_KEY,
    dataType: "json",
    pageUnit: count,
    pageIndex: 1,
  });
  const url = `${BIZINFO_API_URL}?${params.toString()}`;
  console.log("🔗 요청 URL:", url);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("✅ 응답 데이터:", data);
    console.log("✅ 응답 데이터 전체 구조:", JSON.stringify(data, null, 2));

    // 응답 데이터에서 정책 목록 추출
    let policies = [];

    // 구조 1: data.jsonArray가 배열인 경우
    if (data && data.jsonArray && Array.isArray(data.jsonArray)) {
      policies = data.jsonArray;
      console.log("✅ data.jsonArray가 배열 - 직접 추출");
    }
    // 구조 2: data.jsonArray.item
    else if (data && data.jsonArray && data.jsonArray.item) {
      if (Array.isArray(data.jsonArray.item)) {
        policies = data.jsonArray.item;
      } else {
        policies = [data.jsonArray.item];
      }
      console.log("✅ data.jsonArray.item에서 추출");
    }
    // 구조 3: data.item
    else if (data && data.item) {
      if (Array.isArray(data.item)) {
        policies = data.item;
      } else {
        policies = [data.item];
      }
      console.log("✅ data.item에서 추출");
    }
    // 구조 4: data 자체가 배열
    else if (Array.isArray(data)) {
      policies = data;
      console.log("✅ data 자체가 배열");
    }
    // 구조 5: data.jsonArray가 객체인 경우 그 안을 탐색
    else if (data && data.jsonArray && typeof data.jsonArray === "object") {
      console.log("🔍 data.jsonArray 내부 구조:", Object.keys(data.jsonArray));
      console.log("🔍 data.jsonArray 전체:", data.jsonArray);

      // jsonArray 객체의 첫 번째 속성값 확인
      const firstKey = Object.keys(data.jsonArray)[0];
      if (firstKey) {
        const firstValue = data.jsonArray[firstKey];
        console.log(`🔍 첫 번째 키 '${firstKey}'의 값:`, firstValue);

        if (Array.isArray(firstValue)) {
          policies = firstValue;
          console.log(`✅ data.jsonArray.${firstKey}에서 추출`);
        }
      }
    } else {
      console.error("❌ 정책 데이터를 찾을 수 없음.");
      console.error("데이터 구조:", Object.keys(data));
      if (data.jsonArray) {
        console.error("jsonArray 내부:", data.jsonArray);
      }
    }

    console.log(`✅ 총 ${policies.length}개의 정책 정보 로드 성공`);
    if (policies.length > 0) {
      console.log("📋 첫 번째 정책:", policies[0]);
    }

    return policies.slice(0, count);
  } catch (error) {
    console.error("❌ API 호출 오류:", error);
    console.error("에러 상세:", error.message);
    throw error;
  }
}

// ===== 공지사항 카드 렌더링 =====
function renderPolicyCards(policies) {
  const jobList = document.querySelector(".job-list");
  if (!jobList) {
    console.error("❌ .job-list 요소를 찾을 수 없음");
    return;
  }

  console.log("🎨 렌더링 시작, 정책 개수:", policies.length);
  console.log("🎨 렌더링할 정책들:", policies);

  jobList.innerHTML = "";

  if (!policies || policies.length === 0) {
    console.log("⚠️ 렌더링할 정책이 없음");
    jobList.innerHTML =
      '<p style="text-align:center; padding:40px; color:#999;">표시할 공지사항이 없습니다.</p>';
    return;
  }

  policies.forEach((policy, index) => {
    console.log(`🎨 카드 ${index + 1} 렌더링 중:`, policy);

    const card = document.createElement("article");
    card.className = "job-card";
    card.dataset.policyId =
      policy.seq || policy.pblancId || policy.link || index;

    // 카테고리 및 해시태그 처리
    const categories = [];
    if (policy.lcategory) categories.push(policy.lcategory);
    if (policy.trgetNm) categories.push(policy.trgetNm);

    // 해시태그 추가
    if (policy.hashTags) {
      const tags = policy.hashTags.split(",").slice(0, 2);
      categories.push(...tags);
    }

    const tagsHtml = categories
      .slice(0, 4)
      .map((cat) => `<span class="tag">${cat.trim()}</span>`)
      .join("");

    // 기간 정보 처리
    let period = "상시";
    let periodRaw = ""; // 원본 날짜 데이터 저장

    if (policy.reqstDt || policy.reqstBeginEndDe) {
      const dateStr = policy.reqstDt || policy.reqstBeginEndDe;
      periodRaw = dateStr; // 원본 저장

      if (dateStr.includes("~")) {
        const [start, end] = dateStr.split("~").map((d) => d.trim());
        const formatDate = (date) => {
          if (date.length === 8) {
            return date.replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3");
          }
          return date;
        };
        period = `${formatDate(start)} ~ ${formatDate(end)}`;
      } else {
        period = dateStr;
      }
    } else if (policy.pubDate) {
      period = policy.pubDate;
      periodRaw = policy.pubDate;
    }

    // 설명 텍스트 정리 (HTML 태그 제거)
    let description =
      policy.description || policy.bsnsSumryCn || "상세 내용 확인 필요";
    description = description.replace(/<[^>]*>/g, "").trim();

    // 제목
    const title = policy.title || policy.pblancNm || "제목 없음";

    // 담당기관
    const author =
      policy.author || policy.jrsdInsttNm || policy.excInsttNm || "";

    console.log(`  - 제목: ${title}`);
    console.log(`  - 카테고리: ${categories.join(", ")}`);
    console.log(`  - 기간: ${period}`);

    card.innerHTML = `
      <button class="bookmark-btn" aria-label="즐겨찾기">
        <i data-lucide="bookmark"></i>
      </button>
      <h3 class="job-title">${title}</h3>
      <div class="job-tags">${tagsHtml || '<span class="tag">일반</span>'}</div>
      <div class="job-info">
        ${
          policy.trgetNm
            ? `<p><i data-lucide="users"></i> ${policy.trgetNm}</p>`
            : ""
        }
        <p><i data-lucide="clock"></i> ${period}</p>
        ${author ? `<p><i data-lucide="building"></i> ${author}</p>` : ""}
      </div>
      <p class="job-pay">${description.substring(0, 100)}${
      description.length > 100 ? "..." : ""
    }</p>
    `;

    // 링크 정보를 dataset에 저장
    const policyLink = policy.link || policy.pblancUrl || "";
    card.dataset.link = policyLink;

    // ⭐ 기간 정보를 dataset에 저장
    card.dataset.period = period;
    card.dataset.periodRaw = periodRaw;

    card.addEventListener("click", (e) => {
      if (!e.target.closest(".bookmark-btn")) {
        if (policyLink) {
          console.log("🔗 링크 열기:", policyLink);
          window.open(policyLink, "_blank");
        } else {
          console.log("⚠️ 링크가 없음");
        }
      }
    });

    card.dataset.categories = categories.join(",");

    jobList.appendChild(card);
    console.log(`✅ 카드 ${index + 1} 추가 완료`);

    // 북마크 상태 확인 및 복원
    checkBookmark(card.dataset.policyId).then((isBookmarked) => {
      if (isBookmarked) {
        const bookmarkBtn = card.querySelector(".bookmark-btn");
        bookmarkBtn.classList.add("active");
        const svg = bookmarkBtn.querySelector("svg");
        svg.innerHTML =
          '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"></path>';
      }
    });
  });

  console.log("✅ 전체 렌더링 완료");
  lucide.createIcons();
  bindBookmarkButtons();
}

// ===== 북마크 저장 =====
async function saveBookmark(policyData) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("로그인이 필요합니다.");
      return false;
    }

    const { data, error } = await supabase.from("bookmarks").insert({
      user_id: session.user.id,
      policy_id: policyData.policyId,
      policy_title: policyData.title,
      policy_description: policyData.description,
      policy_link: policyData.link,
      policy_category: policyData.category,
      policy_period: policyData.period,
      policy_author: policyData.author,
    });

    if (error) {
      if (error.code === "23505") {
        // 중복 에러
        console.log("⚠️ 이미 북마크된 공지사항입니다.");
        return true;
      }
      throw error;
    }

    console.log("✅ 북마크 저장 성공");
    return true;
  } catch (error) {
    console.error("❌ 북마크 저장 실패:", error);
    alert("북마크 저장에 실패했습니다.");
    return false;
  }
}

// ===== 북마크 삭제 =====
async function removeBookmark(policyId) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("로그인이 필요합니다.");
      return false;
    }

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", session.user.id)
      .eq("policy_id", policyId);

    if (error) throw error;

    console.log("✅ 북마크 삭제 성공");
    return true;
  } catch (error) {
    console.error("❌ 북마크 삭제 실패:", error);
    alert("북마크 삭제에 실패했습니다.");
    return false;
  }
}

// ===== 북마크 확인 =====
async function checkBookmark(policyId) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return false;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("id")
      .eq("user_id", session.user.id)
      .eq("policy_id", policyId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116: 결과 없음
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error("❌ 북마크 확인 실패:", error);
    return false;
  }
}

// ===== 북마크 기능 바인딩 =====
function bindBookmarkButtons() {
  const bookmarkButtons = document.querySelectorAll(".bookmark-btn");
  bookmarkButtons.forEach((btn) => {
    // 이미 이벤트가 바인딩된 버튼은 스킵
    if (btn.dataset.bound === "true") return;
    btn.dataset.bound = "true";

    btn.addEventListener("click", async (e) => {
      e.stopPropagation();

      const card = btn.closest(".job-card");
      const policyId = card.dataset.policyId;
      const isActive = btn.classList.contains("active");

      if (isActive) {
        // 북마크 삭제
        const success = await removeBookmark(policyId);
        if (success) {
          btn.classList.remove("active");
          const svg = btn.querySelector("svg");
          svg.innerHTML =
            '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>';
        }
      } else {
        // 북마크 추가

        // ⭐ 기간 정보 추출 - dataset에서 우선 가져오기
        let period = card.dataset.period || "";

        // dataset에 없으면 DOM에서 추출
        if (!period) {
          const clockIcon = card.querySelector('[data-lucide="clock"]');
          if (clockIcon && clockIcon.parentElement) {
            period = clockIcon.parentElement.textContent.trim();
          }
        }

        console.log("💾 저장할 기간 정보:", period);

        const policyData = {
          policyId: policyId,
          title: card.querySelector(".job-title")?.textContent || "",
          description: card.querySelector(".job-pay")?.textContent || "",
          link: card.dataset.link || "",
          category: card.dataset.categories || "",
          period: period, // ⭐ 수정된 부분
          author:
            card.querySelector(".job-info p:last-child")?.textContent || "",
        };

        console.log("💾 저장할 북마크 데이터:", policyData);

        const success = await saveBookmark(policyData);
        if (success) {
          btn.classList.add("active");
          const svg = btn.querySelector("svg");
          svg.innerHTML =
            '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor"></path>';
        }
      }

      btn.animate([{ transform: "scale(1.3)" }, { transform: "scale(1)" }], {
        duration: 250,
        easing: "ease-out",
      });
    });
  });
}

// ===== 더보기 버튼 바인딩 =====
function bindLoadMoreButton() {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", async () => {
      if (isLoading) return;

      isLoading = true;
      loadMoreBtn.disabled = true;
      loadMoreBtn.innerHTML = `
        <i data-lucide="loader" class="animate-spin"></i>
        <span>로딩 중...</span>
      `;
      lucide.createIcons();

      try {
        currentPage++;
        console.log(`📋 ${currentPage}페이지 로딩 중...`);

        const newPolicies = await fetchPolicies([], 5, currentPage);

        if (newPolicies && newPolicies.length > 0) {
          allPolicies = [...allPolicies, ...newPolicies];
          renderPolicyCards(newPolicies, true); // append = true
          console.log(`✅ ${newPolicies.length}개 추가 로드 완료`);
        } else {
          console.log("⚠️ 더 이상 불러올 공지사항이 없습니다.");
          const loadMoreContainer = document.querySelector(
            ".load-more-container"
          );
          if (loadMoreContainer) {
            loadMoreContainer.innerHTML = `
              <p style="text-align:center; padding:20px; color:#999;">
                더 이상 불러올 공지사항이 없습니다.
              </p>
            `;
          }
        }
      } catch (error) {
        console.error("❌ 추가 로드 실패:", error);
        alert("공지사항을 불러오는데 실패했습니다.");
        currentPage--; // 실패 시 페이지 번호 복구
      } finally {
        isLoading = false;
        if (loadMoreBtn) {
          loadMoreBtn.disabled = false;
          loadMoreBtn.innerHTML = `
            <i data-lucide="chevron-down"></i>
            <span>더보기</span>
          `;
          lucide.createIcons();
        }
      }
    });
  }
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

  // ===== 공지사항 로드 =====
  try {
    console.log("📋 공지사항 로딩 시작...");
    currentPage = 1; // 페이지 초기화
    const policies = await fetchPolicies(userKeywords, 5, 1);
    console.log(`✅ fetchPolicies 완료: ${policies ? policies.length : 0}개`);

    if (!policies) {
      throw new Error("정책 데이터가 null입니다.");
    }

    if (policies.length === 0) {
      console.warn("⚠️ 정책 데이터가 비어있습니다.");
    }

    allPolicies = policies; // 전역 변수에 저장
    renderPolicyCards(policies, false);
    console.log("✅ 렌더링 완료");
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

  // 기존 북마크 버튼 바인딩
  bindBookmarkButtons();
});

// =============================
// 플로팅 액션 버튼 (FAB)
// =============================
const fabBtn = document.getElementById("fabBtn");
const fabMenu = document.getElementById("fabMenu");
const fabOverlay = document.getElementById("fabOverlay");
const matchingBtn = document.getElementById("matchingBtn");
const historyBtn = document.getElementById("historyBtn");
const aiA = document.getElementById("aiA");

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
    location.href = "history.html";
  });
}

if (aiA) {
  aiA.addEventListener("click", () => {
    location.href = "aiA.html";
  });
}
