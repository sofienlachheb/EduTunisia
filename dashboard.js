const shell = document.querySelector("[data-shell]");
const sidebar = document.querySelector("[data-sidebar]");
const collapseButton = document.querySelector("[data-collapse]");
const menuButton = document.querySelector("[data-menu]");
const backdrop = document.querySelector("[data-backdrop]");
const notificationButton = document.querySelector("[data-notifications]");
const notificationDrawer = document.querySelector("[data-notification-drawer]");
const closeNotifications = document.querySelector("[data-close-notifications]");
const tutorForm = document.querySelector("[data-tutor-form]");
const chatStream = document.querySelector("[data-chat-stream]");
const navLinks = document.querySelectorAll(".side-nav a");
const toast = document.querySelector("[data-toast]");
const quickActions = document.querySelectorAll("[data-filter], [data-certificate]");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function closeMobileMenu() {
  sidebar.classList.remove("open");
  backdrop.classList.remove("open");
}

collapseButton?.addEventListener("click", () => {
  shell.classList.toggle("collapsed");
});

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
  notificationDrawer.classList.toggle("open");
});

closeNotifications?.addEventListener("click", () => {
  notificationDrawer.classList.remove("open");
});

tutorForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = tutorForm.querySelector("input");
  const question = input.value.trim();

  if (!question) return;

  const userBubble = document.createElement("p");
  userBubble.className = "student-bubble";
  userBubble.textContent = question;
  chatStream.appendChild(userBubble);

  const aiBubble = document.createElement("p");
  aiBubble.className = "ai-bubble";
  aiBubble.textContent = "فهمت سؤالك. سأقسم الفكرة إلى خطوات قصيرة ثم أعطيك تمرينا مشابها للتأكد من الفهم.";
  chatStream.appendChild(aiBubble);

  input.value = "";
  chatStream.scrollTop = chatStream.scrollHeight;
  showToast("الأستاذ الذكي أضاف إجابة جديدة");
});

quickActions.forEach((button) => {
  button.addEventListener("click", () => {
    showToast(button.dataset.certificate !== undefined ? "تم تجهيز الشهادة" : "تم تحديث التحليلات");
  });
});

document.addEventListener("click", (event) => {
  if (!notificationDrawer?.classList.contains("open")) return;
  if (notificationDrawer.contains(event.target) || notificationButton?.contains(event.target)) return;
  notificationDrawer.classList.remove("open");
});
