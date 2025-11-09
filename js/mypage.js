lucide.createIcons();

// ✅ 네비게이션 버튼 설정
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

// ✅ 버튼 이벤트
document.querySelector(".photo-edit-btn")?.addEventListener("click", () => {
  alert("사진 편집 기능");
});

document.querySelector(".edit-btn")?.addEventListener("click", () => {
  alert("정보 수정 페이지로 이동");
});

document.querySelector(".add-keyword-btn")?.addEventListener("click", () => {
  alert("키워드 추가 기능");
});

// ✅ JWT 토큰 디코딩
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("토큰 파싱 실패:", e);
    return null;
  }
}

// ✅ 사용자 정보 불러오기 (여러 헤더 형식 시도)
async function loadUserInfo() {
  const token = localStorage.getItem("accessToken");

  console.log(
    "🔍 저장된 토큰:",
    token ? `${token.substring(0, 30)}...` : "없음"
  );

  if (!token) {
    alert("로그인이 필요합니다.");
    location.href = "index.html";
    return;
  }

  // 토큰 만료 확인
  const decoded = parseJwt(token);
  if (decoded) {
    console.log("🔑 토큰 정보:", decoded);
    const expDate = new Date(decoded.exp * 1000);
    const now = new Date();
    console.log("⏰ 토큰 만료 시간:", expDate.toLocaleString());
    console.log("⏰ 현재 시간:", now.toLocaleString());

    if (now > expDate) {
      console.error("❌ 토큰이 만료되었습니다!");
      alert("토큰이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("accessToken");
      location.href = "index.html";
      return;
    } else {
      const remainingMinutes = Math.floor((expDate - now) / 1000 / 60);
      console.log(`✅ 토큰 유효 (남은 시간: ${remainingMinutes}분)`);
    }
  }

  // 여러 헤더 형식으로 시도
  const headerVariations = [
    { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    { Authorization: token, "Content-Type": "application/json" },
    { "X-Auth-Token": token, "Content-Type": "application/json" },
    { token: token, "Content-Type": "application/json" },
  ];

  for (let i = 0; i < headerVariations.length; i++) {
    const headers = headerVariations[i];
    console.log(
      `\n🔄 시도 ${i + 1}/${headerVariations.length}:`,
      Object.keys(headers)[0]
    );

    try {
      const response = await fetch("http://192.168.218.193:8080/api/users/me", {
        method: "GET",
        headers: headers,
      });

      console.log("📥 응답 상태:", response.status);

      const responseText = await response.text();
      console.log("📥 응답 본문:", responseText);

      if (response.ok) {
        const data = JSON.parse(responseText);
        console.log("✅ 성공! 사용자 정보:", data);

        // HTML에 반영
        const profileName = document.querySelector(".profile-name");
        const profileEmail = document.querySelector(".profile-email");
        const infoValues = document.querySelectorAll(".info-value");

        if (profileName) profileName.innerText = data.name || "이름 없음";
        if (profileEmail) profileEmail.innerText = data.email || "이메일 없음";
        if (infoValues[0])
          infoValues[0].innerText = data.job || "직업 정보 없음";
        if (infoValues[1])
          infoValues[1].innerText = data.birth || "생년월일 정보 없음";
        if (infoValues[2])
          infoValues[2].innerText = data.region || "거주지역 정보 없음";

        return; // 성공하면 종료
      }

      console.warn(`❌ 시도 ${i + 1} 실패`);
    } catch (err) {
      console.error(`🚨 시도 ${i + 1} 예외:`, err.message);
    }
  }

  // 모든 시도 실패
  console.error("❌ 모든 헤더 형식 시도 실패");
  alert("백엔드 인증 설정을 확인해주세요.\n개발자에게 403 에러를 보고하세요.");
}

// 페이지 로드 시 자동 실행
window.addEventListener("DOMContentLoaded", loadUserInfo);
