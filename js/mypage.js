// ✅ Supabase 마이페이지 스크립트

// Supabase 설정
const SUPABASE_URL = "https://bawmwecykdaqsjklyjhb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd213ZWN5a2RhcXNqa2x5amhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjgxNzQsImV4cCI6MjA3NzU0NDE3NH0.KtTxYldOR_VCjUvI5BiAGBENkqHFRmApWM67PdKbGYQ";

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ 페이지 로드 시 실행
window.addEventListener("DOMContentLoaded", async () => {
  lucide.createIcons();

  await loadUserInfo();
  setupNavigation();
  setupButtons();
});

// ✅ 사용자 정보 불러오기
async function loadUserInfo() {
  console.log("🔍 로그인 상태 확인 중...");

  // 세션 확인
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error("❌ 세션 확인 오류:", sessionError);
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

  // 사용자 정보 가져오기
  const userId = session.user.id;
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) {
    console.error("❌ 사용자 정보 조회 실패:", userError);
    alert("사용자 정보를 불러올 수 없습니다.");
    return;
  }

  console.log("✅ 사용자 정보:", userData);

  // HTML에 정보 반영
  updateProfileUI(userData);
}

// ✅ UI 업데이트
function updateProfileUI(userData) {
  // 프로필 정보
  const profileName = document.querySelector(".profile-name");
  const profileEmail = document.querySelector(".profile-email");

  if (profileName) profileName.innerText = userData.username || "이름 없음";
  if (profileEmail) profileEmail.innerText = userData.email || "이메일 없음";

  // 기본 정보
  const infoValues = document.querySelectorAll(".info-value");

  if (infoValues[0]) {
    infoValues[0].innerText = userData.job || "직업 정보 없음";
  }

  if (infoValues[1]) {
    // 생년월일 포맷팅 (YYYY-MM-DD → YYYY년 M월 D일)
    if (userData.birth_date) {
      const date = new Date(userData.birth_date);
      const formatted = `${date.getFullYear()}년 ${
        date.getMonth() + 1
      }월 ${date.getDate()}일`;
      infoValues[1].innerText = formatted;
    } else {
      infoValues[1].innerText = "생년월일 정보 없음";
    }
  }

  if (infoValues[2]) {
    const region =
      userData.city && userData.district
        ? `${userData.city} ${userData.district}`
        : "거주지역 정보 없음";
    infoValues[2].innerText = region;
  }

  // 관심 키워드
  const keywordsGrid = document.querySelector(".keywords-grid");
  if (keywordsGrid && userData.keywords && userData.keywords.length > 0) {
    // 기존 키워드 태그들 제거 (추가하기 버튼은 유지)
    const existingTags = keywordsGrid.querySelectorAll(".keyword-tag");
    existingTags.forEach((tag) => tag.remove());

    // 새 키워드 태그들 추가
    userData.keywords.forEach((keyword) => {
      const tag = document.createElement("div");
      tag.className = "keyword-tag";
      tag.innerHTML = `
        <i data-lucide="heart"></i>
        ${keyword}
      `;
      // 추가하기 버튼 앞에 삽입
      keywordsGrid.insertBefore(
        tag,
        keywordsGrid.querySelector(".add-keyword-btn")
      );
    });

    // 아이콘 재생성
    lucide.createIcons();
  }

  console.log("✅ UI 업데이트 완료");
}

// ✅ 네비게이션 버튼 설정
function setupNavigation() {
  const mypage = document.getElementById("mypage-btn");
  const settings = document.getElementById("settings-btn");
  const calendar = document.getElementById("calendar-btn");
  const mypage2 = document.getElementById("mypage-btn2");
  const home = document.getElementById("home-btn");
  const ai = document.getElementById("ai-btn");
  const settings2 = document.getElementById("settings-btn2");

  mypage?.addEventListener("click", () => (location.href = "mypage.html"));
  settings?.addEventListener("click", () => (location.href = "setting.html"));
  calendar?.addEventListener("click", () => (location.href = "calendar.html"));
  mypage2?.addEventListener("click", () => (location.href = "mypage.html"));
  home?.addEventListener("click", () => (location.href = "main.html"));
  ai?.addEventListener("click", () => (location.href = "ai.html"));
  settings2?.addEventListener("click", () => (location.href = "setting.html"));
}

// ✅ 버튼 이벤트 설정
function setupButtons() {
  document.querySelector(".photo-edit-btn")?.addEventListener("click", () => {
    alert("사진 편집 기능 (개발 예정)");
  });

  document.querySelector(".edit-btn")?.addEventListener("click", () => {
    alert("정보 수정 페이지로 이동 (개발 예정)");
  });

  document.querySelector(".add-keyword-btn")?.addEventListener("click", () => {
    showKeywordModal();
  });
}

