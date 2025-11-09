// Supabase 설정
const SUPABASE_URL = "https://bawmwecykdaqsjklyjhb.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhd213ZWN5a2RhcXNqa2x5amhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5NjgxNzQsImV4cCI6MjA3NzU0NDE3NH0.KtTxYldOR_VCjUvI5BiAGBENkqHFRmApWM67PdKbGYQ";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

window.addEventListener("DOMContentLoaded", async () => {
  // ✅ 로그인 체크
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");

  if (!accessToken || !userId) {
    alert("로그인이 필요한 서비스입니다.");
    location.href = "login.html";
    return;
  }

  // ✅ Supabase 세션 확인 (선택적)
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error || !session) {
      console.warn("세션이 만료되었습니다.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      location.href = "login.html";
      return;
    }
  } catch (error) {
    console.error("세션 확인 오류:", error);
  }

  lucide.createIcons();

  const monthYear = document.getElementById("monthYear");
  const calendarGrid = document.getElementById("calendarGrid");
  const prevBtn = document.getElementById("prevMonth");
  const nextBtn = document.getElementById("nextMonth");
  const scheduleInput = document.getElementById("scheduleInput");
  const selectedDateTitle = document.getElementById("selectedDateTitle");
  const scheduleText = document.getElementById("scheduleText");
  const addScheduleBtn = document.getElementById("addScheduleBtn");
  const scheduleList = document.getElementById("scheduleList");
  const closeScheduleBtn = document.getElementById("closeScheduleBtn");
  const home = document.getElementById("home-btn2");
  const homeTop = document.getElementById("home-btn");
  const mypage = document.getElementById("mypage-btn");
  const settingsTop = document.getElementById("settings-btn");
  const settings = document.getElementById("settings-btn2");

  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let selectedDate = null;

  let schedules = {};

  // ✅ Supabase에서 일정 불러오기
  async function loadSchedules() {
    try {
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      schedules = {};
      data.forEach((item) => {
        if (!schedules[item.date]) {
          schedules[item.date] = [];
        }
        schedules[item.date].push({
          id: item.id,
          text: item.schedule_text,
        });
      });

      renderCalendar(currentMonth, currentYear);
    } catch (error) {
      console.error("일정 불러오기 오류:", error);
      alert("일정을 불러오는 중 오류가 발생했습니다.");
    }
  }

  // ✅ 일정 추가 (Supabase)
  async function addSchedule(date, text) {
    try {
      const { data, error } = await supabase
        .from("schedules")
        .insert([{ user_id: userId, date: date, schedule_text: text }])
        .select();

      if (error) throw error;

      if (!schedules[date]) {
        schedules[date] = [];
      }
      schedules[date].push({
        id: data[0].id,
        text: text,
      });

      renderCalendar(currentMonth, currentYear);
    } catch (error) {
      console.error("일정 추가 오류:", error);
      alert("일정 추가 중 오류가 발생했습니다.");
    }
  }

  // ✅ 일정 삭제 (Supabase)
  async function deleteSchedule(id, dateKey) {
    try {
      const { error } = await supabase.from("schedules").delete().eq("id", id);

      if (error) throw error;

      schedules[dateKey] = schedules[dateKey].filter((item) => item.id !== id);
      if (schedules[dateKey].length === 0) delete schedules[dateKey];

      renderCalendar(currentMonth, currentYear);
    } catch (error) {
      console.error("일정 삭제 오류:", error);
      alert("일정 삭제 중 오류가 발생했습니다.");
    }
  }

  // ✅ 일정 입력창 닫기 함수
  function closeScheduleInput() {
    scheduleInput.style.display = "none";
    scheduleText.value = "";
  }

  // ✅ 달력 렌더링 함수
  function renderCalendar(month, year) {
    calendarGrid.innerHTML = "";

    // 월/년 표시
    const months = [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ];
    monthYear.textContent = `${year}년 ${months[month]}`;

    // 요일 헤더
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    weekdays.forEach((day) => {
      const dayHeader = document.createElement("div");
      dayHeader.classList.add("calendar-day-header");
      dayHeader.textContent = day;
      calendarGrid.appendChild(dayHeader);
    });

    // 이번 달 첫날과 마지막 날
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    // 빈 칸 채우기
    for (let i = 0; i < firstDay; i++) {
      const emptyDiv = document.createElement("div");
      emptyDiv.classList.add("calendar-day", "empty");
      calendarGrid.appendChild(emptyDiv);
    }

    // ✅ 오늘 날짜 정보
    const todayDate = new Date();
    const todayYear = todayDate.getFullYear();
    const todayMonth = todayDate.getMonth();
    const todayDay = todayDate.getDate();

    // 날짜 채우기
    for (let date = 1; date <= lastDate; date++) {
      const dayDiv = document.createElement("div");
      dayDiv.classList.add("calendar-day");
      dayDiv.textContent = date;

      // ✅ 오늘 날짜 강조 표시
      if (year === todayYear && month === todayMonth && date === todayDay) {
        dayDiv.classList.add("today");
      }

      // 일정이 있는 날 표시
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        date
      ).padStart(2, "0")}`;
      if (schedules[dateKey] && schedules[dateKey].length > 0) {
        dayDiv.classList.add("has-schedule");
      }

      // 날짜 클릭 이벤트
      dayDiv.addEventListener("click", () => {
        selectedDate = dateKey;
        selectedDateTitle.textContent = `${year}년 ${month + 1}월 ${date}일`;
        scheduleInput.style.display = "block";
        scheduleText.value = "";
        scheduleText.focus();
      });

      calendarGrid.appendChild(dayDiv);
    }

    // 일정 목록도 함께 업데이트
    renderScheduleList(year, month);
  }

  // ✅ 일정 목록 렌더링 (오늘 포함)
  function renderScheduleList(year, month) {
    scheduleList.innerHTML = "";

    // ✅ 오늘 날짜 (시간 제거)
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    const filtered = Object.keys(schedules)
      .filter((key) => {
        const [y, m, d] = key.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        date.setHours(0, 0, 0, 0);

        // ✅ 현재 달이고, 오늘 이후 또는 오늘인 날짜만 표시
        return y === year && m === month + 1 && date >= todayDate;
      })
      .sort((a, b) => {
        const [ya, ma, da] = a.split("-").map(Number);
        const [yb, mb, db] = b.split("-").map(Number);
        return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
      });

    if (filtered.length === 0) {
      scheduleList.innerHTML = `<p style="color:#666; text-align:center;">다가올 일정이 없습니다.</p>`;
      return;
    }

    filtered.forEach((dateKey) => {
      const [y, m, d] = dateKey.split("-");
      schedules[dateKey].forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("schedule-item");
        div.innerHTML = `
                <span class="schedule-date">${m}월 ${d}일</span>
                <span class="schedule-text">${item.text}</span>
                <button class="delete-btn" data-id="${item.id}" data-key="${dateKey}">삭제</button>
            `;
        scheduleList.appendChild(div);
      });
    });

    // 삭제 기능
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        const key = e.target.dataset.key;
        deleteSchedule(id, key);
      });
    });
  }

  // ✅ 일정 추가 버튼 클릭
  addScheduleBtn.addEventListener("click", async () => {
    const text = scheduleText.value.trim();
    if (!text || !selectedDate) return;

    await addSchedule(selectedDate, text);
    closeScheduleInput();
  });

  // ✅ 닫기 버튼 클릭
  closeScheduleBtn.addEventListener("click", closeScheduleInput);

  // ✅ 배경 클릭 시 닫기
  scheduleInput.addEventListener("click", (e) => {
    if (e.target === scheduleInput) {
      closeScheduleInput();
    }
  });

  prevBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
  });

  nextBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
  });

  const ai = document.getElementById("ai-btn");

  ai.addEventListener("click", () => {
    location.href = "ai.html";
  });

  home.addEventListener("click", () => {
    location.href = "main.html";
  });

  mypage.addEventListener("click", () => {
    location.href = "mypage.html";
  });

  settings.addEventListener("click", () => {
    location.href = "setting.html";
  });

  settingsTop.addEventListener("click", () => {
    location.href = "setting.html";
  });

  homeTop.addEventListener("click", () => {
    location.href = "main.html";
  });
  // 삭제 기능
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      const key = e.target.dataset.key;
      deleteSchedule(id, key);
    });
  });

  // ✅ 초기 데이터 로드
  await loadSchedules();
});
