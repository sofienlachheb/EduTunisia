const tabButtons = document.querySelectorAll("[data-tab]");
const panels = document.querySelectorAll("[data-panel]");
const titleInput = document.querySelector("[data-title-input]");
const lessonContent = document.querySelector("[data-lesson-content]");
const previewTitle = document.querySelector("[data-preview-title]");
const previewContent = document.querySelector("[data-preview-content]");
const objectivesList = document.querySelector("[data-objectives-list]");
const questionList = document.querySelector("[data-question-list]");
const aiPrompt = document.querySelector("[data-ai-prompt]");
const aiOutput = document.querySelector("[data-ai-output]");
const modalBackdrop = document.querySelector("[data-modal-backdrop]");
const publishModal = document.querySelector("[data-publish-modal]");
const toast = document.querySelector("[data-toast]");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((item) => item.classList.toggle("active", item === button));
    panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === button.dataset.tab));
  });
});

titleInput.addEventListener("input", () => {
  previewTitle.textContent = titleInput.value || "عنوان الدرس";
});

lessonContent.addEventListener("input", () => {
  const text = lessonContent.textContent.trim().replace(/\s+/g, " ");
  previewContent.textContent = text.slice(0, 150) || "ملخص الدرس سيظهر هنا.";
});

document.querySelector("[data-add-objective]").addEventListener("click", () => {
  const label = document.createElement("label");
  label.innerHTML = '<input type="checkbox"> هدف تعلم جديد قابل للتعديل.';
  objectivesList.appendChild(label);
  showToast("تمت إضافة هدف تعلم");
});

document.querySelector("[data-improve-content]").addEventListener("click", () => {
  lessonContent.innerHTML += "<p><strong>اقتراح AI:</strong> أضف مثالا بيانيا قصيرا قبل التمرين حتى يفهم التلميذ العلاقة بين المماس والمشتقة.</p>";
  lessonContent.dispatchEvent(new Event("input"));
  showToast("تم تحسين المحتوى");
});

document.querySelectorAll("[data-generator]").forEach((button) => {
  button.addEventListener("click", () => {
    const labels = {
      quiz: "Quiz",
      worksheet: "Worksheet",
      presentation: "Presentation"
    };
    const item = document.createElement("article");
    item.innerHTML = `<strong>${labels[button.dataset.generator]}</strong><p>تم إنشاء مورد تعليمي جديد اعتمادا على محتوى الدرس الحالي.</p><span>AI Generated</span>`;
    questionList.appendChild(item);
    showToast("تم توليد مورد جديد");
  });
});

document.querySelector("[data-generate-quiz]").addEventListener("click", () => {
  const item = document.createElement("article");
  item.innerHTML = "<strong>سؤال جديد</strong><p>فسر العلاقة بين ميل المماس وقيمة المشتقة في نقطة معينة.</p><span>سؤال مفتوح</span>";
  questionList.appendChild(item);
  showToast("تم توليد سؤال اختبار");
});

document.querySelector("[data-ai-run]").addEventListener("click", () => {
  const request = aiPrompt.value.trim() || "تحسين الدرس";
  aiOutput.innerHTML = `<strong>نتيجة AI: ${request}</strong><p>تم اقتراح مقدمة أبسط، مثالين متدرجين، وسؤال ختامي يقيس الفهم الحقيقي قبل الانتقال للدرس التالي.</p>`;
  showToast("تم تشغيل مساعد الدرس");
});

document.querySelector("[data-save]").addEventListener("click", () => {
  showToast("تم حفظ الدرس كمسودة");
});

document.querySelector("[data-open-publish]").addEventListener("click", () => {
  modalBackdrop.hidden = false;
  publishModal.hidden = false;
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

modalBackdrop.addEventListener("click", closeModal);

document.querySelector("[data-confirm-publish]").addEventListener("click", () => {
  closeModal();
  showToast("تم نشر الدرس بنجاح");
  window.setTimeout(() => {
    window.location.href = "/teacher/lessons/";
  }, 850);
});

function closeModal() {
  modalBackdrop.hidden = true;
  publishModal.hidden = true;
}
