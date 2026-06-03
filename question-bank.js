const searchInput = document.querySelector("[data-search]");
const filters = document.querySelectorAll("[data-filter]");
const questionCards = [...document.querySelectorAll(".question-card")];
const bulkBar = document.querySelector("[data-bulk-bar]");
const selectedCount = document.querySelector("[data-selected-count]");
const previewTitle = document.querySelector("[data-preview-title]");
const previewMeta = document.querySelector("[data-preview-meta]");
const editorTitle = document.querySelector("[data-editor-title]");
const modalBackdrop = document.querySelector("[data-modal-backdrop]");
const aiModal = document.querySelector("[data-ai-modal]");
const importModal = document.querySelector("[data-import-modal]");
const aiOutput = document.querySelector("[data-ai-output]");
const aiPrompt = document.querySelector("[data-ai-prompt]");
const toast = document.querySelector("[data-toast]");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1700);
}

function applyFilters() {
  const query = searchInput.value.trim().toLowerCase();
  questionCards.forEach((card) => {
    const matchesQuery = !query || card.dataset.title.toLowerCase().includes(query);
    const matchesFilters = [...filters].every((filter) => filter.value === "all" || card.dataset[filter.dataset.filter] === filter.value);
    card.hidden = !(matchesQuery && matchesFilters);
  });
}

function updateBulkBar() {
  const count = document.querySelectorAll("[data-select-question]:checked").length;
  selectedCount.textContent = count;
  bulkBar.classList.toggle("active", count > 0);
}

function openModal(modal) {
  modalBackdrop.hidden = false;
  modal.hidden = false;
}

function closeModals() {
  modalBackdrop.hidden = true;
  aiModal.hidden = true;
  importModal.hidden = true;
}

searchInput.addEventListener("input", applyFilters);
filters.forEach((filter) => filter.addEventListener("change", applyFilters));

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-select-question]")) updateBulkBar();
});

document.addEventListener("click", (event) => {
  const previewButton = event.target.closest("[data-preview]");
  if (!previewButton) return;

  const card = previewButton.closest(".question-card");
  questionCards.forEach((item) => item.classList.toggle("selected", item === card));
  previewTitle.textContent = card.querySelector("h2").textContent;
  previewMeta.textContent = card.querySelector(".meta span:first-child").textContent;
  editorTitle.value = card.querySelector("h2").textContent;
});

document.querySelector("[data-save-editor]").addEventListener("click", () => {
  previewTitle.textContent = editorTitle.value;
  showToast("تم حفظ السؤال");
});

document.querySelector("[data-open-ai]").addEventListener("click", () => openModal(aiModal));
document.querySelector("[data-open-import]").addEventListener("click", () => openModal(importModal));
document.querySelectorAll("[data-close-modal]").forEach((button) => button.addEventListener("click", closeModals));
modalBackdrop.addEventListener("click", closeModals);

document.querySelectorAll("[data-generate]").forEach((button) => {
  button.addEventListener("click", () => {
    const prompt = aiPrompt.value.trim() || "أسئلة حول الاشتقاق";
    aiOutput.textContent = `تم اقتراح 5 أسئلة متدرجة حول: ${prompt}. راجعها ثم أضفها للبنك.`;
    closeModals();
    showToast("تم توليد أسئلة AI");
  });
});

applyFilters();
updateBulkBar();
