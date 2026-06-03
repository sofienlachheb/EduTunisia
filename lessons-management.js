const lessonBoard = document.querySelector("[data-lesson-board]");
const lessons = () => [...document.querySelectorAll(".lesson-card")];
const treeButtons = document.querySelectorAll("[data-module-filter]");
const searchInput = document.querySelector("[data-search]");
const typeFilter = document.querySelector("[data-filter='type']");
const statusFilter = document.querySelector("[data-filter='status']");
const bulkBar = document.querySelector("[data-bulk-bar]");
const selectedCount = document.querySelector("[data-selected-count]");
const detailTitle = document.querySelector("[data-detail-title]");
const detailStatus = document.querySelector("[data-detail-status]");
const detailType = document.querySelector("[data-detail-type]");
const aiOutput = document.querySelector("[data-ai-output]");
const toast = document.querySelector("[data-toast]");
const modalBackdrop = document.querySelector("[data-modal-backdrop]");
const deleteModal = document.querySelector("[data-delete-modal]");

let activeModule = "all";

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 1700);
}

function openDeleteModal() {
  modalBackdrop.hidden = false;
  deleteModal.hidden = false;
}

function closeDeleteModal() {
  modalBackdrop.hidden = true;
  deleteModal.hidden = true;
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  lessons().forEach((lesson) => {
    const matchesModule = activeModule === "all" || lesson.dataset.module === activeModule;
    const matchesType = typeFilter.value === "all" || lesson.dataset.type === typeFilter.value;
    const matchesStatus = statusFilter.value === "all" || lesson.dataset.status === statusFilter.value;
    const matchesQuery = !query || lesson.dataset.title.toLowerCase().includes(query);
    lesson.hidden = !(matchesModule && matchesType && matchesStatus && matchesQuery);
  });
}

function updateBulkBar() {
  const count = document.querySelectorAll("[data-select-lesson]:checked").length;
  selectedCount.textContent = count;
  bulkBar.classList.toggle("active", count > 0);
}

function openDetails(lesson) {
  lessons().forEach((item) => item.classList.toggle("selected", item === lesson));
  detailTitle.textContent = lesson.dataset.title;
  detailStatus.textContent = lesson.querySelector(".status").textContent;
  detailStatus.className = lesson.querySelector(".status").className;
  const typeMap = {
    video: "فيديو · محتوى مرئي",
    text: "درس نصي · قراءة",
    quiz: "اختبار · تقييم",
    assignment: "واجب · تطبيق"
  };
  detailType.textContent = typeMap[lesson.dataset.type] || "درس";
}

treeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    treeButtons.forEach((item) => item.classList.toggle("active", item === button));
    activeModule = button.dataset.moduleFilter;
    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);
statusFilter.addEventListener("change", applyFilters);

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-select-lesson]")) updateBulkBar();
});

document.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-open-details]");
  if (detailButton) openDetails(detailButton.closest(".lesson-card"));

  if (event.target.closest("[data-open-delete]")) {
    openDeleteModal();
    return;
  }

  const aiButton = event.target.closest("[data-ai-action]");
  if (!aiButton) return;

  const messages = {
    outline: "تم اقتراح درس جديد حول تطبيقات الاشتقاق مع أهداف تعلم وتمارين افتتاحية.",
    quiz: "تم توليد اختبار قصير من 6 أسئلة متدرجة مع إجابات نموذجية.",
    summary: "تم إعداد ملخص مبسط بنقاط رئيسية وأسئلة مراجعة في نهاية الدرس."
  };
  aiOutput.textContent = messages[aiButton.dataset.aiAction];
  showToast("تم إنشاء اقتراح AI");
});

document.querySelectorAll("[data-close-delete]").forEach((button) => {
  button.addEventListener("click", closeDeleteModal);
});

modalBackdrop.addEventListener("click", closeDeleteModal);

document.querySelector("[data-confirm-delete]").addEventListener("click", () => {
  closeDeleteModal();
  showToast("تم حذف الدرس ونقله إلى الأرشيف");
});

document.querySelector("[data-add-module]").addEventListener("click", () => {
  const module = document.createElement("button");
  module.className = "tree-item";
  module.type = "button";
  module.dataset.moduleFilter = "new";
  module.innerHTML = "<span>+</span><strong>وحدة جديدة</strong><small>0</small>";
  document.querySelector("[data-tree-list]").appendChild(module);
  showToast("تمت إضافة وحدة جديدة");
});

lessons().forEach((lesson) => {
  lesson.addEventListener("dragstart", () => lesson.classList.add("dragging"));
  lesson.addEventListener("dragend", () => {
    lesson.classList.remove("dragging");
    showToast("تم تحديث ترتيب الدروس");
  });
});

lessonBoard.addEventListener("dragover", (event) => {
  event.preventDefault();
  const dragging = document.querySelector(".lesson-card.dragging");
  if (!dragging) return;

  const visibleLessons = lessons().filter((lesson) => !lesson.classList.contains("dragging") && !lesson.hidden);
  const next = visibleLessons.find((lesson) => event.clientY < lesson.getBoundingClientRect().top + lesson.offsetHeight / 2);
  lessonBoard.insertBefore(dragging, next || null);
});

applyFilters();
updateBulkBar();
