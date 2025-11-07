lucide.createIcons();

// ✅ 네비게이션 버튼 설정
const mypage = document.getElementById("mypage-btn");
const settings = document.getElementById("settings-btn");
const calendar = document.getElementById("calendar-btn");
const mypage2 = document.getElementById("mypage-btn2");
const home = document.getElementById("home-btn");
const ai = document.getElementById("ai-btn");
const settings2 = document.getElementById("settings-btn2");

mypage.addEventListener("click", () => (location.href = "mypage.html"));
settings.addEventListener("click", () => (location.href = "setting.html"));
calendar.addEventListener("click", () => (location.href = "calendar.html"));
mypage2.addEventListener("click", () => (location.href = "mypage.html"));
home.addEventListener("click", () => (location.href = "main.html"));
ai.addEventListener("click", () => (location.href = ""));
settings2.addEventListener("click", () => (location.href = "setting.html"));

// ✅ 버튼 이벤트 예시
document.querySelector(".photo-edit-btn").addEventListener("click", () => {
  alert("사진 편집 기능");
});

document.querySelector(".edit-btn").addEventListener("click", () => {
  alert("정보 수정 페이지로 이동");
});

document.querySelector(".add-keyword-btn").addEventListener("click", () => {
  alert("키워드 추가 기능");
});

// ✅ 사용자 정보 불러오기
async function loadUserInfo() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    alert("로그인이 필요합니다.");
    location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("http://192.168.218.193:8080/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // 토큰 만료나 인증 오류 시 로그인 페이지로
      if (response.status === 401 || response.status === 403) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("accessToken");
        location.href = "login.html";
        return;
      }
      throw new Error("서버 오류 발생");
    }

    const data = await response.json();

    // ✅ 가져온 사용자 정보 HTML에 반영
    document.querySelector(".profile-name").innerText =
      data.name || "이름 없음";
    document.querySelector(".profile-email").innerText =
      data.email || "이메일 없음";
    document.querySelector(".info-value:nth-of-type(1)").innerText =
      data.job || "직업 정보 없음";
    document.querySelector(".info-value:nth-of-type(2)").innerText =
      data.birth || "생년월일 정보 없음";
    document.querySelector(".info-value:nth-of-type(3)").innerText =
      data.region || "거주지역 정보 없음";

    console.log("✅ 사용자 정보:", data);
  } catch (err) {
    console.error("🚨 사용자 정보 불러오기 실패:", err);
    alert("서버와의 통신에 실패했습니다.");
  }
}

// 페이지 로드 시 자동 실행
window.addEventListener("DOMContentLoaded", loadUserInfo);
