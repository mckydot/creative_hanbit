// ✅ Supabase 회원가입 스크립트

// Supabase 설정
const SUPABASE_URL = "https://bawmwecykdaqsjklyjhb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd213ZWN5a2RhcXNqa2x5amhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjgxNzQsImV4cCI6MjA3NzU0NDE3NH0.KtTxYldOR_VCjUvI5BiAGBENkqHFRmApWM67PdKbGYQ";

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const email = document.getElementById("email");
const password = document.getElementById("password");
const passwordCheck = document.getElementById("passwordCheck");
const registerBtn = document.getElementById("registerBtn");
const result = document.getElementById("result");
const userName = document.getElementById("name");

/* ✅ 생년월일 자동 채우기 */
const yearSelect = document.getElementById("birth-year");
const monthSelect = document.getElementById("birth-month");
const daySelect = document.getElementById("birth-day");
const currentYear = new Date().getFullYear();

for (let y = currentYear; y >= 1950; y--) {
  yearSelect.insertAdjacentHTML(
    "beforeend",
    `<option value="${y}">${y}년</option>`
  );
}

for (let m = 1; m <= 12; m++) {
  monthSelect.insertAdjacentHTML(
    "beforeend",
    `<option value="${m}">${m}월</option>`
  );
}

function updateDays() {
  daySelect.innerHTML = '<option value="">일</option>';
  const year = yearSelect.value;
  const month = monthSelect.value;
  if (!year || !month) return;
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    daySelect.insertAdjacentHTML(
      "beforeend",
      `<option value="${d}">${d}일</option>`
    );
  }
}
yearSelect.addEventListener("change", updateDays);
monthSelect.addEventListener("change", updateDays);

/* ✅ 지역 선택 (시/도 → 시군구) */
const districts = {
  서울특별시: [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  부산광역시: [
    "강서구",
    "금정구",
    "남구",
    "동구",
    "동래구",
    "부산진구",
    "북구",
    "사상구",
    "사하구",
    "서구",
    "수영구",
    "연제구",
    "영도구",
    "중구",
    "해운대구",
  ],
  대구광역시: [
    "남구",
    "달서구",
    "동구",
    "북구",
    "서구",
    "수성구",
    "중구",
    "달성군",
  ],
  인천광역시: [
    "강화군",
    "계양구",
    "남동구",
    "동구",
    "미추홀구",
    "부평구",
    "서구",
    "연수구",
    "옹진군",
    "중구",
  ],
  광주광역시: ["광산구", "남구", "동구", "북구", "서구"],
  대전광역시: ["대덕구", "동구", "서구", "유성구", "중구"],
  울산광역시: ["남구", "동구", "북구", "중구", "울주군"],
  세종특별자치시: ["세종시 전체"],
  경기도: [
    "가평군",
    "고양시",
    "과천시",
    "광명시",
    "광주시",
    "구리시",
    "군포시",
    "김포시",
    "남양주시",
    "동두천시",
    "부천시",
    "성남시",
    "수원시",
    "시흥시",
    "안산시",
    "안성시",
    "안양시",
    "양주시",
    "양평군",
    "여주시",
    "연천군",
    "오산시",
    "용인시",
    "의왕시",
    "의정부시",
    "이천시",
    "파주시",
    "평택시",
    "포천시",
    "하남시",
    "화성시",
  ],
  강원특별자치도: [
    "강릉시",
    "고성군",
    "동해시",
    "삼척시",
    "속초시",
    "양구군",
    "양양군",
    "영월군",
    "원주시",
    "인제군",
    "정선군",
    "철원군",
    "춘천시",
    "태백시",
    "평창군",
    "홍천군",
    "화천군",
    "횡성군",
  ],
  충청북도: [
    "괴산군",
    "단양군",
    "보은군",
    "영동군",
    "옥천군",
    "음성군",
    "제천시",
    "증평군",
    "진천군",
    "청주시",
    "충주시",
  ],
  충청남도: [
    "계룡시",
    "공주시",
    "금산군",
    "논산시",
    "당진시",
    "보령시",
    "부여군",
    "서산시",
    "서천군",
    "아산시",
    "예산군",
    "천안시",
    "청양군",
    "태안군",
    "홍성군",
  ],
  전북특별자치도: [
    "고창군",
    "군산시",
    "김제시",
    "남원시",
    "무주군",
    "부안군",
    "순창군",
    "완주군",
    "익산시",
    "임실군",
    "장수군",
    "전주시",
    "정읍시",
    "진안군",
  ],
  전라남도: [
    "강진군",
    "고흥군",
    "곡성군",
    "광양시",
    "구례군",
    "나주시",
    "담양군",
    "목포시",
    "무안군",
    "보성군",
    "순천시",
    "신안군",
    "여수시",
    "영광군",
    "영암군",
    "완도군",
    "장성군",
    "장흥군",
    "진도군",
    "함평군",
    "해남군",
    "화순군",
  ],
  경상북도: [
    "경산시",
    "경주시",
    "고령군",
    "구미시",
    "군위군",
    "김천시",
    "문경시",
    "봉화군",
    "상주시",
    "성주군",
    "안동시",
    "영덕군",
    "영양군",
    "영주시",
    "영천시",
    "예천군",
    "울릉군",
    "울진군",
    "의성군",
    "청도군",
    "청송군",
    "칠곡군",
    "포항시",
  ],
  경상남도: [
    "거제시",
    "거창군",
    "고성군",
    "김해시",
    "남해군",
    "밀양시",
    "사천시",
    "산청군",
    "양산시",
    "의령군",
    "진주시",
    "창녕군",
    "창원시",
    "통영시",
    "하동군",
    "함안군",
    "함양군",
    "합천군",
  ],
  제주특별자치도: ["제주시", "서귀포시"],
};

const citySelect = document.getElementById("region-city");
const districtSelect = document.getElementById("region-district");

citySelect.addEventListener("change", () => {
  const city = citySelect.value;
  districtSelect.innerHTML = '<option value="">시/군/구 선택</option>';
  if (districts[city]) {
    districts[city].forEach((d) => {
      districtSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${d}">${d}</option>`
      );
    });
  }
});

