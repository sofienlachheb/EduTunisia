(function () {
  const routes = {
    "/": { file: "index.html", public: true },
    "/login": { file: "login.html", public: true },
    "/register": { file: "register.html", public: true },

    "/student/dashboard": { file: "dashboard.html", roles: ["student"] },
    "/student/subjects": { file: "dashboard.html#courses", roles: ["student"] },
    "/student/courses": { file: "dashboard.html#courses", roles: ["student"] },
    "/student/lessons": { file: "student-lesson.html", roles: ["student"] },
    "/student/lessons/lesson-1": { file: "student-lesson.html", roles: ["student"] },
    "/student/exercises": { file: "exercise-quiz.html", roles: ["student"] },
    "/student/exercises/exercise-1": { file: "exercise-quiz.html", roles: ["student"] },
    "/student/exams": { file: "secure-exam.html", roles: ["student"] },
    "/student/ai-tutor": { file: "ai-tutor.html", roles: ["student"] },
    "/student/certificates": { file: "dashboard.html#certificates", roles: ["student"] },
    "/student/settings": { file: "dashboard.html#overview", roles: ["student"] },

    "/parent/dashboard": { file: "parent-dashboard.html", roles: ["parent"] },

    "/teacher/dashboard": { file: "teacher-dashboard.html", roles: ["teacher"] },
    "/teacher/courses": { file: "courses-management.html", roles: ["teacher"] },
    "/teacher/courses/create": { file: "create-course.html", roles: ["teacher"] },
    "/teacher/courses/course-1/edit": { file: "create-course.html", roles: ["teacher"] },
    "/teacher/courses/course-1/lessons": { file: "lessons-management.html", roles: ["teacher"] },
    "/teacher/lessons": { file: "lessons-management.html", roles: ["teacher"] },
    "/teacher/lessons/create": { file: "create-lesson.html", roles: ["teacher"] },
    "/teacher/lessons/lesson-1/edit": { file: "create-lesson.html", roles: ["teacher"] },
    "/teacher/exercises": { file: "exercise-quiz.html", roles: ["teacher"] },
    "/teacher/exams": { file: "secure-exam.html", roles: ["teacher"] },
    "/teacher/question-bank": { file: "question-bank.html", roles: ["teacher"] },
    "/teacher/ai-content-studio": { file: "ai-content-studio.html", roles: ["teacher"] },
    "/teacher/analytics": { file: "analytics-dashboard.html", roles: ["teacher"] },

    "/courses/course-1": { file: "student-lesson.html", roles: ["student", "teacher"] },
    "/courses/course-1/preview": { file: "student-lesson.html", roles: ["teacher"] },

    "/admin/dashboard": { file: "admin-dashboard.html", roles: ["admin"] },
    "/admin/users": { file: "admin-dashboard.html", roles: ["admin"] },
    "/admin/schools": { file: "admin-dashboard.html", roles: ["admin"] },
    "/admin/billing": { file: "admin-dashboard.html", roles: ["admin"] },
    "/admin/analytics": { file: "analytics-dashboard.html", roles: ["admin"] },
    "/admin/ai": { file: "ai-content-studio.html", roles: ["admin"] },
    "/admin/security": { file: "secure-exam.html", roles: ["admin"] }
  };

  const roleHomes = {
    student: "/student/dashboard",
    teacher: "/teacher/dashboard",
    parent: "/parent/dashboard",
    admin: "/admin/dashboard"
  };

  function normalize(route) {
    if (!route) return "/";
    const url = new URL(route, window.location.origin);
    return url.pathname.replace(/\/$/, "") || "/";
  }

  function currentRole() {
    return localStorage.getItem("edutunisia.role") || "";
  }

  function setRole(role) {
    localStorage.setItem("edutunisia.role", role);
  }

  function canAccess(route) {
    if (!route || route.public) return true;
    return route.roles?.includes(currentRole());
  }

  function routeUrl(path) {
    return path === "/" ? "/index.html" : `${path}/`;
  }

  function go(target) {
    if (!target) return;
    if (target.startsWith("#") || target.startsWith("mailto:") || target.startsWith("http")) {
      window.location.href = target;
      return;
    }

    const [path, query = ""] = target.split("?");
    const normalized = normalize(path);
    const route = routes[normalized];

    if (!route) {
      window.location.href = target;
      return;
    }

    if (!canAccess(route)) {
      const redirect = encodeURIComponent(`${normalized}${query ? `?${query}` : ""}`);
      window.location.href = `/login/?redirect=${redirect}`;
      return;
    }

    window.location.href = `${routeUrl(normalized)}${query ? `?${query}` : ""}`;
  }

  function fileTarget(file) {
    const [pathname, hash = ""] = file.split("#");
    return `/${pathname}${window.location.search || ""}${hash ? `#${hash}` : ""}`;
  }

  function resolveAlias(path) {
    const normalized = normalize(path || window.location.pathname);
    const route = routes[normalized];
    if (!route) {
      window.location.replace("/index.html");
      return;
    }

    if (!canAccess(route)) {
      window.location.replace(`/login/?redirect=${encodeURIComponent(normalized)}`);
      return;
    }

    window.location.replace(fileTarget(route.file));
  }

  function protectCurrentPage() {
    const required = document.body?.dataset.protectedRole;
    if (!required) return;
    const allowed = required.split(",").map((role) => role.trim());
    if (allowed.includes(currentRole())) return;

    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login/?redirect=${redirect}`;
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-go], [data-route]");
    if (!trigger) return;

    event.preventDefault();
    go(trigger.dataset.go || trigger.dataset.route);
  });

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("[data-submit-go]");
    if (!form) return;

    event.preventDefault();
    go(form.dataset.submitGo);
  });

  window.EduTunisiaRouter = {
    routes,
    roleHomes,
    currentRole,
    setRole,
    go,
    resolveAlias,
    protectCurrentPage
  };

  protectCurrentPage();
})();
