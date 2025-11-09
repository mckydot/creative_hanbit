// ✅ 디버깅 강화된 로그인 스크립트
(function () {
  const email = document.getElementById("email");
  const pass = document.getElementById("password");
  const login = document.getElementById("loginBtn");
  const signup = document.getElementById("signupBtn");
  const result = document.getElementById("result");

  function validate() {
    const ok =
      email && pass && email.value.trim() !== "" && pass.value.trim() !== "";
    if (login) login.disabled = !ok;
  }

  validate();
  if (email) email.addEventListener("input", validate);
  if (pass) pass.addEventListener("input", validate);

  login.addEventListener("click", async function (e) {
    e.preventDefault();

    const emailVal = email.value.trim();
    const pwVal = pass.value.trim();

    if (!emailVal || !pwVal) {
      if (result) result.innerText = "이메일과 비밀번호를 입력해주세요.";
      return;
    }

    try {
      console.log("🔐 로그인 시도:", emailVal);

      const response = await fetch(
        "http://192.168.218.193:8080/api/users/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailVal, password: pwVal }),
        }
      );

      console.log("📥 응답 상태:", response.status, response.statusText);

      // 응답 본문 읽기
      const text = await response.text();
      console.log("📥 원본 응답:", text);

      let data = null;
      if (text) {
        try {
          data = JSON.parse(text);
          console.log("📥 파싱된 데이터:", data);
        } catch (jsonErr) {
          console.warn("JSON 파싱 실패:", jsonErr);
        }
      }

      // 실패 처리
      if (!response.ok) {
        const serverMsg =
          (data && (data.message || data.msg || data.error)) ||
          `서버 오류: ${response.status}`;
        if (result) result.innerText = `❌ 로그인 실패: ${serverMsg}`;
        return;
      }

      // 토큰 추출 - 가능한 모든 경로 확인
      let token = null;
      if (data) {
        // 다양한 응답 구조에 대응
        token =
          data.token ||
          data.accessToken ||
          data.access_token ||
          (data.data && (data.data.token || data.data.accessToken)) ||
          (data.result && data.result.token) ||
          null;
      }

      console.log(
        "🔑 추출된 토큰:",
        token ? `${token.substring(0, 30)}...` : "없음"
      );
      console.log("🔑 토큰 전체 길이:", token ? token.length : 0);

      // 성공 여부 확인
      const isSuccess =
        response.ok &&
        data &&
        (data.success === 1 ||
          data.success === "1" ||
          data.success === true ||
          data.status === "success" ||
          data.status === true ||
          token !== null); // 토큰이 있으면 성공으로 간주

      console.log("✅ 로그인 성공 여부:", isSuccess);

      if (isSuccess) {
        if (token) {
          try {
            // 토큰 저장 전에 기존 토큰 삭제
            localStorage.removeItem("accessToken");

            // 새 토큰 저장
            localStorage.setItem("accessToken", token);

            // 저장 확인
            const savedToken = localStorage.getItem("accessToken");
            console.log("💾 토큰 저장 확인:", savedToken ? "성공" : "실패");
            console.log(
              "💾 저장된 토큰:",
              savedToken ? `${savedToken.substring(0, 30)}...` : "없음"
            );

            if (result)
              result.innerText = "✅ 로그인 성공! 메인 페이지로 이동합니다.";

            // 페이지 이동
            setTimeout(() => {
              window.location.href = "main.html";
            }, 600);
            return;
          } catch (lsErr) {
            console.error("❌ localStorage 저장 오류:", lsErr);
            if (result) result.innerText = "토큰 저장 실패 (스토리지 오류)";
            return;
          }
        } else {
          console.warn("⚠️ 로그인 성공했으나 토큰이 없음");
          console.log("📦 전체 응답 데이터:", JSON.stringify(data, null, 2));

          if (result) {
            result.innerText =
              "⚠️ 서버 응답에 토큰이 없습니다. 백엔드를 확인해주세요.";
          }
          return;
        }
      } else {
        const serverMsg =
          (data && (data.message || data.msg || data.error)) ||
          "이메일 또는 비밀번호가 잘못되었습니다.";
        if (result) result.innerText = `❌ 로그인 실패: ${serverMsg}`;
        return;
      }
    } catch (error) {
      console.error("🚨 fetch 예외:", error);
      console.error("🚨 에러 스택:", error.stack);
      if (result) {
        result.innerText = "🚨 서버에 연결할 수 없습니다.";
      }
    }
  });

  // 회원가입 버튼
  if (signup) {
    signup.addEventListener("click", function (e) {
      e.preventDefault();
      location.href = "register.html";
    });
  }

  // 엔터키로 로그인
  [email, pass].forEach((el) => {
    if (el)
      el.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" && !login.disabled) login.click();
      });
  });
})();
