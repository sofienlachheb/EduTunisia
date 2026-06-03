const tools = {
  lesson: { title: "Lesson Builder", pill: "درس كامل", output: "تم إنشاء درس منظم مع أهداف تعلم، شرح، مثالين، وتمرين ختامي." },
  course: { title: "Course Builder", pill: "خطة دورة", output: "تم إنشاء خطة دورة من 4 وحدات، أهداف أسبوعية، ومواد تقييم." },
  quiz: { title: "Quiz Generator", pill: "اختبار قصير", output: "تم إنشاء اختبار من 8 أسئلة متدرجة مع إجابات نموذجية." },
  exam: { title: "Exam Generator", pill: "امتحان شامل", output: "تم إنشاء امتحان شامل مع سلم إصلاح وتوزيع نقاط." },
  worksheet: { title: "Worksheet Generator", pill: "ورقة عمل", output: "تم إنشاء ورقة عمل قابلة للطباعة مع تمارين متدرجة." },
  presentation: { title: "Presentation Generator", pill: "عرض تقديمي", output: "تم إنشاء عرض من 7 شرائح مع نقاط شرح وأمثلة." },
  mindmap: { title: "Mind Map Generator", pill: "خريطة ذهنية", output: "تم إنشاء خريطة ذهنية تربط المفاهيم الأساسية والفرعية." }
};

const toolButtons = document.querySelectorAll("[data-tool]");
const title = document.querySelector("[data-active-tool-title]");
const pill = document.querySelector("[data-mode-pill]");
const promptInput = document.querySelector("[data-main-prompt]");
const editor = document.querySelector("[data-content-editor]");
const historyList = document.querySelector("[data-history-list]");
const toast = document.querySelector("[data-toast]");

let activeTool = "lesson";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1700);
}

toolButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toolButtons.forEach((item) => item.classList.toggle("active", item === button));
    activeTool = button.dataset.tool;
    title.textContent = tools[activeTool].title;
    pill.textContent = tools[activeTool].pill;
  });
});

document.querySelectorAll("[data-run-ai]").forEach((button) => {
  button.addEventListener("click", () => {
    const prompt = promptInput.value.trim() || "محتوى تعليمي جديد";
    editor.innerHTML = `
      <h3>${tools[activeTool].pill}: ${prompt.slice(0, 64)}</h3>
      <p>${tools[activeTool].output}</p>
      <ul>
        <li>هدف تعلم واضح ومناسب للمستوى.</li>
        <li>محتوى قابل للمراجعة والتصدير.</li>
        <li>اقتراحات AI لتحسين التفاعل والتقييم.</li>
      </ul>
    `;
    const item = document.createElement("li");
    item.innerHTML = `<strong>${tools[activeTool].title}</strong><span>الآن</span>`;
    historyList.prepend(item);
    showToast("تم توليد المحتوى");
  });
});

document.querySelector("[data-enhance-prompt]").addEventListener("click", () => {
  promptInput.value = `${promptInput.value.trim()} مع أهداف تعلم واضحة، أمثلة تونسية، أسئلة تقييم، ومستوى صعوبة متدرج.`;
  showToast("تم تحسين البرومبت");
});

document.querySelector("[data-copy-output]").addEventListener("click", () => {
  showToast("تم نسخ المحتوى");
});

document.querySelector("[data-open-history]").addEventListener("click", () => {
  document.querySelector("[data-history-panel]").scrollIntoView({ behavior: "smooth", block: "center" });
});
