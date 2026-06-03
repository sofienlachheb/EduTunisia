const tabButtons = document.querySelectorAll("[data-tab]");
const panels = document.querySelectorAll("[data-panel]");
const titleInput = document.querySelector("[data-title-input]");
const description = document.querySelector("[data-description]");
const previewTitle = document.querySelector("[data-preview-title]");
const previewDescription = document.querySelector("[data-preview-description]");
const uploadInput = document.querySelector(".upload-box input");
const previewImages = document.querySelectorAll(".thumbnail-preview img, .preview-card img");
const modalBackdrop = document.querySelector("[data-modal-backdrop]");
const publishModal = document.querySelector("[data-publish-modal]");
const toast = document.querySelector("[data-toast]");
const builderBoard = document.querySelector("[data-builder-board]");
const aiInput = document.querySelector("[data-ai-input]");

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
  previewTitle.textContent = titleInput.value || "عنوان الدورة";
});

description.addEventListener("input", () => {
  previewDescription.textContent = description.textContent.trim() || "وصف الدورة سيظهر هنا.";
});

uploadInput.addEventListener("change", () => {
  const file = uploadInput.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  previewImages.forEach((image) => {
    image.src = url;
  });
  showToast("تم تحديث صورة الدورة");
});

document.querySelector("[data-save-draft]").addEventListener("click", () => {
  showToast("تم حفظ الدورة كمسودة");
});

document.querySelectorAll("[data-open-publish]").forEach((button) => {
  button.addEventListener("click", () => {
    modalBackdrop.hidden = false;
    publishModal.hidden = false;
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

modalBackdrop.addEventListener("click", closeModal);

document.querySelector("[data-confirm-publish]").addEventListener("click", () => {
  closeModal();
  showToast("تم نشر الدورة بنجاح");
  window.setTimeout(() => {
    window.location.href = "/teacher/courses/";
  }, 850);
});

function closeModal() {
  modalBackdrop.hidden = true;
  publishModal.hidden = true;
}

document.querySelector("[data-ai-generate]").addEventListener("click", () => {
  const topic = aiInput.value.trim() || "خطة دورة جديدة";
  const module = document.createElement("article");
  module.className = "module-card";
  module.draggable = true;
  module.innerHTML = `
    <div class="module-head">
      <span>AI</span>
      <strong>${topic}</strong>
      <button type="button">⋯</button>
    </div>
    <div class="lesson-list">
      <div class="lesson-item" draggable="true"><span>☰</span> مقدمة مركزة <small>فيديو · 8د</small></div>
      <div class="lesson-item" draggable="true"><span>☰</span> تمارين متدرجة <small>12 سؤال</small></div>
      <div class="lesson-item" draggable="true"><span>☰</span> تقييم ختامي <small>اختبار</small></div>
    </div>
  `;
  builderBoard.prepend(module);
  wireDrag(module);
  showToast("تم توليد وحدة جديدة عبر AI");
});

document.querySelector("[data-add-module]").addEventListener("click", () => {
  const module = document.createElement("article");
  module.className = "module-card";
  module.draggable = true;
  module.innerHTML = `
    <div class="module-head">
      <span>جديد</span>
      <strong>وحدة بدون عنوان</strong>
      <button type="button">⋯</button>
    </div>
    <div class="lesson-list">
      <div class="lesson-item" draggable="true"><span>☰</span> درس جديد <small>فارغ</small></div>
    </div>
  `;
  builderBoard.appendChild(module);
  wireDrag(module);
});

function wireDrag(scope = document) {
  scope.querySelectorAll("[draggable='true']").forEach((item) => {
    item.addEventListener("dragstart", () => item.classList.add("dragging"));
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
  });
}

builderBoard.addEventListener("dragover", (event) => {
  event.preventDefault();
  const dragging = document.querySelector(".module-card.dragging");
  if (!dragging) return;

  const modules = [...builderBoard.querySelectorAll(".module-card:not(.dragging)")];
  const next = modules.find((module) => event.clientY < module.getBoundingClientRect().top + module.offsetHeight / 2);
  builderBoard.insertBefore(dragging, next || null);
});

document.addEventListener("dragover", (event) => {
  const lessonList = event.target.closest(".lesson-list");
  const draggingLesson = document.querySelector(".lesson-item.dragging");
  if (!lessonList || !draggingLesson) return;

  event.preventDefault();
  const lessons = [...lessonList.querySelectorAll(".lesson-item:not(.dragging)")];
  const next = lessons.find((lesson) => event.clientY < lesson.getBoundingClientRect().top + lesson.offsetHeight / 2);
  lessonList.insertBefore(draggingLesson, next || null);
});

wireDrag();
