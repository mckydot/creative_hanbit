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
  let bookmarkedPolicies = []; // 북마크된 공지사항 목록

  // ✅ 날짜 파싱 함수 (YYYYMMDD, YYYY.MM.DD, YYYY-MM-DD 등 지원)
  function parseDate(dateStr) {
    if (!dateStr) return null;

    // YYYYMMDD 형식
    if (/^\d{8}$/.test(dateStr)) {
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6)) - 1;
      const day = parseInt(dateStr.substring(6, 8));
      return new Date(year, month, day);
    }

    // YYYY.MM.DD 또는 YYYY-MM-DD 형식
    const match = dateStr.match(/(\d{4})[-.](\d{1,2})[-.](\d{1,2})/);
    if (match) {
      return new Date(
        parseInt(match[1]),
        parseInt(match[2]) - 1,
        parseInt(match[3])
      );
    }

    return null;
  }

  // ✅ 북마크된 공지사항 불러오기
  async function loadBookmarkedPolicies() {
    try {
      const { data, error } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId);

      if (error) throw error;

      bookmarkedPolicies = data
        .map((item) => {
          // policy_period에서 시작일과 종료일 추출
          let startDate = null;
          let endDate = null;

          if (item.policy_period) {
            // "YYYYMMDD ~ YYYYMMDD" 또는 "YYYY.MM.DD ~ YYYY.MM.DD" 형식
            const periodMatch = item.policy_period.match(
              /(\d{4}[-.]?\d{2}[-.]?\d{2})\s*~\s*(\d{4}[-.]?\d{2}[-.]?\d{2})/
            );
            if (periodMatch) {
              startDate = parseDate(periodMatch[1].replace(/[-.]/g, ""));
              endDate = parseDate(periodMatch[2].replace(/[-.]/g, ""));
            }
          }

          return {
            id: item.id,
            title: item.policy_title,
            startDate: startDate,
            endDate: endDate,
            link: item.policy_link,
          };
        })
        .filter((item) => item.startDate && item.endDate); // 날짜가 있는 항목만

      console.log("✅ 북마크된 공지사항:", bookmarkedPolicies);
    } catch (error) {
      console.error("북마크 공지사항 불러오기 오류:", error);
    }
  }

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
          type: "manual", // 수동 추가 일정
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
        type: "manual",
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

      const currentDate = new Date(year, month, date);
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        date
      ).padStart(2, "0")}`;

      // ✅ 북마크된 공지사항 확인 (시작일과 종료일만)
      const policiesOnDate = bookmarkedPolicies.filter((policy) => {
        // 시작일 또는 종료일과 정확히 일치하는지 확인
        return (
          currentDate.getTime() === policy.startDate.getTime() ||
          currentDate.getTime() === policy.endDate.getTime()
        );
      });

      if (policiesOnDate.length > 0) {
        // 공지사항 시작일 표시
        const isStartDate = policiesOnDate.some(
          (p) => p.startDate.getTime() === currentDate.getTime()
        );
        if (isStartDate) {
          dayDiv.classList.add("policy-start");
        }

        // 공지사항 종료일 표시
        const isEndDate = policiesOnDate.some(
          (p) => p.endDate.getTime() === currentDate.getTime()
        );
        if (isEndDate) {
          dayDiv.classList.add("policy-end");
        }
      }

      // 수동 일정이 있는 날 표시
      if (schedules[dateKey] && schedules[dateKey].length > 0) {
        dayDiv.classList.add("has-schedule");
      }

      // 날짜 클릭 이벤트
      dayDiv.addEventListener("click", () => {
        selectedDate = dateKey;
        selectedDateTitle.textContent = `${year}년 ${month + 1}월 ${date}일`;

        // 해당 날짜의 공지사항 표시
        if (policiesOnDate.length > 0) {
          const policyInfo = policiesOnDate
            .map((p) => `📌 ${p.title}`)
            .join("\n");
          alert(`이 날짜의 공지사항:\n\n${policyInfo}`);
        }

        scheduleInput.style.display = "block";
        scheduleText.value = "";
        scheduleText.focus();
      });

      calendarGrid.appendChild(dayDiv);
    }

    // 일정 목록도 함께 업데이트
    renderScheduleList(year, month);
  }

  // ✅ 일정 목록 렌더링 (공지사항 포함)
  function renderScheduleList(year, month) {
    scheduleList.innerHTML = "";

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    // 수동 일정 필터링
    const filteredSchedules = Object.keys(schedules)
      .filter((key) => {
        const [y, m, d] = key.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        date.setHours(0, 0, 0, 0);
        return y === year && m === month + 1 && date >= todayDate;
      })
      .sort((a, b) => {
        const [ya, ma, da] = a.split("-").map(Number);
        const [yb, mb, db] = b.split("-").map(Number);
        return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
      });

    // 이번 달의 북마크된 공지사항 필터링 (시작일/종료일만)
    const filteredPolicies = bookmarkedPolicies.filter((policy) => {
      const startMonth = policy.startDate.getMonth();
      const startYear = policy.startDate.getFullYear();
      const endMonth = policy.endDate.getMonth();
      const endYear = policy.endDate.getFullYear();

      // 시작일이나 종료일이 현재 달에 있는 경우만
      return (
        (startYear === year && startMonth === month) ||
        (endYear === year && endMonth === month)
      );
    });

    if (filteredSchedules.length === 0 && filteredPolicies.length === 0) {
      scheduleList.innerHTML = `<p style="color:#666; text-align:center;">다가올 일정이 없습니다.</p>`;
      return;
    }

    // 북마크된 공지사항 표시
    if (filteredPolicies.length > 0) {
      const policyHeader = document.createElement("h4");
      policyHeader.textContent = "📌 북마크한 공지사항";
      policyHeader.style.cssText =
        "margin: 15px 0 10px 0; color: #2563eb; font-size: 14px;";
      scheduleList.appendChild(policyHeader);

      filteredPolicies.forEach((policy) => {
        const div = document.createElement("div");
        div.classList.add("schedule-item", "policy-item");
        const startStr = `${
          policy.startDate.getMonth() + 1
        }/${policy.startDate.getDate()}`;
        const endStr = `${
          policy.endDate.getMonth() + 1
        }/${policy.endDate.getDate()}`;
        div.innerHTML = `
          <span class="schedule-date" style="background: #2563eb;">${startStr} ~ ${endStr}</span>
          <span class="schedule-text">${policy.title}</span>
          ${
            policy.link
              ? `<a href="${policy.link}" target="_blank" style="color: #2563eb; font-size: 12px;">링크 →</a>`
              : ""
          }
        `;
        scheduleList.appendChild(div);
      });
    }

    // 수동 일정 표시
    if (filteredSchedules.length > 0) {
      const scheduleHeader = document.createElement("h4");
      scheduleHeader.textContent = "✏️ 내 일정";
      scheduleHeader.style.cssText =
        "margin: 15px 0 10px 0; color: #059669; font-size: 14px;";
      scheduleList.appendChild(scheduleHeader);

      filteredSchedules.forEach((dateKey) => {
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

  // ✅ 초기 데이터 로드
  await loadBookmarkedPolicies(); // 북마크 공지사항 먼저 로드
  await loadSchedules(); // 그 다음 일정 로드
});
