// ✅ 로그인 화면 스크립트 (API 연동 버전)
(function () {
  const email = document.getElementById("email");
  const pass = document.getElementById("password");
  const login = document.getElementById("loginBtn");
  const signup = document.getElementById("signupBtn");
  const result = document.getElementById("result"); // 로그인 결과 표시용 <p id="result"> 같은 태그 추가해두면 좋아

  function validate() {
    // 이메일/비밀번호가 모두 입력되면 버튼 활성화
    const ok = email.value.trim() !== "" && pass.value.trim() !== "";
    login.disabled = !ok;
  }

  // 초기 상태
  validate();
  email.addEventListener("input", validate);
  pass.addEventListener("input", validate);

  // ✅ 로그인 버튼 클릭 시 서버 요청
  login.addEventListener("click", async function (e) {
    e.preventDefault();

    const emailVal = email.value.trim();
    const pwVal = pass.value.trim();

    if (!emailVal || !pwVal) {
      result.innerText = "이메일과 비밀번호를 입력해주세요.";
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.218.193:8080/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailVal,
            password: pwVal,
          }),
        }
      );

      // ⚙️ 응답이 JSON인지 확인
      const text = await response.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        console.error("⚠️ 서버 응답이 JSON이 아닙니다:", err);
      }

      if (!response.ok) {
        // 로그인 실패 (HTTP 상태 400, 401 등)
        result.innerText =
          (data && data.message) || "❌ 로그인 실패: 서버 오류 발생";
        return;
      }

      // ✅ 로그인 성공
      if (data && data.success === "1") {
        result.innerText = "✅ 로그인 성공! 메인 페이지로 이동합니다.";
        setTimeout(() => (location.href = "main.html"), 1000);
      } else {
        result.innerText =
          (data && data.message) ||
          "❌ 이메일 또는 비밀번호가 올바르지 않습니다.";
      }
    } catch (error) {
      console.error("🚨 서버 통신 오류:", error);
      result.innerText =
        "🚨 서버에 연결할 수 없습니다. (백엔드가 실행 중인가요?)";
    }
  });

  // 회원가입 버튼
  signup.addEventListener("click", function (e) {
    e.preventDefault();
    location.href = "register.html";
  });

  // 엔터키로 로그인
  [email, pass].forEach((el) =>
    el.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && !login.disabled) login.click();
    })
  );
})();