// ✅ 키워드 추가 모달 표시
function showKeywordModal() {
  // 기존 모달이 있으면 제거
  const existingModal = document.querySelector(".keyword-modal-overlay");
  if (existingModal) {
    existingModal.remove();
  }

  // 모달 HTML 생성
  const modalHTML = `
    <div class="keyword-modal-overlay">
      <div class="keyword-modal">
        <div class="keyword-modal-header">
          <h3>키워드 추가하기</h3>
          <button class="modal-close-btn" aria-label="닫기">
            <i data-lucide="x"></i>
          </button>
        </div>
        <div class="keyword-modal-body">
          <div class="keyword-input-group">
            <input type="text" id="keywordInput" placeholder="추가할 키워드를 입력하세요" maxlength="20" />
            <button id="addKeywordModalBtn" class="add-btn">
              <i data-lucide="plus"></i>
              추가
            </button>
          </div>
          <div class="keyword-preview" id="keywordPreview">
            <p class="preview-label">추가될 키워드:</p>
            <div class="preview-tags" id="previewTags"></div>
          </div>
        </div>
        <div class="keyword-modal-footer">
          <button class="btn-cancel" id="cancelBtn">취소</button>
          <button class="btn-confirm" id="confirmBtn">저장</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  lucide.createIcons();

  // 모달 요소들
  const overlay = document.querySelector(".keyword-modal-overlay");
  const modal = document.querySelector(".keyword-modal");
  const closeBtn = document.querySelector(".modal-close-btn");
  const input = document.getElementById("keywordInput");
  const addBtn = document.getElementById("addKeywordModalBtn");
  const previewTags = document.getElementById("previewTags");
  const cancelBtn = document.getElementById("cancelBtn");
  const confirmBtn = document.getElementById("confirmBtn");

  let newKeywords = [];

  // 모달 닫기
  const closeModal = () => {
    overlay.style.opacity = "0";
    modal.style.transform = "translateY(-20px)";
    setTimeout(() => overlay.remove(), 300);
  };

  // 엔터키로 추가
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addBtn.click();
    }
  });

  // 키워드 추가 버튼
  addBtn.addEventListener("click", () => {
    const keyword = input.value.trim();

    if (!keyword) {
      alert("키워드를 입력해주세요.");
      return;
    }

    if (newKeywords.includes(keyword)) {
      alert("이미 추가된 키워드입니다.");
      input.value = "";
      return;
    }

    if (newKeywords.length >= 10) {
      alert("최대 10개까지만 추가할 수 있습니다.");
      return;
    }

    newKeywords.push(keyword);
    updatePreview();
    input.value = "";
    input.focus();
  });

  // 미리보기 업데이트
  const updatePreview = () => {
    previewTags.innerHTML = "";

    if (newKeywords.length === 0) {
      previewTags.innerHTML =
        '<p class="empty-message">추가된 키워드가 없습니다.</p>';
      return;
    }

    newKeywords.forEach((keyword, index) => {
      const tag = document.createElement("div");
      tag.className = "preview-tag";
      tag.innerHTML = `
        <span>${keyword}</span>
        <button class="remove-tag-btn" data-index="${index}" aria-label="삭제">
          <i data-lucide="x"></i>
        </button>
      `;
      previewTags.appendChild(tag);
    });

    lucide.createIcons();

    // 삭제 버튼 이벤트
    document.querySelectorAll(".remove-tag-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.dataset.index);
        newKeywords.splice(index, 1);
        updatePreview();
      });
    });
  };

  updatePreview();

  // 이벤트 리스너
  closeBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // 저장 버튼
  confirmBtn.addEventListener("click", async () => {
    if (newKeywords.length === 0) {
      alert("추가할 키워드를 입력해주세요.");
      return;
    }

    confirmBtn.disabled = true;
    confirmBtn.textContent = "저장 중...";

    try {
      const success = await addKeywords(newKeywords);

      if (success) {
        alert("키워드가 성공적으로 추가되었습니다!");
        closeModal();
        setTimeout(() => location.reload(), 300);
      } else {
        confirmBtn.disabled = false;
        confirmBtn.textContent = "저장";
      }
    } catch (error) {
      console.error("저장 중 오류:", error);
      alert("저장 중 오류가 발생했습니다.");
      confirmBtn.disabled = false;
      confirmBtn.textContent = "저장";
    }
  });

  // 포커스
  input.focus();

  // 애니메이션
  setTimeout(() => {
    overlay.style.opacity = "1";
    modal.style.transform = "translateY(0)";
  }, 10);
}

// ✅ 키워드 추가 함수 (여러 개)
async function addKeywords(keywords) {
  try {
    console.log("🔄 키워드 추가 시작:", keywords);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("❌ 세션 오류:", sessionError);
      alert("로그인이 필요합니다.");
      return false;
    }

    const userId = session.user.id;
    console.log("👤 사용자 ID:", userId);

    // 현재 키워드 가져오기
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("keywords")
      .eq("id", userId)
      .single();

    if (fetchError) {
      console.error("❌ 키워드 조회 실패:", fetchError);
      alert("키워드를 불러올 수 없습니다.");
      return false;
    }

    console.log("📥 현재 키워드:", userData.keywords);

    const currentKeywords = userData.keywords || [];

    // 중복 제거하고 합치기
    const uniqueKeywords = [...new Set([...currentKeywords, ...keywords])];
    console.log("✅ 업데이트할 키워드:", uniqueKeywords);

    // 데이터베이스에 업데이트
    const { data: updateData, error: updateError } = await supabase
      .from("users")
      .update({ keywords: uniqueKeywords })
      .eq("id", userId)
      .select();

    if (updateError) {
      console.error("❌ 키워드 추가 실패:", updateError);
      alert("키워드 추가에 실패했습니다: " + updateError.message);
      return false;
    }

    console.log("✅ 키워드 추가 성공:", updateData);
    return true;
  } catch (error) {
    console.error("🚨 예외 발생:", error);
    alert("오류가 발생했습니다: " + error.message);
    return false;
  }
}
