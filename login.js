const passwordInput = document.querySelector("#password");
const passwordToggle = document.querySelector("[data-password-toggle]");
const loginForm = document.querySelector("[data-login-form]");
const roleInput = document.querySelector("[data-login-role]");
const socialButtons = document.querySelectorAll("[data-social-login]");
const toast = document.querySelector("[data-toast]");

const roleHomes = {
  student: "/student/dashboard/",
  teacher: "/teacher/dashboard/",
  parent: "/parent/dashboard/",
  admin: "/admin/dashboard/"
};

function loginAsSelectedRole() {
  const role = roleInput.value || "student";
  const redirect = new URLSearchParams(window.location.search).get("redirect");
  localStorage.setItem("edutunisia.role", role);
  localStorage.setItem("edutunisia.mockUser", JSON.stringify({
    name: "EduTunisia User",
    role
  }));
  toast.classList.add("show");
  window.setTimeout(() => {
    window.location.href = redirect || roleHomes[role] || roleHomes.student;
  }, 650);
}

passwordToggle.addEventListener("click", () => {
  const shouldShow = passwordInput.type === "password";

  passwordInput.type = shouldShow ? "text" : "password";
  passwordToggle.classList.toggle("is-visible", shouldShow);
  passwordToggle.setAttribute("aria-pressed", String(shouldShow));
  passwordToggle.setAttribute("aria-label", shouldShow ? "إخفاء كلمة المرور" : "إظهار كلمة المرور");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginAsSelectedRole();
});

socialButtons.forEach((button) => {
  button.addEventListener("click", loginAsSelectedRole);
});
