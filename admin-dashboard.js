const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const toast = document.getElementById("toast");
const periodButtons = document.querySelectorAll("[data-period]");
const commandButtons = document.querySelectorAll("[data-command], [data-action]");

const periodMessages = {
  today: "تم تحديث مؤشرات اليوم",
  month: "تم تحميل بيانات الشهر",
  year: "تم تحديث لوحة السنة المالية"
};

function notify(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

menuButton?.addEventListener("click", () => {
  sidebar.classList.toggle("open");
});

periodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    periodButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    notify(periodMessages[button.dataset.period] || "تم تحديث البيانات");
  });
});

commandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const text = button.textContent.trim();
    notify(`تم إرسال الأمر: ${text}`);
  });
});

document.getElementById("runCommand")?.addEventListener("click", () => {
  notify("تم فتح مركز الأوامر التنفيذي");
});

document.addEventListener("click", (event) => {
  if (!sidebar?.classList.contains("open")) return;
  if (sidebar.contains(event.target) || menuButton?.contains(event.target)) return;
  sidebar.classList.remove("open");
});
