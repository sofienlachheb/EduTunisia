const params = new URLSearchParams(window.location.search);
const lessonId = params.get("lessonId");
const contextTitle = document.querySelector("[data-context-title]");
const contextCopy = document.querySelector("[data-context-copy]");
const chatStream = document.querySelector("[data-chat-stream]");
const chatForm = document.querySelector("[data-chat-form]");
const toast = document.querySelector("[data-toast]");

if (lessonId) {
  contextTitle.textContent = "مفهوم المشتقة";
  contextCopy.textContent = `المساعد يعمل الآن في سياق الدرس: ${lessonId}. ستظهر الإجابات مرتبطة بمحتوى الدرس الحالي.`;
  chatStream.firstElementChild.textContent = "أنا أعمل الآن في سياق درس المشتقة. اسألني عن التعريف، المماس، أو حل تمرين من الدرس.";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = chatForm.querySelector("input");
  const question = input.value.trim();
  if (!question) return;

  const user = document.createElement("p");
  user.className = "user-message";
  user.textContent = question;
  chatStream.appendChild(user);

  const answer = document.createElement("p");
  answer.className = "ai-message";
  answer.textContent = lessonId
    ? "بالاعتماد على الدرس الحالي: المشتقة تمثل ميل المماس، ويمكننا حل السؤال بخطوتين ثم تجربة تمرين مشابه."
    : "سأبسط الفكرة وأقترح تمرينا قصيرا للتأكد من الفهم.";
  chatStream.appendChild(answer);

  input.value = "";
  chatStream.scrollTop = chatStream.scrollHeight;
  showToast("تم إرسال السؤال");
});
