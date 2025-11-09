// ✅ Supabase 로그인 스크립트
(function () {
  // Supabase 설정
  const SUPABASE_URL = "https://bawmwecykdaqsjklyjhb.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd213ZWN5a2RhcXNqa2x5amhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjgxNzQsImV4cCI6MjA3NzU0NDE3NH0.KtTxYldOR_VCjUvI5BiAGBENkqHFRmApWM67PdKbGYQ";

  // Supabase 클라이언트 초기화
  const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

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
      console.log("🔐 Supabase 로그인 시도:", emailVal);

      // Supabase 로그인
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailVal,
        password: pwVal,
      });

      console.log("📥 Supabase 응답:", { data, error });

      // 에러 처리
      if (error) {
        console.error("❌ 로그인 실패:", error);

        let errorMsg = "로그인에 실패했습니다.";
        if (error.message.includes("Invalid login credentials")) {
          errorMsg = "이메일 또는 비밀번호가 잘못되었습니다.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMsg = "이메일 인증이 필요합니다.";
        } else {
          errorMsg = error.message;
        }

        if (result) result.innerText = `❌ ${errorMsg}`;
        return;
      }

      // 로그인 성공
      if (data && data.session) {
        const token = data.session.access_token;
        const user = data.user;

        console.log("✅ 로그인 성공!");
        console.log("👤 사용자:", user.email);
        console.log(
          "🔑 토큰:",
          token ? `${token.substring(0, 30)}...` : "없음"
        );

        try {
          // 토큰 저장
          localStorage.removeItem("accessToken");
          localStorage.setItem("accessToken", token);

          // 사용자 정보도 저장 (선택사항)
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userId", user.id);

          // 저장 확인
          const savedToken = localStorage.getItem("accessToken");
          console.log("💾 토큰 저장 확인:", savedToken ? "성공" : "실패");

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
        console.warn("⚠️ 세션 정보가 없습니다.");
        if (result) result.innerText = "⚠️ 로그인 정보를 받지 못했습니다.";
        return;
      }
    } catch (error) {
      console.error("🚨 예외 발생:", error);
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
