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
const aiReviewWeekBtn = document.getElementById('ai-review-week-btn');

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
      <div class="day-content" style="cursor: pointer; flex-grow: 1;">
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

    // Open detail Drawer
    const dayContent = dayCard.querySelector('.day-content');
    dayContent.addEventListener('click', () => {
      openDayDrawer(day.day);
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
    1: "Hãy giải thích cách bạn map domain Movie/Cinema/Showtime thành OOP model, NestJS module/controller/service và public API contract. Tradeoff lớn nhất là gì?",
    2: "Nếu client gọi GET /movies với query sai hoặc quá lớn, API production nên phản hồi thế nào? Hãy giải thích validation, error contract, request id và logging.",
    3: "Vì sao hệ thống cần snapshot showtime_seats khi tạo suất chiếu? Hãy giải thích constraint, migration, seed và index phục vụ query suất chiếu.",
    4: "Hai customer cùng giữ ghế A1 cùng lúc thì chuyện gì xảy ra? Hãy mô tả invariant, transaction, row lock, expired hold và test chứng minh chỉ một request thắng.",
    5: "Hãy mô tả state machine booking -> payment -> ticket -> check-in. Unit test và E2E test nào là bắt buộc để chứng minh flow này an toàn?",
    6: "Webhook payOS gửi trùng hoặc gửi sai amount thì backend xử lý thế nào? Hãy giải thích provider abstraction, signature verification, idempotency và integration logs.",
    7: "Admin AI content draft nên được thiết kế ra sao để AI không tự làm hỏng dữ liệu production? Hãy giải thích schema validation, human approval và fallback.",
    8: "Hãy pitch project Movie Ticket Booking Backend trong 3 phút, sau đó deep dive vào transaction giữ ghế, webhook idempotency, semantic search và evidence test."
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

aiReviewWeekBtn.addEventListener('click', async () => {
  const weekNum = db.weeks[activeWeekIndex].week_number;
  
  const originalText = aiReviewWeekBtn.innerHTML;
  aiReviewWeekBtn.disabled = true;
  aiReviewWeekBtn.innerHTML = `<i data-lucide="loader" class="animate-spin" style="width: 14px; height: 14px;"></i> Đang đánh giá...`;
  lucide.createIcons();
  
  try {
    const response = await fetch('/api/mentor/review-week', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ week: weekNum })
    });
    
    const result = await response.json();
    if (response.ok) {
      db = result.data; // Update local database state
      
      // Rerender UI
      renderSidebar();
      renderActiveWeek();
      updateOverallProgressUI();
      updateDbStatus();
      
      showToast(`Mentor AI đã đánh giá xong Tuần ${weekNum}!`);
    } else {
      showToast(result.error || 'Có lỗi xảy ra khi gọi AI Mentor!', 'error');
    }
  } catch (error) {
    console.error('AI Review error:', error);
    showToast('Lỗi kết nối hoặc API keys!', 'error');
  } finally {
    aiReviewWeekBtn.disabled = false;
    aiReviewWeekBtn.innerHTML = originalText;
    lucide.createIcons();
  }
});

// ==========================================
// UPGRADES: DRAWER & MODALS STATE & LOGIC
// ==========================================

let activeDrawerDay = null;
let chatHistory = [];

// DOM References for Drawer
const sideDrawerEl = document.getElementById('side-drawer');
const drawerOverlayEl = document.getElementById('drawer-overlay');
const closeDrawerBtn = document.getElementById('close-drawer-btn');
const drawerDayTitleEl = document.getElementById('drawer-day-title');
const drawerDaySubtitleEl = document.getElementById('drawer-day-subtitle');
const studyLogMarkdownEl = document.getElementById('study-log-markdown');
const studyLogEditorEl = document.getElementById('study-log-editor');
const saveLogBtn = document.getElementById('save-log-btn');
const chatMessagesContainerEl = document.getElementById('chat-messages-container');
const chatInputEl = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');
const drawerTabs = document.querySelectorAll('.drawer-tab');
const drawerTabContents = document.querySelectorAll('.drawer-tab-content');

