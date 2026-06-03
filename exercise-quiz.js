const questions = [
  {
    type: "اختيار من متعدد",
    difficulty: "متوسط",
    title: "ما المعنى الهندسي للمشتقة في نقطة؟",
    hint: "فكر في العلاقة بين المنحنى والمماس.",
    mode: "choice",
    choices: ["مساحة تحت المنحنى", "ميل المماس في تلك النقطة", "قيمة الدالة نفسها", "محور التناظر"],
    answer: "ميل المماس في تلك النقطة"
  },
  {
    type: "صح أو خطأ",
    difficulty: "سهل",
    title: "إذا كانت المشتقة موجبة على مجال، فالدالة متزايدة على ذلك المجال.",
    hint: "إشارة المشتقة تعبر عن اتجاه تغير الدالة.",
    mode: "choice",
    choices: ["صحيح", "خطأ"],
    answer: "صحيح"
  },
  {
    type: "إجابة قصيرة",
    difficulty: "متوسط",
    title: "إذا كان f(x)=x²، اكتب قيمة f'(3).",
    hint: "مشتقة x² هي 2x.",
    mode: "fill",
    answer: "6"
  },
  {
    type: "اختيار من متعدد",
    difficulty: "متقدم",
    title: "أي عبارة تصف النقطة التي يكون فيها f'(a)=0 غالبا؟",
    hint: "المماس أفقي عندما يكون ميله صفرا.",
    mode: "choice",
    choices: ["مماس عمودي", "مماس أفقي", "دالة غير معرفة", "نقطة تقاطع فقط"],
    answer: "مماس أفقي"
  },
  {
    type: "صح أو خطأ",
    difficulty: "سهل",
    title: "المشتقة لا يمكن استعمالها في دراسة تغيرات الدالة.",
    hint: "جدول التغيرات يعتمد عادة على إشارة المشتقة.",
    mode: "choice",
    choices: ["صحيح", "خطأ"],
    answer: "خطأ"
  }
];

const startScreen = document.querySelector("[data-start-screen]");
const quizScreen = document.querySelector("[data-quiz-screen]");
const resultScreen = document.querySelector("[data-result-screen]");
const questionCard = document.querySelector("[data-question-card]");
const questionNav = document.querySelector("[data-question-nav]");
const timerText = document.querySelector("[data-timer]");
const progressLabel = document.querySelector("[data-progress-label]");
const progressBar = document.querySelector("[data-progress-bar]");
const questionType = document.querySelector("[data-question-type]");
const questionTitle = document.querySelector("[data-question-title]");
const difficulty = document.querySelector("[data-difficulty]");
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");
const modalBackdrop = document.querySelector("[data-modal-backdrop]");
const submitModal = document.querySelector("[data-submit-modal]");
const toast = document.querySelector("[data-toast]");

let activeIndex = 0;
let secondsLeft = 480;
let timerId;
const answers = new Array(questions.length).fill("");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function renderQuestion() {
  const question = questions[activeIndex];
  questionType.textContent = question.type;
  questionTitle.textContent = `السؤال ${activeIndex + 1}`;
  difficulty.textContent = question.difficulty;
  progressLabel.textContent = `${activeIndex + 1} / ${questions.length}`;
  progressBar.style.width = `${((activeIndex + 1) / questions.length) * 100}%`;
  prevButton.disabled = activeIndex === 0;
  nextButton.textContent = activeIndex === questions.length - 1 ? "مراجعة" : "التالي";

  questionCard.innerHTML = `
    <h3>${question.title}</h3>
    <div class="hint-box">${question.hint}</div>
    ${question.mode === "fill" ? renderFill(question) : renderChoices(question)}
  `;

  questionNav.querySelectorAll("button").forEach((button, index) => {
    button.classList.toggle("active", index === activeIndex);
    button.classList.toggle("answered", Boolean(answers[index]));
  });
}