// ✅ 직업 선택 값 확인용
const jobSelect = document.getElementById("job-select");
jobSelect.addEventListener("change", () => {
  console.log("선택한 직업:", jobSelect.value);
});

// ✅ 키워드 관련 기능
const keywordInput = document.getElementById("keyword-input");
const addKeywordBtn = document.getElementById("addKeywordBtn");
const keywordList = document.getElementById("keyword-list");

let keywords = [];

addKeywordBtn.addEventListener("click", () => {
  const keyword = keywordInput.value.trim();

  if (keyword === "") {
    alert("키워드를 입력해주세요!");
    return;
  }

  if (keywords.includes(keyword)) {
    alert("이미 추가된 키워드입니다!");
    keywordInput.value = "";
    return;
  }

  keywords.push(keyword);

  const li = document.createElement("li");
  li.classList.add("keyword-item");
  li.innerHTML = `
    <span>${keyword}</span>
    <button class="delete-btn" aria-label="삭제">✕</button>
  `;

  li.querySelector(".delete-btn").addEventListener("click", () => {
    keywords = keywords.filter((k) => k !== keyword);
    li.remove();
  });

  keywordList.appendChild(li);
  keywordInput.value = "";
  console.log("현재 키워드 배열:", keywords);
});

// ✅ 회원가입 버튼 클릭
registerBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  const nameVal = userName.value.trim();
  const emailVal = email.value.trim();
  const pwVal = password.value.trim();
  const pwCheckVal = passwordCheck.value.trim();
  const cityVal = citySelect.value;
  const districtVal = districtSelect.value;
  const yearVal = yearSelect.value;
  const monthVal = monthSelect.value;
  const dayVal = daySelect.value;
  const jobVal = jobSelect.value;

  // ⚙️ 유효성 검사
  if (nameVal === "") {
    result.innerText = "이름을 입력해주세요.";
    return;
  }
  if (emailVal === "") {
    result.innerText = "이메일을 입력해주세요.";
    return;
  }
  if (pwVal === "") {
    result.innerText = "비밀번호를 입력해주세요.";
    return;
  }
  if (pwVal !== pwCheckVal) {
    result.innerText = "비밀번호가 일치하지 않습니다.";
    return;
  }
  if (!cityVal || !districtVal) {
    result.innerText = "지역을 선택해주세요.";
    return;
  }
  if (!yearVal || !monthVal || !dayVal) {
    result.innerText = "생년월일을 선택해주세요.";
    return;
  }
  if (!jobVal) {
    result.innerText = "직업을 선택해주세요.";
    return;
  }

  try {
    console.log("🔐 Supabase 회원가입 시도:", emailVal);

    // 1️⃣ Supabase Auth에 사용자 등록 (이메일 인증 비활성화)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: emailVal,
      password: pwVal,
      options: {
        emailRedirectTo: undefined,
        data: {
          email_confirmed: true,
        },
      },
    });

    console.log("📥 Auth 응답:", { authData, authError });

    if (authError) {
      console.error("❌ 회원가입 실패:", authError);

      let errorMsg = "회원가입에 실패했습니다.";
      if (authError.message.includes("already registered")) {
        errorMsg = "이미 가입된 이메일입니다.";
      } else if (authError.message.includes("Password should be")) {
        errorMsg = "비밀번호는 최소 6자 이상이어야 합니다.";
      } else {
        errorMsg = authError.message;
      }

      result.innerText = `❌ ${errorMsg}`;
      return;
    }

    // 2️⃣ 사용자 정보를 users 테이블에 저장
    const userId = authData.user.id;
    const birthDate = `${yearVal}-${String(monthVal).padStart(2, "0")}-${String(
      dayVal
    ).padStart(2, "0")}`;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          id: userId,
          email: emailVal,
          username: nameVal,
          city: cityVal,
          district: districtVal,
          birth_date: birthDate,
          job: jobVal,
          keywords: keywords, // JSON 배열로 저장
          created_at: new Date().toISOString(),
        },
      ]);

    console.log("📥 User 데이터 저장:", { userData, userError });

    if (userError) {
      console.error("❌ 사용자 정보 저장 실패:", userError);
      result.innerText = `❌ 사용자 정보 저장 실패: ${userError.message}`;
      return;
    }

    console.log("✅ 회원가입 성공!");
    result.innerText = "✅ 회원가입 성공! 로그인 페이지로 이동합니다.";

    setTimeout(() => {
      location.href = "index.html";
    }, 1500);
  } catch (error) {
    console.error("🚨 예외 발생:", error);
    console.error("🚨 에러 스택:", error.stack);
    result.innerText = "🚨 서버에 연결할 수 없습니다.";
  }
});