// DOM References for Traceability Modal
const openTraceabilityBtn = document.getElementById('open-traceability-btn');
const traceabilityModalEl = document.getElementById('traceability-modal');
const traceabilityOverlayEl = document.getElementById('traceability-overlay');
const closeTraceabilityBtnModal = document.getElementById('close-traceability-btn-modal');
const traceabilityMarkdownEl = document.getElementById('traceability-matrix-markdown');

// DOM References for Terminal Modal
const openTerminalBtn = document.getElementById('open-terminal-btn');
const terminalModalEl = document.getElementById('terminal-modal');
const terminalOverlayEl = document.getElementById('terminal-overlay');
const closeTerminalBtnModal = document.getElementById('close-terminal-btn-modal');
const terminalCommandSelect = document.getElementById('terminal-command-select');
const runTerminalCmdBtn = document.getElementById('run-terminal-cmd-btn');
const terminalStatusEl = document.getElementById('terminal-status');
const terminalOutputPre = document.getElementById('terminal-output-pre');

// --- DRAWER FUNCTIONS ---

async function openDayDrawer(dayName) {
  const weekNum = db.weeks[activeWeekIndex].week_number;
  activeDrawerDay = dayName;
  chatHistory = [];
  
  // Set titles
  drawerDayTitleEl.textContent = dayName;
  drawerDaySubtitleEl.textContent = `Tuần ${weekNum} - ${db.weeks[activeWeekIndex].days.find(d => d.day === dayName).topic}`;
  
  // Load default tab (Read log)
  switchTab('view-log');
  
  // Open Drawer UI
  sideDrawerEl.classList.add('show');
  
  // Load content
  studyLogMarkdownEl.innerHTML = '<p class="text-muted">Đang tải nhật ký...</p>';
  studyLogEditorEl.value = '';
  
  // Reset chat messages
  chatMessagesContainerEl.innerHTML = `
    <div class="chat-message mentor" style="background-color: var(--bg-tertiary); border: 1px solid var(--border-color); padding: 12px 16px; border-radius: 16px 16px 16px 0; max-width: 85%; font-size: 13px; line-height: 1.5; align-self: flex-start;">
      Chào bạn! Tôi là Mentor AI. Tôi có thể hỗ trợ gì cho bạn trong nội dung bài học <strong>${dayName}</strong> hôm nay?
    </div>
  `;
  
  try {
    const response = await fetch(`/api/study-log?week=${weekNum}&day=${dayName}`);
    const result = await response.json();
    
    if (result.content) {
      studyLogMarkdownEl.innerHTML = marked.parse(result.content);
      studyLogEditorEl.value = result.content;
    } else {
      studyLogMarkdownEl.innerHTML = '<p class="text-muted">Chưa có nội dung ghi chép cho ngày này. Hãy chuyển qua tab "Sửa Nhật Ký" để viết bài làm đầu tiên!</p>';
      studyLogEditorEl.value = '';
    }
  } catch (error) {
    console.error('Error loading study log:', error);
    studyLogMarkdownEl.innerHTML = '<p class="text-danger">Lỗi kết nối khi tải nhật ký!</p>';
  }
}

function closeDayDrawer() {
  sideDrawerEl.classList.remove('show');
  activeDrawerDay = null;
}

function switchTab(tabId) {
  drawerTabs.forEach(tab => {
    if (tab.getAttribute('data-tab') === tabId) {
      tab.classList.add('active');
      tab.style.borderBottom = '2px solid var(--accent-purple)';
      tab.style.color = 'var(--text-primary)';
      tab.style.fontWeight = '600';
    } else {
      tab.classList.remove('active');
      tab.style.borderBottom = 'none';
      tab.style.color = 'var(--text-muted)';
      tab.style.fontWeight = '400';
    }
  });
  
  drawerTabContents.forEach(content => {
    if (content.id === `tab-${tabId}`) {
      content.style.display = 'block';
    } else {
      content.style.display = 'none';
    }
  });
}

