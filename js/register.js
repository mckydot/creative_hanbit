const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordCheck = document.getElementById("passwordCheck");
const registerBtn = document.getElementById("registerBtn");
const result = document.getElementById("result");

registerBtn.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("hello world");
  const psStr = password.value.trim();
  const psCheckStr = passwordCheck.value.trim();
  const emailCheck = email.value.trim();

  if (emailCheck == "") {
    result.innerText = "이메일을 입력해주세요.";
  } else if (psStr == "") {
    result.innerText = "비밀번호를 입력해주세요.";
  } else if (psStr != psCheckStr) {
    result.innerText = "비밀번호가 일치하지 않습니다.";
  } else {
    result.innerText = "hello world.";
    location.href = "register2.html";
  }
});
