// 간단한 인터랙션: 비어있는 필드 검사, 버튼 토글
(function () {
  const email = document.getElementById("email");
  const pass = document.getElementById("password");
  const login = document.getElementById("loginBtn");
  const signup = document.getElementById("signupBtn");

  function validate() {
    // 단순 체크: 이메일과 비밀번호가 있으면 활성화
    const ok = email.value.trim() !== "" && pass.value.trim() !== "";
    login.disabled = !ok;
  }

  // 초기 상태
  validate();

  email.addEventListener("input", validate);
  pass.addEventListener("input", validate);

  login.addEventListener("click", function (e) {
    e.preventDefault();
    // 여기서 실제 로그인 API 호출하면 됩니다.
    alert("로그인 시도\n이메일: " + email.value.trim());
  });

  signup.addEventListener("click", function (e) {
    e.preventDefault();
    // 회원가입 페이지로 이동하거나 모달 열기 등
    alert("회원가입 화면으로 이동합니다.");
    location.href = "register.html";
  });

  // 키보드 엔터로 로그인 (간단)
  [email, pass].forEach((el) =>
    el.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" && !login.disabled) {
        login.click();
      }
    })
  );
})();
