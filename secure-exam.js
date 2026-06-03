const instructions = document.querySelector("[data-instructions]");
const workspace = document.querySelector("[data-workspace]");
const results = document.querySelector("[data-results]");
const consent = document.querySelector("[data-consent]");
const startButton = document.querySelector("[data-start]");
const timer = document.querySelector("[data-timer]");
const timerBar = document.querySelector("[data-timer-bar]");
const saveStatus = document.querySelector("[data-save-status]");
const saveTime = document.querySelector("[data-save-time]");
const toast = document.querySelector("[data-toast]");
const mapButtons = document.querySelectorAll("[data-jump]");
const currentQuestion = document.querySelector("[data-current-question]");
const questionType = document.querySelector("[data-question-type]");
const flagButton = document.querySelector("[data-flag]");
const submitModal = document.querySelector("[data-modal]");

let remainingSeconds = 45 * 60;
let activeQuestion = 1;
let timerHandle;
let autosaveHandle;

const questionTypes = {
  1: "اختيار متعدد",
  2: "إجابة قصيرة",
  3: "مراجعة معلّمة",
  4: "ترتيب خطوات",
  5: "اختيار متعدد",
  6: "تحليل بياني",
  7: "إجابة قصيرة",
  8: "اختيار متعدد",
  9: "تطبيق مباشر",
  10: "ترتيب خطوات",
  11: "استنتاج",
  12: "مراجعة نهائية"
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const rest = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

function tickTimer() {
  remainingSeconds = Math.max(0, remainingSeconds - 1);
  timer.textContent = formatTime(remainingSeconds);
  timerBar.style.width = `${(remainingSeconds / (45 * 60)) * 100}%`;

  if (remainingSeconds === 5 * 60) {
    showToast("تبقى 5 دقائق على نهاية الامتحان");
  }

  if (remainingSeconds === 0) {
    submitExam();
  }
}

function autosave() {
  saveStatus.textContent = "تم الحفظ تلقائيا";
  saveTime.textContent = new Date().toLocaleTimeString("ar-TN", { minute: "2-digit", second: "2-digit" });
}

function setQuestion(number) {
  activeQuestion = number;
  currentQuestion.textContent = number;
  questionType.textContent = questionTypes[number] || "سؤال";
  mapButtons.forEach((button) => button.classList.toggle("active", Number(button.dataset.jump) === number));
  showToast(`تم الانتقال إلى السؤال ${number}`);
}

function submitExam() {
  window.clearInterval(timerHandle);
  window.clearInterval(autosaveHandle);
  submitModal.classList.add("hidden");
  workspace.classList.add("hidden");
  results.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  showToast("تم إرسال الامتحان وحساب النتيجة");
}

consent?.addEventListener("change", () => {
  startButton.disabled = !consent.checked;
});

startButton?.addEventListener("click", () => {
  instructions.classList.add("hidden");
  workspace.classList.remove("hidden");
  timerHandle = window.setInterval(tickTimer, 1000);
  autosaveHandle = window.setInterval(autosave, 9000);
  autosave();
  showToast("تم تشغيل وضع الامتحان الآمن");
});

mapButtons.forEach((button) => {
  button.addEventListener("click", () => setQuestion(Number(button.dataset.jump)));
});

document.querySelector("[data-next]")?.addEventListener("click", () => {
  setQuestion(Math.min(12, activeQuestion + 1));
});

document.querySelector("[data-prev]")?.addEventListener("click", () => {
  setQuestion(Math.max(1, activeQuestion - 1));
});

document.querySelectorAll("[data-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-choice]").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    document.querySelector(`[data-jump="${activeQuestion}"]`)?.classList.add("answered");
    autosave();
    showToast("تم حفظ الإجابة");
  });
});

flagButton?.addEventListener("click", () => {
  document.querySelector(`[data-jump="${activeQuestion}"]`)?.classList.toggle("flagged");
  showToast("تم تحديث علامة المراجعة");
});

document.querySelector("[data-open-submit]")?.addEventListener("click", () => {
  submitModal.classList.remove("hidden");
});

document.querySelector("[data-close-submit]")?.addEventListener("click", () => {
  submitModal.classList.add("hidden");
});

document.querySelector("[data-confirm-submit]")?.addEventListener("click", submitExam);

document.querySelector("[data-certificate]")?.addEventListener("click", () => {
  showToast("تم تجهيز شهادة الامتحان للتحميل");
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden && !workspace.classList.contains("hidden")) {
    showToast("تم تسجيل مغادرة الصفحة في سجل المراقبة");
  }
});
