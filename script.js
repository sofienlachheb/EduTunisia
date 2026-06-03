const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const billingButtons = document.querySelectorAll("[data-billing]");
const priceValues = document.querySelectorAll(".price span[data-monthly]");
const demoModal = document.querySelector("[data-demo-modal]");
const demoOpenButtons = document.querySelectorAll("[data-demo-open]");
const demoClose = document.querySelector("[data-demo-close]");
const demoRoleLinks = document.querySelectorAll("[data-demo-role]");

const syncHeader = () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

billingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mode = button.dataset.billing;

    billingButtons.forEach((item) => item.classList.toggle("active", item === button));
    priceValues.forEach((price) => {
      price.textContent = price.dataset[mode];
    });
  });
});

demoOpenButtons.forEach((button) => {
  button.addEventListener("click", () => {
    demoModal.hidden = false;
  });
});

demoClose?.addEventListener("click", () => {
  demoModal.hidden = true;
});

demoModal?.addEventListener("click", (event) => {
  if (event.target === demoModal) demoModal.hidden = true;
});

demoRoleLinks.forEach((link) => {
  link.addEventListener("click", () => {
    localStorage.setItem("edutunisia.role", link.dataset.demoRole);
  });
});