// Save log handler
saveLogBtn.addEventListener('click', async () => {
  if (!activeDrawerDay) return;
  const weekNum = db.weeks[activeWeekIndex].week_number;
  const content = studyLogEditorEl.value;
  
  saveLogBtn.disabled = true;
  const originalText = saveLogBtn.innerHTML;
  saveLogBtn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> Đang lưu...';
  lucide.createIcons();
  
  try {
    const response = await fetch('/api/study-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ week: weekNum, day: activeDrawerDay, content })
    });
    
    if (response.ok) {
      showToast('Đã lưu nhật ký học tập thành công!');
      studyLogMarkdownEl.innerHTML = marked.parse(content || '<p class="text-muted">Chưa có nội dung ghi chép cho ngày này.</p>');
      switchTab('view-log');
    } else {
      showToast('Lỗi khi lưu nhật ký!', 'error');
    }
  } catch (error) {
    console.error('Error saving study log:', error);
    showToast('Lỗi kết nối server!', 'error');
  } finally {
    saveLogBtn.disabled = false;
    saveLogBtn.innerHTML = originalText;
    lucide.createIcons();
  }
});

// AI Chatbot handler
async function sendChatMessage() {
  const message = chatInputEl.value.trim();
  if (!message || !activeDrawerDay) return;
  
  const weekNum = db.weeks[activeWeekIndex].week_number;
  
  // Append User message
  const userMsgEl = document.createElement('div');
  userMsgEl.className = 'chat-message user';
  userMsgEl.textContent = message;
  chatMessagesContainerEl.appendChild(userMsgEl);
  
  chatInputEl.value = '';
  chatMessagesContainerEl.scrollTop = chatMessagesContainerEl.scrollHeight;
  
  // Append Mentor AI typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'chat-message mentor';
  typingEl.style.color = 'var(--text-muted)';
  typingEl.innerHTML = 'AI Mentor đang gõ...';
  chatMessagesContainerEl.appendChild(typingEl);
  chatMessagesContainerEl.scrollTop = chatMessagesContainerEl.scrollHeight;
  
  try {
    const response = await fetch('/api/mentor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        week: weekNum,
        day: activeDrawerDay,
        message,
        history: chatHistory
      })
    });
    
    const result = await response.json();
    typingEl.remove();
    
    if (response.ok && result.reply) {
      const replyEl = document.createElement('div');
      replyEl.className = 'chat-message mentor';
      replyEl.style.backgroundColor = 'var(--bg-tertiary)';
      replyEl.style.border = '1px solid var(--border-color)';
      replyEl.style.padding = '12px 16px';
      replyEl.style.borderRadius = '16px 16px 16px 0';
      replyEl.style.maxWidth = '85%';
      replyEl.style.fontSize = '13px';
      replyEl.style.lineHeight = '1.5';
      replyEl.style.alignSelf = 'flex-start';
      replyEl.innerHTML = marked.parse(result.reply);
      chatMessagesContainerEl.appendChild(replyEl);
      
      // Update history
      chatHistory.push({ role: 'user', content: message });
      chatHistory.push({ role: 'model', content: result.reply });
    } else {
      const errEl = document.createElement('div');
      errEl.className = 'chat-message mentor';
      errEl.style.color = 'var(--accent-red)';
      errEl.innerHTML = result.error || 'Có lỗi xảy ra khi trò chuyện với AI Mentor!';
      chatMessagesContainerEl.appendChild(errEl);
    }
  } catch (error) {
    console.error('Chat error:', error);
    typingEl.remove();
    const errEl = document.createElement('div');
    errEl.className = 'chat-message mentor';
    errEl.style.color = 'var(--accent-red)';
    errEl.innerHTML = 'Lỗi kết nối với AI Mentor!';
    chatMessagesContainerEl.appendChild(errEl);
  } finally {
    chatMessagesContainerEl.scrollTop = chatMessagesContainerEl.scrollHeight;
  }
}

