const form = document.querySelector("#registerForm");
const steps = Array.from(document.querySelectorAll(".form-step"));
const stepDots = Array.from(document.querySelectorAll("[data-step-dot]"));
const currentStepText = document.querySelector("[data-current-step]");
const stepTitle = document.querySelector("[data-step-title]");
const progressFill = document.querySelector("[data-progress-fill]");
const prevButton = document.querySelector("[data-prev]");
const nextButton = document.querySelector("[data-next]");
const actions = document.querySelector("[data-actions]");
const successScreen = document.querySelector("[data-success-screen]");
const roleCards = Array.from(document.querySelectorAll(".role-card"));
const roleInputs = Array.from(document.querySelectorAll("input[name='role']"));
const roleFieldGroups = Array.from(document.querySelectorAll("[data-role-fields]"));
const passwordInput = document.querySelector("[data-password]");
const confirmInput = document.querySelector("[data-confirm-password]");
const strengthLabel = document.querySelector("[data-strength-label]");
const strengthMeter = document.querySelector("[data-strength-meter] span");
const termsInput = document.querySelector("input[name='terms']");
const termsError = document.querySelector(".terms-error");

let activeStep = 1;

const titles = {
  1: "اختيار الدور",
  2: "المعلومات الشخصية",
  3: "إعداد الحساب",
  4: "تفاصيل حسب الدور"
};

const selectedRole = () => form.elements.role.value;

function updateStep() {
  steps.forEach((step) => step.classList.toggle("active", Number(step.dataset.step) === activeStep));
  stepDots.forEach((dot) => {
    const index = Number(dot.dataset.stepDot);
    dot.classList.toggle("active", index === activeStep);
    dot.classList.toggle("done", index < activeStep);
  });

  currentStepText.textContent = `الخطوة ${activeStep} من 4`;
  stepTitle.textContent = titles[activeStep];
  progressFill.style.width = `${activeStep * 25}%`;
  prevButton.disabled = activeStep === 1;
  nextButton.textContent = activeStep === 4 ? "إنشاء الحساب" : "التالي";
}

function updateRoleFields() {
  const role = selectedRole();
  roleCards.forEach((card) => {
    const input = card.querySelector("input");
    card.classList.toggle("selected", input.checked);
  });

  roleFieldGroups.forEach((group) => {
    const isActive = group.dataset.roleFields === role;
    group.classList.toggle("active", isActive);
    group.querySelectorAll("[data-role-required]").forEach((field) => {
      field.required = isActive;
      if (!isActive) {
        field.closest(".field").classList.remove("valid", "invalid");
      }
    });
  });
}

function validateField(input) {
  if (input === confirmInput) {
    input.setCustomValidity(input.value === passwordInput.value ? "" : "password-mismatch");
  }

  const field = input.closest(".field");
  if (!field) return input.checkValidity();

  const isValid = input.checkValidity();
  field.classList.toggle("valid", isValid && input.value.trim() !== "");
  field.classList.toggle("invalid", !isValid && input.value.trim() !== "");
  return isValid;
}

function currentInputs() {
  const step = steps.find((item) => Number(item.dataset.step) === activeStep);
  return Array.from(step.querySelectorAll("input, select, textarea")).filter((input) => {
    if (input.type === "radio") return false;
    if (input.closest(".role-fields") && !input.closest(".role-fields").classList.contains("active")) return false;
    return !input.disabled;
  });
}

function validateCurrentStep() {
  updateRoleFields();
  let isValid = true;

  currentInputs().forEach((input) => {
    if (!validateField(input)) {
      input.closest(".field")?.classList.add("invalid");
      isValid = false;
    }
  });

  if (activeStep === 3 && !termsInput.checked) {
    termsError.classList.add("visible");
    isValid = false;
  }

  return isValid;
}

function passwordScore(value) {
  const rules = {
    length: value.length >= 8,
    case: /[a-z]/.test(value) && /[A-Z]/.test(value),
    number: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value)
  };

  Object.entries(rules).forEach(([rule, pass]) => {
    document.querySelector(`[data-rule="${rule}"]`).classList.toggle("pass", pass);
  });

  return Object.values(rules).filter(Boolean).length;
}

function updatePasswordStrength() {
  const score = passwordScore(passwordInput.value);
  const labels = ["غير محددة", "ضعيفة", "متوسطة", "جيدة", "قوية"];
  const colors = ["#cbd5e1", "#ef4444", "#f59e0b", "#06b6d4", "#10b981"];

  strengthLabel.textContent = labels[score];
  strengthMeter.style.width = `${Math.max(score, 1) * 25}%`;
  strengthMeter.style.background = colors[score];
  if (confirmInput.value) validateField(confirmInput);
}

roleInputs.forEach((input) => input.addEventListener("change", updateRoleFields));

form.querySelectorAll("input, select, textarea").forEach((input) => {
  input.addEventListener("input", () => validateField(input));
  input.addEventListener("blur", () => validateField(input));
});

passwordInput.addEventListener("input", updatePasswordStrength);
termsInput.addEventListener("change", () => {
  termsError.classList.toggle("visible", !termsInput.checked);
});

prevButton.addEventListener("click", () => {
  if (activeStep > 1) {
    activeStep -= 1;
    updateStep();
  }
});

nextButton.addEventListener("click", () => {
  if (!validateCurrentStep()) return;

  if (activeStep < 4) {
    activeStep += 1;
    updateStep();
    return;
  }

  steps.forEach((step) => step.classList.remove("active"));
  document.querySelector(".progress-wrap").style.display = "none";
  successScreen.classList.add("active");
  actions.style.display = "none";
});

updateRoleFields();
updatePasswordStrength();
updateStep();
