// STATE MANAGEMENT
let db = null;
let activeWeekIndex = 0;
let timelineTickerId = null;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ELEMENTS
const studentNameEl = document.getElementById('student-name');
const studentTargetEl = document.getElementById('student-target');
const overallPercentageEl = document.getElementById('overall-percentage');
const overallProgressBarEl = document.getElementById('overall-progress-bar');
const completedStatsEl = document.getElementById('completed-stats');
const dbStatusEl = document.getElementById('db-status');
const trainingStartDateEl = document.getElementById('training-start-date');
const trainingTimerEl = document.getElementById('training-timer');
const currentWeekTimerEl = document.getElementById('current-week-timer');
const weeksListEl = document.getElementById('weeks-list');

// Active Week Elements
const weekTitleEl = document.getElementById('week-title');
const weekSubtitleEl = document.getElementById('week-subtitle');
const weekStatusBadgeEl = document.getElementById('week-status-badge');
const weekScoreBadgeEl = document.getElementById('week-score-badge');
const daysContainerEl = document.getElementById('days-container');
const deliverablesContainerEl = document.getElementById('deliverables-container');
const mentorFeedbackContentEl = document.getElementById('mentor-feedback-content');
const checklistCountEl = document.getElementById('checklist-count');

// Daily Check-in Elements
const checkinGoalsEl = document.getElementById('checkin-goals');
const checkinTasksEl = document.getElementById('checkin-tasks');
const checkinRiskEl = document.getElementById('checkin-risk');
const generateCheckinBtn = document.getElementById('generate-checkin-btn');

// Interview Drill Elements
const drillQuestionEl = document.getElementById('drill-question');
const drillAnswerInput = document.getElementById('drill-answer-input');
const submitAnswerBtn = document.getElementById('submit-answer-btn');

// Actions
const saveBtn = document.getElementById('save-btn');
const toastEl = document.getElementById('toast');

