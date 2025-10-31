window.addEventListener("DOMContentLoaded", () => {
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

  let schedules = JSON.parse(localStorage.getItem("schedules")) || {};

  function saveSchedules() {
    localStorage.setItem("schedules", JSON.stringify(schedules));
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
      schedules[dateKey].forEach((text, idx) => {
        const div = document.createElement("div");
        div.classList.add("schedule-item");
        div.innerHTML = `
                <span class="schedule-date">${m}월 ${d}일</span>
                <span class="schedule-text">${text}</span>
                <button class="delete-btn" data-key="${dateKey}" data-idx="${idx}">삭제</button>
            `;
        scheduleList.appendChild(div);
      });
    });

    // 삭제 기능
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const key = e.target.dataset.key;
        const idx = e.target.dataset.idx;
        schedules[key].splice(idx, 1);
        if (schedules[key].length === 0) delete schedules[key];
        saveSchedules();
        renderCalendar(currentMonth, currentYear);
      });
    });
  }

  // ✅ 일정 추가 버튼 클릭
  addScheduleBtn.addEventListener("click", () => {
    const text = scheduleText.value.trim();
    if (!text || !selectedDate) return;

    if (!schedules[selectedDate]) {
      schedules[selectedDate] = [];
    }
    schedules[selectedDate].push(text);
    saveSchedules();
    renderCalendar(currentMonth, currentYear);
    closeScheduleInput();
  });

  // ✅ 닫기 버튼 클릭
  closeScheduleBtn.addEventListener("click", closeScheduleInput);

  // ✅ 배경 클릭 시 닫기 (선택사항)
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
  home.addEventListener("click", () => {
    location.href = "main.html";
  });
  mypage.addEventListener("click", () => {
    location.href = "";
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
  // 초기 렌더링
  renderCalendar(currentMonth, currentYear);
});
