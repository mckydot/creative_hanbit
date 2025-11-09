// ✅ Supabase 설정 페이지 스크립트

// Supabase 설정
const SUPABASE_URL = "https://bawmwecykdaqsjklyjhb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd213ZWN5a2RhcXNqa2x5amhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjgxNzQsImV4cCI6MjA3NzU0NDE3NH0.KtTxYldOR_VCjUvI5BiAGBENkqHFRmApWM67PdKbGYQ";

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

lucide.createIcons();

// ===== 로그인 확인 =====
window.addEventListener("DOMContentLoaded", async () => {
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
});

// ===== 네비게이션 =====
const mypage1 = document.getElementById("mypage-btn");
const settings1 = document.getElementById("settings-btn");
const ai = document.getElementById("ai-btn");
const calendar = document.getElementById("calendar-btn");
const home = document.getElementById("home-btn");
const mypage2 = document.getElementById("mypage-btn2");
const settings2 = document.getElementById("settings-btn2");
const backBtn = document.getElementById("back-btn");

mypage1?.addEventListener("click", () => (location.href = "mypage.html"));
mypage2?.addEventListener("click", () => (location.href = "mypage.html"));
settings1?.addEventListener("click", () => (location.href = "setting.html"));
settings2?.addEventListener("click", () => (location.href = "setting.html"));
home?.addEventListener("click", () => (location.href = "main.html"));
ai?.addEventListener("click", () => (location.href = "ai.html"));
calendar?.addEventListener("click", () => (location.href = "calendar.html"));
backBtn?.addEventListener("click", () => (location.href = "main.html"));

// ===== 프로필 수정 =====
document.getElementById("profile-edit")?.addEventListener("click", () => {
  alert("프로필 수정 페이지 (개발 예정)");
  // location.href = "profile-edit.html";
});

// ===== 로그아웃 =====
document.getElementById("logout")?.addEventListener("click", async () => {
  const confirmed = confirm("로그아웃 하시겠습니까?");

  if (confirmed) {
    try {
      console.log("🔄 로그아웃 시도...");

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("❌ 로그아웃 실패:", error);
        alert("로그아웃에 실패했습니다: " + error.message);
        return;
      }

      // 로컬 스토리지 정리
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userId");

      console.log("✅ 로그아웃 성공");
      alert("로그아웃 되었습니다.");
      location.href = "index.html";
    } catch (error) {
      console.error("🚨 로그아웃 중 오류:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  }
});

// ===== 회원 탈퇴 =====
document.getElementById("withdraw")?.addEventListener("click", async () => {
  const confirmed = confirm(
    "정말로 회원 탈퇴하시겠습니까?\n\n" +
      "탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다."
  );

  if (!confirmed) return;

  const doubleCheck = prompt(
    "회원 탈퇴를 진행하려면 '회원탈퇴'를 입력해주세요."
  );

  if (doubleCheck !== "회원탈퇴") {
    alert("탈퇴가 취소되었습니다.");
    return;
  }

  try {
    console.log("🔄 회원 탈퇴 시도...");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      location.href = "index.html";
      return;
    }

    const userId = session.user.id;

    // 1. users 테이블에서 사용자 데이터 삭제
    const { error: deleteUserError } = await supabase
      .from("users")
      .delete()
      .eq("id", userId);

    if (deleteUserError) {
      console.error("❌ 사용자 데이터 삭제 실패:", deleteUserError);
      alert("회원 탈퇴에 실패했습니다: " + deleteUserError.message);
      return;
    }

    // 2. Auth에서 사용자 삭제 (관리자 API 필요)
    // 참고: Supabase Auth의 사용자 삭제는 서버 측에서 처리해야 합니다.
    // 클라이언트에서는 직접 삭제할 수 없으므로, 로그아웃만 처리합니다.

    // 로그아웃 처리
    await supabase.auth.signOut();

    // 로컬 스토리지 정리
    localStorage.clear();

    console.log("✅ 회원 탈퇴 처리 완료");
    alert("회원 탈퇴가 완료되었습니다.\n" + "그동안 이용해주셔서 감사합니다.");
    location.href = "index.html";
  } catch (error) {
    console.error("🚨 회원 탈퇴 중 오류:", error);
    alert("회원 탈퇴 중 오류가 발생했습니다: " + error.message);
  }
});

// ===== 푸시 알림 토글 =====
document
  .getElementById("push-notification")
  ?.addEventListener("change", async (e) => {
    const isEnabled = e.target.checked;
    console.log("🔔 푸시 알림:", isEnabled ? "켜짐" : "꺼짐");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // users 테이블에 push_notification 컬럼이 있다면 업데이트
      const { error } = await supabase
        .from("users")
        .update({ push_notification: isEnabled })
        .eq("id", session.user.id);

      if (error) {
        console.error("❌ 알림 설정 저장 실패:", error);
      }
    } catch (error) {
      console.error("🚨 알림 설정 오류:", error);
    }
  });

// ===== 맞춤 공고 알림 토글 =====
document
  .getElementById("custom-notification")
  ?.addEventListener("change", async (e) => {
    const isEnabled = e.target.checked;
    console.log("📢 맞춤 공고 알림:", isEnabled ? "켜짐" : "꺼짐");

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // users 테이블에 custom_notification 컬럼이 있다면 업데이트
      const { error } = await supabase
        .from("users")
        .update({ custom_notification: isEnabled })
        .eq("id", session.user.id);

      if (error) {
        console.error("❌ 알림 설정 저장 실패:", error);
      }
    } catch (error) {
      console.error("🚨 알림 설정 오류:", error);
    }
  });

// ===== 공지사항 =====
document.getElementById("notice")?.addEventListener("click", () => {
  alert("공지사항 페이지 (개발 예정)");
  // location.href = "notice.html";
});

// ===== 서비스 이용약관 =====
document.getElementById("terms")?.addEventListener("click", () => {
  alert("서비스 이용약관 페이지 (개발 예정)");
  // location.href = "terms.html";
});