// FETCH DATA ON LOAD
async function init() {
  try {
    const response = await fetch('/api/progress', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load database: ${response.status}`);
    }

    db = await response.json();
    
    // Set student info
    studentNameEl.textContent = db.student.name;
    studentTargetEl.textContent = db.student.target;
    syncActiveWeekWithTimeline();
    updateDbStatus();
    updateTimelineUI();
    startTimelineTicker();
    
    // Render sidebar & active content
    renderSidebar();
    renderActiveWeek();
    updateOverallProgressUI();
    
    // Load daily drill (based on current day or latest checkin)
    loadDailyDrill();
  } catch (error) {
    console.error('Failed to load database:', error);
    showToast('Lỗi tải dữ liệu!', 'error');
  }
}

// RENDER SIDEBAR
function renderSidebar() {
  weeksListEl.innerHTML = '';
  db.weeks.forEach((week, index) => {
    const li = document.createElement('li');
    li.className = index === activeWeekIndex ? 'active' : '';
    if (week.status === 'COMPLETED') {
      li.classList.add('completed-week');
    }
    
    li.innerHTML = `
      <span>Tuần ${week.week_number}</span>
      <div class="week-nav-status"></div>
    `;
    
    li.addEventListener('click', () => {
      // Save input changes of the previous week first if any
      saveCurrentWeekInputs();
      
      activeWeekIndex = index;
      document.querySelectorAll('#weeks-list li').forEach((el, i) => {
        el.className = i === activeWeekIndex ? 'active' : '';
        if (db.weeks[i].status === 'COMPLETED') el.classList.add('completed-week');
      });
      renderActiveWeek();
    });
    
    weeksListEl.appendChild(li);
  });
  
  // Re-run Lucide icons
  lucide.createIcons();
}

// RENDER ACTIVE WEEK DETAILS
function renderActiveWeek() {
  const week = db.weeks[activeWeekIndex];
  
  // Header details
  weekTitleEl.textContent = `Tuần ${week.week_number}: ${week.title}`;
  weekSubtitleEl.textContent = week.title;
  
  // Status badge
  weekStatusBadgeEl.className = `badge ${week.status}`;
  weekStatusBadgeEl.textContent = week.status.replace('_', ' ');
  
  // Score badge
  if (week.score !== null) {
    weekScoreBadgeEl.style.display = 'inline-block';
    weekScoreBadgeEl.textContent = `Score: ${week.score}/10`;
  } else {
    weekScoreBadgeEl.style.display = 'none';
  }
  
  // Render Days (Checklist)
  renderDays(week);
  
  // Render Deliverables
  renderDeliverables(week);
  
  // Render Mentor Feedback (with markdown)
  if (week.mentor_feedback) {
    mentorFeedbackContentEl.innerHTML = marked.parse(week.mentor_feedback);
  } else {
    mentorFeedbackContentEl.innerHTML = `<p class="text-muted">Chưa có đánh giá nào cho tuần này. Hãy gửi các PR và tài liệu hoàn thành để Mentor AI review nhé!</p>`;
  }
}

// RENDER DAYS
function renderDays(week) {
  daysContainerEl.innerHTML = '';
  let completedDays = 0;
  
  week.days.forEach((day, index) => {
    if (day.status === 'DONE') completedDays++;
    
    const dayCard = document.createElement('div');
    dayCard.className = `day-item ${day.status === 'DONE' ? 'done' : ''}`;
    
    dayCard.innerHTML = `
      <div class="day-check-wrapper">
        <input type="checkbox" class="custom-checkbox" ${day.status === 'DONE' ? 'checked' : ''}>
      </div>
      <div class="day-content">
        <div class="day-name">${day.day}</div>
        <div class="day-topic">${day.topic}</div>
      </div>
    `;
    
    // Toggle checkbox event
    const checkbox = dayCard.querySelector('.custom-checkbox');
    checkbox.addEventListener('change', (e) => {
      day.status = e.target.checked ? 'DONE' : 'TODO';
      day.updated_at = e.target.checked ? new Date().toISOString() : null;
      
      // Recalculate and update UI
      dayCard.classList.toggle('done', e.target.checked);
      recalculateProgress();
      updateOverallProgressUI();
      renderDays(week); // Rerender to update counts
    });
    
    daysContainerEl.appendChild(dayCard);
  });
  
  checklistCountEl.textContent = `${completedDays}/${week.days.length} Hoàn thành`;
  
  // If all days are completed, auto set week status to COMPLETED
  // Note: normally week status would require Mentor verification, but let's make it interactive.
  if (completedDays === week.days.length && week.status === 'NOT_STARTED') {
    week.status = 'IN_PROGRESS';
    renderSidebar();
    renderActiveWeek();
  }
}

// RENDER DELIVERABLES
function renderDeliverables(week) {
  deliverablesContainerEl.innerHTML = '';
  
  week.deliverables.forEach((deliverable) => {
    const item = document.createElement('div');
    item.className = 'deliverable-item';
    
    item.innerHTML = `
      <div class="deliverable-status-area">
        <span class="deliverable-title">${deliverable.name}</span>
        <span class="status-badge ${deliverable.status}">${deliverable.status}</span>
      </div>
      <div class="deliverable-inputs">
        <div class="input-link-wrapper">
          <i data-lucide="link"></i>
          <input type="text" class="deliverable-link-input" placeholder="Dán link PR (GitHub) hoặc link evidence" value="${deliverable.link || ''}">
        </div>
      </div>
    `;
    
    deliverablesContainerEl.appendChild(item);
  });
  
  lucide.createIcons();
}

// SAVE CURRENT INPUTS TO LOCAL STATE BEFORE SWITCHING WEEKS
function saveCurrentWeekInputs() {
  const week = db.weeks[activeWeekIndex];
  const linkInputs = document.querySelectorAll('.deliverable-link-input');
  
  linkInputs.forEach((input, idx) => {
    if (week.deliverables[idx]) {
      week.deliverables[idx].link = input.value;
    }
  });
}

// RECALCULATE PROGRESS
function recalculateProgress() {
  let totalTasks = 0;
  let completedTasks = 0;
  
  db.weeks.forEach(week => {
    week.days.forEach(day => {
      totalTasks++;
      if (day.status === 'DONE') {
        completedTasks++;
      }
    });
  });
  
  db.overall_progress.total_tasks = totalTasks;
  db.overall_progress.completed_tasks = completedTasks;
  
  // Calculate completed weeks
  let completedWeeks = 0;
  db.weeks.forEach(week => {
    // A week is completed if all tasks are done & deliverables are approved
    const allDaysDone = week.days.every(d => d.status === 'DONE');
    if (allDaysDone) {
      week.status = 'COMPLETED';
      completedWeeks++;
    } else {
      const someDaysDone = week.days.some(d => d.status === 'DONE');
      week.status = someDaysDone ? 'IN_PROGRESS' : 'NOT_STARTED';
    }
  });
  db.overall_progress.completed_weeks = completedWeeks;
  
  renderSidebar();
}

// UPDATE OVERALL PROGRESS UI
function updateOverallProgressUI() {
  const total = db.overall_progress.total_tasks;
  const completed = db.overall_progress.completed_tasks;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  overallPercentageEl.textContent = `${percentage}%`;
  overallProgressBarEl.style.width = `${percentage}%`;
  completedStatsEl.textContent = `${db.overall_progress.completed_weeks}/8 Tuần`;
}

function parseLocalDate(dateString) {
  if (!dateString || typeof dateString !== 'string') return null;

  const parts = dateString.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;

  const [year, month, day] = parts;
  return new Date(year, month - 1, day);
}

function startOfLocalDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatLocalDate(date) {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function getTimelineState() {
  if (!db || !db.program) return null;

  const startDate = parseLocalDate(db.program.training_start_date);
  if (!startDate) return null;

  const today = startOfLocalDay(new Date());
  const start = startOfLocalDay(startDate);
  const totalWeeks = db.program.duration_weeks || db.overall_progress.total_weeks || db.weeks.length;
  const totalDays = totalWeeks * 7;
  const elapsedDays = Math.floor((today - start) / MS_PER_DAY);

  if (elapsedDays < 0) {
    return {
      phase: 'countdown',
      startDate: start,
      daysUntilStart: Math.abs(elapsedDays),
      currentWeekIndex: 0,
      totalWeeks
    };
  }

  if (elapsedDays >= totalDays) {
    return {
      phase: 'completed',
      startDate: start,
      elapsedDays,
      currentWeekIndex: Math.max(0, Math.min(db.weeks.length - 1, totalWeeks - 1)),
      totalWeeks
    };
  }

  return {
    phase: 'active',
    startDate: start,
    elapsedDays,
    dayInWeek: (elapsedDays % 7) + 1,
    currentWeekIndex: Math.min(Math.floor(elapsedDays / 7), db.weeks.length - 1),
    daysLeft: totalDays - elapsedDays,
    totalWeeks
  };
}

function syncActiveWeekWithTimeline() {
  const timeline = getTimelineState();
  if (!timeline || !Number.isInteger(timeline.currentWeekIndex)) return;

  activeWeekIndex = Math.max(0, Math.min(timeline.currentWeekIndex, db.weeks.length - 1));
}

function updateTimelineUI() {
  if (!trainingStartDateEl || !trainingTimerEl || !currentWeekTimerEl) return;

  const timeline = getTimelineState();

  if (!timeline) {
    trainingStartDateEl.textContent = '--';
    trainingTimerEl.textContent = 'Chưa đặt lịch';
    currentWeekTimerEl.textContent = '--';
    return;
  }

  trainingStartDateEl.textContent = formatLocalDate(timeline.startDate);

  if (timeline.phase === 'countdown') {
    trainingTimerEl.textContent = `Còn ${timeline.daysUntilStart} ngày`;
    currentWeekTimerEl.textContent = 'Chờ tuần 1';
    return;
  }

  if (timeline.phase === 'completed') {
    trainingTimerEl.textContent = 'Đã hết 8 tuần';
    currentWeekTimerEl.textContent = `Tuần ${timeline.totalWeeks}`;
    return;
  }

  trainingTimerEl.textContent = `Ngày ${timeline.elapsedDays + 1}/${timeline.totalWeeks * 7}`;
  currentWeekTimerEl.textContent = `Tuần ${timeline.currentWeekIndex + 1}, ngày ${timeline.dayInWeek}/7`;
}

function startTimelineTicker() {
  if (timelineTickerId) {
    clearInterval(timelineTickerId);
  }

  timelineTickerId = setInterval(updateTimelineUI, 60 * 1000);
}

// UPDATE JSON DB VERSION UI
function updateDbStatus() {
  if (!dbStatusEl) return;

  if (!db || !db._meta) {
    dbStatusEl.textContent = 'JSON DB v--';
    dbStatusEl.removeAttribute('title');
    return;
  }

  const updatedAt = db._meta.updated_at ? new Date(db._meta.updated_at).toLocaleString('vi-VN') : 'chưa rõ';
  dbStatusEl.textContent = `JSON DB v${db._meta.version}`;
  dbStatusEl.title = `Cập nhật bởi ${db._meta.updated_by || 'system'} lúc ${updatedAt}`;
}

// SAVE ENTIRE DATABASE TO SERVER
async function saveDatabase() {
  if (!db) return false;

  saveCurrentWeekInputs();
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Actor': 'web-ui'
      },
      body: JSON.stringify(db)
    });

    const result = await response.json().catch(() => ({}));
    
    if (response.ok) {
      if (result.data) {
        db = result.data;
        updateDbStatus();
      }

      showToast('Đã lưu tiến độ thành công!');
      return true;
    } else if (response.status === 409) {
      showToast('Dữ liệu đã thay đổi ở nơi khác. Đang tải lại bản mới nhất...', 'error');
      await init();
      return false;
    } else {
      showToast(result.error || 'Có lỗi xảy ra khi lưu!', 'error');
      return false;
    }
  } catch (error) {
    console.error('Error saving database:', error);
    showToast('Lỗi kết nối server!', 'error');
    return false;
  }
}

// TOAST NOTIFICATION
function showToast(message, type = 'success') {
  toastEl.textContent = message;
  toastEl.className = 'toast show';
  if (type === 'error') {
    toastEl.style.borderColor = 'var(--accent-red)';
    toastEl.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.25)';
  } else {
    toastEl.style.borderColor = 'var(--accent-green)';
    toastEl.style.boxShadow = 'var(--glow-green)';
  }
  
  setTimeout(() => {
    toastEl.classList.remove('show');
  }, 3000);
}

// DAILY CHECK-IN GENERATOR
generateCheckinBtn.addEventListener('click', () => {
  const goals = checkinGoalsEl.value.trim();
  const tasksRaw = checkinTasksEl.value.trim();
  const risk = checkinRiskEl.value.trim();
  
  if (!goals) {
    showToast('Vui lòng điền mục tiêu hôm nay!', 'error');
    return;
  }
  
  const tasks = tasksRaw ? tasksRaw.split(',').map(t => t.trim()) : [];
  const weekNum = db.weeks[activeWeekIndex].week_number;
  
  // Format check-in text
  let checkinText = `### Daily Check-in - Tuần ${weekNum}\n`;
  checkinText += `- **Mục tiêu hôm nay**: ${goals}\n`;
  checkinText += `- **3 việc quan trọng nhất**:\n`;
  if (tasks.length > 0) {
    tasks.forEach((t, i) => {
      checkinText += `  ${i + 1}. ${t}\n`;
    });
  } else {
    checkinText += `  1. [Chưa điền]\n`;
  }
  checkinText += `- **Rủi ro lớn nhất**: ${risk || 'Không có'}\n`;
  checkinText += `- **Checklist done**: []\n`;
  
  // Copy to clipboard
  navigator.clipboard.writeText(checkinText).then(async () => {
    showToast('Đã copy nội dung Check-in!');
    
    // Save daily check-in to JSON DB
    const checkinObj = {
      date: new Date().toISOString().split('T')[0],
      week: weekNum,
      goals: goals,
      three_important_tasks: tasks,
      biggest_risk: risk,
      checklist_done: [],
      interview_question_of_the_day: {
        question: drillQuestionEl.textContent,
        student_answer: "",
        mentor_evaluation: ""
      }
    };
    
    // Avoid duplicate checkin for same day
    const existingIndex = db.daily_checkins.findIndex(c => c.date === checkinObj.date);
    if (existingIndex > -1) {
      db.daily_checkins[existingIndex] = checkinObj;
    } else {
      db.daily_checkins.push(checkinObj);
    }
    
    await saveDatabase();
  }).catch(err => {
    console.error('Failed to copy text:', err);
    showToast('Lỗi copy clipboard!', 'error');
  });
});

// INTERVIEW DRILL
function loadDailyDrill() {
  const currentWeek = db.weeks[activeWeekIndex];
  
  // Simple question generation based on week number
  const questions = {
    1: "REST API là gì? Phân biệt 401 Unauthorized và 403 Forbidden? Khi nào dùng Query Params vs Path Params?",
    2: "Node.js Event Loop hoạt động như thế nào? Sự khác nhau giữa process.nextTick() và setImmediate()?",
    3: "Vì sao chúng ta lại lưu 'showtime_seats' dưới dạng snapshot thay vì chỉ dùng liên kết đến bảng 'seats'? Lợi ích của database index là gì?",
    4: "Làm thế nào để tránh race condition khi hai user cùng đặt một ghế? Phân biệt SELECT FOR UPDATE và SELECT thông thường?",
    5: "Unit test khác với E2E test như thế nào? Tại sao chúng ta cần Mocking boundaries khi chạy test trong CI?",
    6: "Idempotency trong webhook thanh toán là gì? Bạn xử lý như thế nào nếu webhook payOS gửi trùng lặp?",
    7: "Bạn thiết kế ranh giới (boundary) giữa AI recommendation/search và core booking/payment như thế nào để đảm bảo hệ thống an toàn?",
    8: "Hãy trình bày ngắn gọn kiến trúc hệ thống đặt vé xem phim của bạn trong vòng 3 phút như đang phỏng vấn với nhà tuyển dụng."
  };
  
  const question = questions[currentWeek.week_number] || "Hãy mô tả các thách thức kỹ thuật lớn nhất mà bạn đã giải quyết trong tuần này.";
  drillQuestionEl.textContent = question;
  
  // Pre-fill answer if already exists in latest checkin
  const todayStr = new Date().toISOString().split('T')[0];
  const todayCheckin = db.daily_checkins.find(c => c.date === todayStr);
  if (todayCheckin && todayCheckin.interview_question_of_the_day && todayCheckin.interview_question_of_the_day.student_answer) {
    drillAnswerInput.value = todayCheckin.interview_question_of_the_day.student_answer;
  } else {
    drillAnswerInput.value = '';
  }
}

submitAnswerBtn.addEventListener('click', async () => {
  const answer = drillAnswerInput.value.trim();
  if (!answer) {
    showToast('Vui lòng nhập câu trả lời!', 'error');
    return;
  }
  
  const todayStr = new Date().toISOString().split('T')[0];
  let todayCheckin = db.daily_checkins.find(c => c.date === todayStr);
  
  if (!todayCheckin) {
    // Create checkin wrapper if not exists
    todayCheckin = {
      date: todayStr,
      week: db.weeks[activeWeekIndex].week_number,
      goals: "Trả lời câu hỏi Drill ngày",
      three_important_tasks: [],
      biggest_risk: "",
      checklist_done: [],
      interview_question_of_the_day: {
        question: drillQuestionEl.textContent,
        student_answer: answer,
        mentor_evaluation: ""
      }
    };
    db.daily_checkins.push(todayCheckin);
  } else {
    if (!todayCheckin.interview_question_of_the_day) {
      todayCheckin.interview_question_of_the_day = {};
    }
    todayCheckin.interview_question_of_the_day.question = drillQuestionEl.textContent;
    todayCheckin.interview_question_of_the_day.student_answer = answer;
  }
  
  const saved = await saveDatabase();
  if (saved) {
    showToast('Câu trả lời đã được gửi lên hệ thống JSON DB! Hãy nhờ Mentor AI đánh giá nhé.');
  }
});

// EVENT LISTENERS
saveBtn.addEventListener('click', saveDatabase);

// INITIALIZE
init();
