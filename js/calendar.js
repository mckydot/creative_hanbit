window.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const monthYear = document.getElementById("monthYear");
  const calendarGrid = document.getElementById("calendarGrid");
  const prevBtn = document.getElementById("prevMonth");
  const nextBtn = document.getElementById("nextMonth");

  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();

  function renderCalendar(month, year) {
    calendarGrid.innerHTML = "";

    const firstDay = new Date(year, month).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    // 요일 표시
    weekdays.forEach((day) => {
      const div = document.createElement("div");
      div.classList.add("weekday");
      div.textContent = day;
      calendarGrid.appendChild(div);
    });

    // 빈칸
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("div");
      calendarGrid.appendChild(empty);
    }

    // 날짜 표시
    for (let d = 1; d <= lastDate; d++) {
      const dateDiv = document.createElement("div");
      dateDiv.classList.add("day");
      dateDiv.textContent = d;

      // 오늘 날짜 표시
      if (
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear()
      ) {
        dateDiv.classList.add("today");
      }

      calendarGrid.appendChild(dateDiv);
    }

    monthYear.textContent = `${year}년 ${month + 1}월`;
  }

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

  renderCalendar(currentMonth, currentYear);
});