function renderChoices(question) {
  return `<div class="choice-grid">${question.choices.map((choice) => `
    <button type="button" class="${answers[activeIndex] === choice ? "selected" : ""}" data-choice="${choice}">${choice}</button>
  `).join("")}</div>`;
}

function renderFill() {
  return `<input class="fill-input" type="text" value="${answers[activeIndex]}" placeholder="اكتب الإجابة هنا" data-fill-answer>`;
}

function updateTimer() {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  timerText.textContent = `${minutes}:${seconds}`;
  secondsLeft -= 1;
  if (secondsLeft < 0) submitQuiz();
}

function buildNavigator() {
  questionNav.innerHTML = "";
  questions.forEach((_, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = index + 1;
    button.addEventListener("click", () => {
      activeIndex = index;
      renderQuestion();
    });
    questionNav.appendChild(button);
  });
}

document.querySelector("[data-start]").addEventListener("click", () => {
  startScreen.classList.remove("active");
  quizScreen.hidden = false;
  buildNavigator();
  renderQuestion();
  timerId = window.setInterval(updateTimer, 1000);
  updateTimer();
});

questionCard.addEventListener("click", (event) => {
  const choice = event.target.closest("[data-choice]");
  if (!choice) return;
  answers[activeIndex] = choice.dataset.choice;
  showToast("تم حفظ الإجابة");
  renderQuestion();
});

questionCard.addEventListener("input", (event) => {
  if (!event.target.matches("[data-fill-answer]")) return;
  answers[activeIndex] = event.target.value.trim();
  questionNav.querySelectorAll("button")[activeIndex].classList.toggle("answered", Boolean(answers[activeIndex]));
});

prevButton.addEventListener("click", () => {
  if (activeIndex > 0) activeIndex -= 1;
  renderQuestion();
});

nextButton.addEventListener("click", () => {
  if (activeIndex < questions.length - 1) activeIndex += 1;
  renderQuestion();
});

document.querySelector("[data-open-submit]").addEventListener("click", () => {
  modalBackdrop.hidden = false;
  submitModal.hidden = false;
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

modalBackdrop.addEventListener("click", closeModal);
document.querySelector("[data-submit]").addEventListener("click", submitQuiz);

function closeModal() {
  modalBackdrop.hidden = true;
  submitModal.hidden = true;
}

function submitQuiz() {
  window.clearInterval(timerId);
  closeModal();
  quizScreen.hidden = true;
  resultScreen.hidden = false;

  const correct = questions.reduce((total, question, index) => {
    return total + (String(answers[index]).trim() === question.answer ? 1 : 0);
  }, 0);
  const percent = Math.round((correct / questions.length) * 100);

  document.querySelector("[data-score]").textContent = `${percent}%`;
  document.querySelector("[data-result-title]").textContent = percent >= 80 ? "أداء رائع" : percent >= 60 ? "تقدم جيد" : "تحتاج مراجعة قصيرة";
  document.querySelector("[data-result-summary]").textContent = `أجبت إجابة صحيحة عن ${correct} من ${questions.length} أسئلة. حصلت على ${Math.max(40, correct * 24)} XP.`;
  document.querySelector("[data-ai-analysis]").textContent = percent >= 80
    ? "أنت تتحكم جيدا في مفهوم المشتقة. انتقل الآن إلى قواعد الاشتقاق مع بعض التمارين المتقدمة."
    : "تحتاج إلى مراجعة التفسير الهندسي وعلاقة المشتقة بميل المماس قبل الانتقال للدرس التالي.";
}

document.querySelector("[data-retry]").addEventListener("click", () => {
  activeIndex = 0;
  secondsLeft = 480;
  answers.fill("");
  resultScreen.hidden = true;
  quizScreen.hidden = false;
  buildNavigator();
  renderQuestion();
  timerId = window.setInterval(updateTimer, 1000);
  updateTimer();
});
