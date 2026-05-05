// Notifications
function showNotification(message, type = "success"){
  let container = document.querySelector(".notification-container");

  if(!container){
    container = document.createElement("div");
    container.className = "notification-container";
    document.body.appendChild(container);
  }

  const note = document.createElement("div");
  note.className = `notification ${type === "info" ? "info" : ""}`;
  note.textContent = message;

  container.appendChild(note);

  setTimeout(() => {
    note.style.opacity = "0";
    note.style.transform = "translateX(20px)";
    note.style.transition = ".25s ease";

    setTimeout(() => note.remove(), 250);
  }, 2500);
}

function notifyThenGo(message, url, type = "success") {
  showNotification(message, type);
  setTimeout(() => {
    window.location.href = url;
  }, 650);
}

const internships = [
  {title:"Customer Success Intern", company:"Estarta Solutions", initials:"ES", city:"Irbid", work:"Hybrid", duration:"3 months", major:"Business Administration", desc:"Work side by side with technical account managers to support Cisco enterprise customers. Great fit for students with strong English communication.", url:"internships/internship-customer-success.html"},
  {title:"Cloud Infrastructure Intern", company:"Estarta Solutions", initials:"ES", city:"Amman", work:"Onsite", duration:"6 months", major:"Information Technology", desc:"Hands-on with AWS, Cisco Meraki, and observability tooling supporting enterprise customers across the region.", url:"internships/internship-cloud-infrastructure.html"},
  {title:"Mobile Engineering Intern", company:"Maktoob Studio", initials:"MS", city:"Amman", work:"Remote", duration:"3 months", major:"Software Engineering", desc:"Ship features in our React Native apps used across the region. Pair with senior engineers and own real product tasks.", url:"internships/internship-mobile-engineering.html"},
  {title:"Product Design Intern", company:"Maktoob Studio", initials:"MS", city:"Amman", work:"Remote", duration:"4 months", major:"Graphic Design", desc:"Design beautiful interfaces for our consumer apps. Strong Figma skills, attention to typography, and curiosity required.", url:"internships/internship-product-design.html"},
  {title:"Marketing Intern", company:"Arab Bank", initials:"AB", city:"Amman", work:"Hybrid", duration:"3 months", major:"Marketing", desc:"Support brand and digital marketing campaigns across the bank's retail products. You will help with copywriting and reporting.", url:"internships/internship-marketing.html"},
  {title:"Finance Intern", company:"Arab Bank", initials:"AB", city:"Amman", work:"Onsite", duration:"3 months", major:"Finance", desc:"Rotate through corporate finance, treasury, and risk teams at Arab Bank headquarters. Strong analytical thinking preferred.", url:"internships/internship-finance.html"}
];

const allInternships = [
  ...internships,
  {title:"Data Analysis Intern", company:"Orange Jordan", initials:"OJ", city:"Amman", work:"Hybrid", duration:"4 months", major:"Information Technology", desc:"Analyze customer and network data, build dashboards, and support reporting for internal teams.", url:"internships/internship-data-analysis.html"},
  {title:"Backend Developer Intern", company:"Mawdoo3", initials:"MD", city:"Amman", work:"Onsite", duration:"3 months", major:"Software Engineering", desc:"Work with APIs, databases, and backend services used by content and product teams.", url:"internships/internship-backend-developer.html"},
  {title:"HR Intern", company:"Zain Jordan", initials:"ZJ", city:"Amman", work:"Onsite", duration:"2 months", major:"Business Administration", desc:"Support recruitment, onboarding, employee records, and training coordination.", url:"internships/internship-hr.html"},
  {title:"UI Designer Intern", company:"Aspire", initials:"AS", city:"Amman", work:"Remote", duration:"3 months", major:"Graphic Design", desc:"Create clean web and mobile layouts, improve design systems, and prepare handoff files.", url:"internships/internship-ui-designer.html"},
  {title:"Accounting Intern", company:"Housing Bank", initials:"HB", city:"Amman", work:"Onsite", duration:"3 months", major:"Finance", desc:"Assist finance teams with reconciliation, reports, and daily accounting operations.", url:"internships/internship-accounting.html"},
  {title:"Social Media Intern", company:"Jeeny", initials:"JY", city:"Irbid", work:"Hybrid", duration:"2 months", major:"Marketing", desc:"Help plan content, write captions, follow campaign performance, and support brand growth.", url:"internships/internship-social-media.html"}
];

// Theme
const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("tadreeb_theme", theme);
  if (themeIcon) themeIcon.textContent = theme === "dark" ? "☀" : "☾";
}
setTheme(localStorage.getItem("tadreeb_theme") || "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });
}



// Keep student logged in across public pages
function applyLoggedInNavbar() {
  const role = localStorage.getItem("tadreeb_user_role");
  const initials = localStorage.getItem("tadreeb_user_initials") || "LH";
  const userName = localStorage.getItem("tadreeb_user_name") || "Laith Haddad";
  const navLinks = document.getElementById("navLinks");
  const navActions = document.querySelector(".nav-actions");

  if (role !== "student" || !navLinks || !navActions) return;

  const isInsideFolder = location.pathname.includes("/internships/") || location.pathname.includes("/companies/") || location.pathname.includes("/dashboards/");
  const prefix = isInsideFolder ? "../" : "";

  navLinks.innerHTML = `
    <a href="${prefix}dashboards/student-dashboard.html">Dashboard</a>
    <a href="${prefix}internships.html">Find Internships</a>
    <a href="${prefix}companies.html">Companies</a>
    <a href="${prefix}dashboards/student-applications.html">My Applications</a>
    <a href="${prefix}dashboards/student-saved.html">Saved</a>
  `;

  const themeBtn = navActions.querySelector("#themeToggle");
  const menuBtn = navActions.querySelector("#menuBtn");

  navActions.innerHTML = "";
  if (themeBtn) navActions.appendChild(themeBtn);

  const profileWrap = document.createElement("div");
  profileWrap.className = "profile-wrap";

  const avatar = document.createElement("button");
  avatar.className = "user-avatar";
  avatar.textContent = initials;
  avatar.title = "Student account";

  const menu = document.createElement("div");
  menu.className = "profile-menu";
  menu.innerHTML = `
    <strong>${userName}</strong>
    <span>STUDENT</span>
    <hr>
    <a href="${prefix}dashboards/student-profile.html">♡ Profile</a>
    <button type="button" id="logoutBtn">↪ Sign out</button>
  `;

  profileWrap.appendChild(avatar);
  profileWrap.appendChild(menu);
  navActions.appendChild(profileWrap);

  avatar.addEventListener("click", (e) => {
    e.stopPropagation();
    profileWrap.classList.toggle("open");
  });

  menu.querySelector("#logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("tadreeb_user_role");
    localStorage.removeItem("tadreeb_user_initials");
    localStorage.removeItem("tadreeb_user_name");
    notifyThenGo("Signed out", `${prefix}index.html`, "info");
  });

  document.addEventListener("click", () => {
    profileWrap.classList.remove("open");
  });

  if (menuBtn) navActions.appendChild(menuBtn);
}
applyLoggedInNavbar();


// Storage helpers shared by dashboards
function getStoredList(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function setStoredList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}


// Modals
document.querySelectorAll("[data-open]").forEach(btn => {
  btn.addEventListener("click", () => {
    const modal = document.getElementById(btn.dataset.open);
    if (modal) modal.showModal();
  });
});

// Mobile menu
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}
