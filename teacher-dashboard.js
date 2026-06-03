const shell = document.querySelector("[data-shell]");
const sidebar = document.querySelector("[data-sidebar]");
const collapseButton = document.querySelector("[data-collapse]");
const menuButton = document.querySelector("[data-menu]");
const backdrop = document.querySelector("[data-backdrop]");
const navLinks = document.querySelectorAll(".side-nav a");
const notificationButton = document.querySelector("[data-notifications]");
const notificationPanel = document.querySelector("[data-notification-panel]");
const closeNotifications = document.querySelector("[data-close-notifications]");
const studioPrompt = document.querySelector("#studioPrompt");
const studioOutput = document.querySelector("[data-studio-output]");
const generateButton = document.querySelector("[data-generate]");
const studioChips = document.querySelectorAll("[data-studio-chip]");

collapseButton?.addEventListener("click", () => {
  shell.classList.toggle("collapsed");
});

function closeMobileMenu() {
  sidebar.classList.remove("open");
  backdrop.classList.remove("open");
}

menuButton?.addEventListener("click", () => {
  sidebar.classList.add("open");
  backdrop.classList.add("open");
});

backdrop?.addEventListener("click", closeMobileMenu);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    closeMobileMenu();
  });
});

notificationButton?.addEventListener("click", () => {
  notificationPanel.classList.toggle("open");
});

closeNotifications?.addEventListener("click", () => {
  notificationPanel.classList.remove("open");
});

studioChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    studioPrompt.value = chip.textContent.trim();
    studioPrompt.focus();
  });
});

generateButton?.addEventListener("click", () => {
  const request = studioPrompt.value.trim() || "درس تفاعلي";
  studioOutput.innerHTML = `
    <strong>مسودة جاهزة: ${request}</strong>
    <p>تم اقتراح هدف تعلم، مخطط درس من 4 فقرات، 6 أسئلة متدرجة، ومعايير تقييم يمكن نشرها بعد المراجعة.</p>
  `;
});
