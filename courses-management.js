const grid = document.querySelector("[data-course-grid]");
const table = document.querySelector("[data-course-table]");
const searchInput = document.querySelector("[data-search]");
const statusFilter = document.querySelector("[data-filter='status']");
const levelFilter = document.querySelector("[data-filter='level']");
const viewButtons = document.querySelectorAll("[data-view]");
const quickMenu = document.querySelector("[data-quick-menu]");
const modalBackdrop = document.querySelector("[data-modal-backdrop]");
const publishModal = document.querySelector("[data-publish-modal]");
const deleteModal = document.querySelector("[data-delete-modal]");
const toast = document.querySelector("[data-toast]");

function allCourseItems() {
  return [...grid.querySelectorAll("[data-title]"), ...table.querySelectorAll("[data-title]")];
}

function matchesFilters(item) {
  const query = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  const level = levelFilter.value;
  const title = item.dataset.title.toLowerCase();

  return (!query || title.includes(query))
    && (status === "all" || item.dataset.status === status)
    && (level === "all" || item.dataset.level === level);
}

function applyFilters() {
  allCourseItems().forEach((item) => {
    item.hidden = !matchesFilters(item);
  });
}

function closeQuickMenu() {
  quickMenu.classList.remove("open");
}

function openModal(modal) {
  closeQuickMenu();
  modalBackdrop.hidden = false;
  modal.hidden = false;
}

function closeModals() {
  modalBackdrop.hidden = true;
  publishModal.hidden = true;
  deleteModal.hidden = true;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);
levelFilter.addEventListener("change", applyFilters);

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    viewButtons.forEach((item) => item.classList.toggle("active", item === button));
    const isGrid = button.dataset.view === "grid";
    grid.hidden = !isGrid;
    table.hidden = isGrid;
    closeQuickMenu();
  });
});

document.addEventListener("click", (event) => {
  const menuButton = event.target.closest("[data-menu-button]");
  if (!menuButton && !event.target.closest("[data-quick-menu]")) {
    closeQuickMenu();
  }

  if (!menuButton) return;

  const rect = menuButton.getBoundingClientRect();
  quickMenu.style.top = `${rect.bottom + 8}px`;
  quickMenu.style.left = `${Math.max(12, rect.left - 150)}px`;
  quickMenu.classList.toggle("open");
});

document.querySelectorAll("[data-open-publish]").forEach((button) => {
  button.addEventListener("click", () => openModal(publishModal));
});

document.querySelectorAll("[data-open-delete]").forEach((button) => {
  button.addEventListener("click", () => openModal(deleteModal));
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModals);
});

modalBackdrop.addEventListener("click", closeModals);

document.querySelector("[data-confirm-publish]").addEventListener("click", () => {
  closeModals();
  showToast("تم نشر الدورة وإرسال الإشعارات");
});

document.querySelector("[data-confirm-delete]").addEventListener("click", () => {
  closeModals();
  showToast("تم حذف الدورة من القائمة");
});

applyFilters();