sendChatBtn.addEventListener('click', sendChatMessage);
chatInputEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendChatMessage();
});

// Close drawer listeners
closeDrawerBtn.addEventListener('click', closeDayDrawer);
drawerOverlayEl.addEventListener('click', closeDayDrawer);

// Tab switching listeners
drawerTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchTab(tab.getAttribute('data-tab'));
  });
});

// --- TRACEABILITY MATRIX MODAL FUNCTIONS ---

async function openTraceabilityModal() {
  traceabilityModalEl.classList.add('show');
  traceabilityMarkdownEl.innerHTML = '<p class="text-muted">Đang tải ma trận truy xuất nguồn gốc...</p>';
  
  try {
    const response = await fetch('/api/traceability');
    const result = await response.json();
    if (result.content) {
      traceabilityMarkdownEl.innerHTML = marked.parse(result.content);
    } else {
      traceabilityMarkdownEl.innerHTML = '<p class="text-muted">Không tìm thấy file ma trận truy xuất nguồn gốc.</p>';
    }
  } catch (error) {
    console.error('Error loading traceability:', error);
    traceabilityMarkdownEl.innerHTML = '<p class="text-danger">Lỗi kết nối khi tải ma trận truy xuất nguồn gốc!</p>';
  }
}

function closeTraceabilityModal() {
  traceabilityModalEl.classList.remove('show');
}

openTraceabilityBtn.addEventListener('click', openTraceabilityModal);
closeTraceabilityBtnModal.addEventListener('click', closeTraceabilityModal);
traceabilityOverlayEl.addEventListener('click', closeTraceabilityModal);

// --- TERMINAL MODAL FUNCTIONS ---

function openTerminalModal() {
  terminalModalEl.classList.add('show');
}

function closeTerminalModal() {
  terminalModalEl.classList.remove('show');
}

async function runTerminalCommand() {
  const command = terminalCommandSelect.value;
  
  terminalStatusEl.textContent = 'RUNNING';
  terminalStatusEl.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
  terminalStatusEl.style.color = 'var(--accent-yellow)';
  
  terminalOutputPre.textContent = `Đang chạy lệnh: ${command}...\n`;
  runTerminalCmdBtn.disabled = true;
  
  try {
    const response = await fetch('/api/terminal/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      terminalOutputPre.textContent = result.stdout || result.stderr || 'Lệnh thực thi thành công không có output.';
      if (result.exitCode === 0) {
        terminalStatusEl.textContent = 'SUCCESS';
        terminalStatusEl.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        terminalStatusEl.style.color = 'var(--accent-green)';
      } else {
        terminalStatusEl.textContent = `FAILED (${result.exitCode})`;
        terminalStatusEl.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        terminalStatusEl.style.color = 'var(--accent-red)';
      }
    } else {
      terminalOutputPre.textContent = result.error || 'Lỗi khi thực thi lệnh!';
      terminalStatusEl.textContent = 'ERROR';
      terminalStatusEl.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
      terminalStatusEl.style.color = 'var(--accent-red)';
    }
  } catch (error) {
    console.error('Terminal run error:', error);
    terminalOutputPre.textContent = 'Lỗi kết nối server!';
    terminalStatusEl.textContent = 'ERROR';
    terminalStatusEl.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
    terminalStatusEl.style.color = 'var(--accent-red)';
  } finally {
    runTerminalCmdBtn.disabled = false;
  }
}

openTerminalBtn.addEventListener('click', openTerminalModal);
closeTerminalBtnModal.addEventListener('click', closeTerminalModal);
terminalOverlayEl.addEventListener('click', closeTerminalModal);
runTerminalCmdBtn.addEventListener('click', runTerminalCommand);

// INITIALIZE
init();
