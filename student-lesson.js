const toast = document.querySelector("[data-toast]");
const playButton = document.querySelector("[data-play]");
const videoPlayer = document.querySelector("[data-video-player]");
const timeline = document.querySelector("[data-timeline]");
const notes = document.querySelector("[data-notes]");
const savedNotes = document.querySelector("[data-saved-notes]");
const answerFeedback = document.querySelector("[data-answer-feedback]");
const aiChat = document.querySelector("[data-ai-chat]");
const navigatorPanel = document.querySelector("[data-mobile-drawer]");
const mobilePanelButton = document.querySelector("[data-mobile-panel]");
const backdrop = document.querySelector("[data-backdrop]");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function closeNavigator() {
  navigatorPanel.classList.remove("open");
  backdrop.classList.remove("open");
}

playButton?.addEventListener("click", () => {
  videoPlayer.classList.toggle("playing");
  const playing = videoPlayer.classList.contains("playing");
  playButton.textContent = playing ? "Ⅱ" : "▶";
  timeline.style.width = playing ? "58%" : "38%";
  showToast(playing ? "تم تشغيل الدرس" : "تم إيقاف الفيديو");
});

document.querySelectorAll("[data-skip]").forEach((button) => {
  button.addEventListener("click", () => {
    const current = parseInt(timeline.style.width, 10) || 38;
    const delta = Number(button.dataset.skip) > 0 ? 8 : -8;
    const next = Math.min(92, Math.max(8, current + delta));
    timeline.style.width = `${next}%`;
    showToast(delta > 0 ? "تم التقدم 10 ثوان" : "تم الرجوع 10 ثوان");
  });
});

document.querySelector("[data-speed]")?.addEventListener("click", (event) => {
  const speeds = ["1x", "1.25x", "1.5x", "2x"];
  const currentIndex = speeds.indexOf(event.currentTarget.textContent.trim());
  event.currentTarget.textContent = speeds[(currentIndex + 1) % speeds.length];
  showToast(`السرعة: ${event.currentTarget.textContent}`);
});

document.querySelector("[data-caption]")?.addEventListener("click", () => {
  showToast("تم تبديل الترجمة العربية");
});

document.querySelector("[data-fullscreen]")?.addEventListener("click", () => {
  showToast("وضع المشاهدة الواسعة جاهز");
});

document.querySelector("[data-save-note]")?.addEventListener("click", () => {
  const note = notes.value.trim();
  if (!note) return;

  const tag = document.createElement("span");
  tag.textContent = `الآن · ${note.slice(0, 28)}`;
  savedNotes.prepend(tag);
  showToast("تم حفظ الملاحظة");
});

document.querySelectorAll("[data-answer]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-answer]").forEach((item) => item.classList.remove("correct", "wrong"));
    const correct = button.dataset.answer === "correct";
    button.classList.add(correct ? "correct" : "wrong");
    answerFeedback.textContent = correct
      ? "إجابة صحيحة. f'(x)=2x وبالتالي f'(3)=6."
      : "ليست هذه الإجابة. تذكر أن مشتقة x² هي 2x.";
    answerFeedback.style.color = correct ? "#16a34a" : "#ef4444";
  });
});

document.querySelector("[data-comment-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  const text = input.value.trim();
  if (!text) return;

  const comment = document.createElement("article");
  const avatar = document.createElement("span");
  avatar.textContent = "أ";
  const body = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = "أحمد";
  const message = document.createElement("p");
  message.textContent = text;
  body.append(name, message);
  comment.append(avatar, body);
  document.querySelector("[data-discussion-list]").prepend(comment);
  input.value = "";
  showToast("تم نشر تعليقك");
});

document.querySelector("[data-ai-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.querySelector("input");
  const question = input.value.trim();
  if (!question) return;

  const user = document.createElement("p");
  user.className = "user-message";
  user.textContent = question;
  aiChat.appendChild(user);

  const answer = document.createElement("p");
  answer.className = "ai-message";
  answer.textContent = "خلينا نبسطها: المشتقة تقيس سرعة تغير الدالة عند نقطة، وبيانيا هي ميل المماس في تلك النقطة.";
  aiChat.appendChild(answer);

  input.value = "";
  aiChat.scrollTop = aiChat.scrollHeight;
  showToast("الأستاذ الذكي أضاف إجابة");
});

document.querySelector("[data-mark-complete]")?.addEventListener("click", () => {
  showToast("تم تمييز الدرس كمكتمل");
});

document.querySelector("[data-homework]")?.addEventListener("click", () => {
  showToast("تم فتح واجب الدرس");
});

document.querySelectorAll("[data-resource], [data-ai-action]").forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(item.dataset.resource !== undefined ? "تم تجهيز الملف للتحميل" : "تم إرسال الطلب إلى الأستاذ الذكي");
  });
});

mobilePanelButton?.addEventListener("click", () => {
  navigatorPanel.classList.add("open");
  backdrop.classList.add("open");
});

backdrop?.addEventListener("click", closeNavigator);

document.querySelectorAll(".lesson-nav a").forEach((link) => {
  link.addEventListener("click", closeNavigator);
});
