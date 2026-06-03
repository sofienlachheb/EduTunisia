const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const toast = document.getElementById("toast");
const periodButtons = document.querySelectorAll("[data-period]");
const exportButtons = document.querySelectorAll("[data-export], #exportReport");
const insightButtons = document.querySelectorAll("[data-action='insight']");
const refreshButtons = document.querySelectorAll("[data-refresh]");

const messages = {
  week: "تم تحديث التحليلات لآخر 7 أيام",
  month: "تم تحديث التحليلات لهذا الشهر",
  quarter: "تم تحديث التحليلات لآخر ربع سنة"
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

sidebarToggle?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

periodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    periodButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    showToast(messages[button.dataset.period] || "تم تحديث التحليلات");
  });
});

exportButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.dataset.export;
    const label = type ? button.textContent.trim() : "التقرير التنفيذي";
    showToast(`جاري تجهيز ${label}`);
  });
});

insightButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showToast("تم إرسال التوصية إلى مساحة العمل");
  });
});

refreshButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.textContent = "جاري التحديث...";
    setTimeout(() => {
      button.textContent = "تحديث";
      showToast("تم تحديث الرسم البياني");
    }, 700);
  });
});

document.addEventListener("click", (event) => {
  if (!sidebar?.classList.contains("open")) return;
  if (sidebar.contains(event.target) || sidebarToggle?.contains(event.target)) return;
  sidebar.classList.remove("open");
});
