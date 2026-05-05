// Admin dashboard
function applyAdminNavbar() {
  if (localStorage.getItem("tadreeb_user_role") !== "admin") return;
  const navActions = document.querySelector(".nav-actions");
  if (!navActions) return;

  const themeBtn = navActions.querySelector("#themeToggle");
  const menuBtn = navActions.querySelector("#menuBtn");

  navActions.innerHTML = "";
  if (themeBtn) navActions.appendChild(themeBtn);

  const wrap = document.createElement("div");
  wrap.className = "profile-wrap";
  wrap.innerHTML = `
    <button class="user-avatar">PA</button>
    <div class="profile-menu">
      <strong>Platform Admin</strong>
      <span>ADMIN</span>
      <hr>
      <button type="button" id="adminLogoutBtn">↪ Sign out</button>
    </div>
  `;

  navActions.appendChild(wrap);

  wrap.querySelector(".user-avatar").addEventListener("click", e => {
    e.stopPropagation();
    wrap.classList.toggle("open");
  });

  wrap.querySelector("#adminLogoutBtn").addEventListener("click", () => {
    localStorage.removeItem("tadreeb_user_role");
    localStorage.removeItem("tadreeb_user_initials");
    localStorage.removeItem("tadreeb_user_name");
    notifyThenGo("Signed out", "../index.html", "info");
  });

  document.addEventListener("click", () => wrap.classList.remove("open"));
  if (menuBtn) navActions.appendChild(menuBtn);
}
applyAdminNavbar();

function adminDefaultCompanies() {
  let companies = getStoredList("tadreeb_admin_companies");
  if (companies.length) return companies;

  companies = [
    {id:"zain", name:"Zain Jordan", initials:"ZJ", industry:"Telecommunications", city:"Amman", status:"Pending", desc:"Zain Jordan is a leading mobile telecommunications company providing innovative digital and 5G services across the Kingdom.", website:"https://www.jo.zain.com"},
    {id:"aramex", name:"Aramex", initials:"A", industry:"Logistics", city:"Amman", status:"Approved", desc:"Aramex is a leading global logistics and transportation provider founded in Amman in 1982, serving customers across the Middle East and beyond.", website:"https://www.aramex.com"},
    {id:"arab", name:"Arab Bank", initials:"AB", industry:"Banking", city:"Amman", status:"Approved", desc:"Arab Bank is one of the largest financial institutions in the Middle East, headquartered in Amman with a global presence.", website:"https://www.arabbank.com"},
    {id:"maktoob", name:"Maktoob Studio", initials:"MS", industry:"Technology", city:"Amman", status:"Approved", desc:"Maktoob is an Amman-based product studio building consumer apps and design tooling for the Arabic-speaking world.", website:"https://maktoob.io"},
    {id:"estarta", name:"Estarta Solutions", initials:"ES", industry:"Technology", city:"Amman", status:"Approved", desc:"Estarta is a Cisco-recognized managed services partner delivering networking, cybersecurity, and customer experience solutions from its Amman hub.", website:"https://www.estarta.com"},
    {id:"orange", name:"Orange Jordan", initials:"OJ", industry:"Telecommunications", city:"Amman", status:"Rejected", desc:"Orange Jordan is one of the largest telecommunications providers in Jordan, offering mobile, internet, and digital services nationwide.", website:"https://www.orange.jo"},
    {id:"nayasoft", name:"NayaSoft", initials:"N", industry:"Technology", city:"Amman", status:"Rejected", desc:"An early-stage Amman startup building accounting software for small Jordanian retailers.", website:"https://nayasoft.jo"}
  ];

  setStoredList("tadreeb_admin_companies", companies);
  return companies;
}

function adminSaveCompanies(companies) {
  setStoredList("tadreeb_admin_companies", companies);
}

function adminUpdateCompanyCounts() {
  const companies = adminDefaultCompanies();
  const pending = companies.filter(c => c.status === "Pending").length;
  const approved = companies.filter(c => c.status === "Approved").length;
  const rejected = companies.filter(c => c.status === "Rejected").length;

  const p = document.getElementById("pendingTabCount");
  const a = document.getElementById("approvedTabCount");
  const r = document.getElementById("rejectedTabCount");

  if (p) p.textContent = pending;
  if (a) a.textContent = approved;
  if (r) r.textContent = rejected;

  const approvedCount = document.getElementById("adminApprovedCount");
  const pendingSmall = document.getElementById("adminPendingSmall");
  if (approvedCount) approvedCount.textContent = approved;
  if (pendingSmall) pendingSmall.textContent = `${pending} pending`;
}

function renderAdminCompanies(tab = "pending") {
  const list = document.getElementById("adminCompanyList");
  if (!list) return;

  const companies = adminDefaultCompanies();
  const selected = companies.filter(c => c.status.toLowerCase() === tab);

  list.innerHTML = selected.map(company => {
    const isPending = company.status === "Pending";
    const isApproved = company.status === "Approved";
    const isRejected = company.status === "Rejected";

    return `
      <article class="admin-company-card">
        <div class="company-avatar">${company.initials}</div>
        <div>
          <h2>${company.name}</h2>
          <p>${company.industry} · ${company.city}</p>
          <p>${company.desc}</p>
          <a href="${company.website}" target="_blank">${company.website}</a>
        </div>
        <div class="admin-actions">
          ${!isApproved ? `<button class="approve-btn" data-id="${company.id}">✓ Approve</button>` : ""}
          ${!isRejected ? `<button class="reject-btn" data-id="${company.id}">× Reject</button>` : ""}
          ${!isPending ? `<button class="reset-btn" data-id="${company.id}">Reset</button>` : ""}
        </div>
      </article>
    `;
  }).join("") || `<div class="empty-list">No companies here.</div>`;

  list.querySelectorAll(".approve-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      adminSaveCompanies(adminDefaultCompanies().map(c => c.id === btn.dataset.id ? {...c, status:"Approved"} : c));
      showNotification("Company approved!");
      adminUpdateCompanyCounts();
      renderAdminCompanies(tab);
    });
  });

  list.querySelectorAll(".reject-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      adminSaveCompanies(adminDefaultCompanies().map(c => c.id === btn.dataset.id ? {...c, status:"Rejected"} : c));
      showNotification("Company rejected!", "info");
      adminUpdateCompanyCounts();
      renderAdminCompanies(tab);
    });
  });

  list.querySelectorAll(".reset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      adminSaveCompanies(adminDefaultCompanies().map(c => c.id === btn.dataset.id ? {...c, status:"Pending"} : c));
      showNotification("Company reset to pending", "info");
      adminUpdateCompanyCounts();
      renderAdminCompanies(tab);
    });
  });
}

function setupAdminCompanyTabs() {
  const tabs = document.querySelectorAll(".admin-tabs button");
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderAdminCompanies(tab.dataset.tab);
    });
  });

  renderAdminCompanies("pending");
  adminUpdateCompanyCounts();
}
setupAdminCompanyTabs();

function adminInternshipData() {
  const base = [
    {title:"Customer Success Intern", company:"Estarta Solutions", companyStatus:"Approved", major:"Business Administration", status:"Active", applicants:1},
    {title:"Cloud Infrastructure Intern", company:"Estarta Solutions", companyStatus:"Approved", major:"Information Technology", status:"Active", applicants:0},
    {title:"Mobile Engineering Intern", company:"Maktoob Studio", companyStatus:"Approved", major:"Software Engineering", status:"Active", applicants:0},
    {title:"Product Design Intern", company:"Maktoob Studio", companyStatus:"Approved", major:"Graphic Design", status:"Active", applicants:0},
    {title:"Marketing Intern", company:"Arab Bank", companyStatus:"Approved", major:"Marketing", status:"Active", applicants:0},
    {title:"Finance Intern", company:"Arab Bank", companyStatus:"Approved", major:"Finance", status:"Active", applicants:0},
    {title:"AI Research Intern", company:"Zain Jordan", companyStatus:"Pending", major:"Artificial Intelligence", status:"Active", applicants:2},
    {title:"Cybersecurity Intern", company:"Zain Jordan", companyStatus:"Pending", major:"Cybersecurity", status:"Active", applicants:0},
    {title:"Frontend Developer Intern", company:"Orange Jordan", companyStatus:"Rejected", major:"Software Engineering", status:"Active", applicants:1},
    {title:"Network Engineering Intern", company:"Orange Jordan", companyStatus:"Rejected", major:"Electrical Engineering", status:"Active", applicants:0}
  ];

  const aramex = getStoredList("tadreeb_company_listings").map(item => ({
    title:item.title,
    company:"Aramex",
    companyStatus:"Approved",
    major:item.major,
    status:item.status,
    applicants:item.applicants || 0,
    id:item.id
  }));

  return [...base, ...aramex];
}

function renderAdminInternships() {
  const rows = document.getElementById("adminInternshipRows");
  if (!rows) return;

  const deleted = getStoredList("tadreeb_admin_deleted_internships");
  const data = adminInternshipData().filter(item => !deleted.includes(item.title));

  rows.innerHTML = data.map(item => {
    const companyClass = item.companyStatus.toLowerCase();
    const statusClass = item.status === "Active" ? "accepted" : "pending";

    return `
      <div class="table-row admin-intern-row">
        <span>${item.title}</span>
        <span>${item.company}<b class="status ${companyClass === "approved" ? "accepted" : companyClass === "rejected" ? "rejected" : "pending"} company-status">${item.companyStatus}</b></span>
        <span>${item.major}</span>
        <span><b class="status ${statusClass}">${item.status}</b></span>
        <span>${item.applicants}</span>
        <button class="delete-btn admin-delete-internship" data-title="${item.title}">🗑 Delete</button>
      </div>
    `;
  }).join("");

  rows.querySelectorAll(".admin-delete-internship").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!confirm("Are you sure you want to delete this internship?")) return;
      const deleted = getStoredList("tadreeb_admin_deleted_internships");
      deleted.push(btn.dataset.title);
      setStoredList("tadreeb_admin_deleted_internships", deleted);
      showNotification("Internship deleted!", "info");
      renderAdminInternships();
    });
  });

  const count = document.getElementById("adminInternshipCount");
  const activeSmall = document.getElementById("adminActiveSmall");
  if (count) count.textContent = data.length;
  if (activeSmall) activeSmall.textContent = `${data.filter(x => x.status === "Active").length} active`;
}
renderAdminInternships();

function updateAdminOverviewStats() {
  adminUpdateCompanyCounts();
  const apps = getStoredList("tadreeb_applications");
  const baseTotal = 8 + apps.length;
  const accepted = 2 + apps.filter(x => x.status === "Accepted").length;
  const pending = 5 + apps.filter(x => x.status === "Pending").length;
  const rejected = 1 + apps.filter(x => x.status === "Rejected").length;
  const total = accepted + pending + rejected;

  const appCount = document.getElementById("adminApplicationCount");
  const acceptedSmall = document.getElementById("adminAcceptedSmall");
  const donutTotal = document.getElementById("donutTotal");
  const acceptedLegend = document.getElementById("acceptedLegend");
  const pendingLegend = document.getElementById("pendingLegend");
  const rejectedLegend = document.getElementById("rejectedLegend");

  if (appCount) appCount.textContent = total;
  if (acceptedSmall) acceptedSmall.textContent = `${accepted} accepted`;
  if (donutTotal) donutTotal.textContent = total;
  if (acceptedLegend) acceptedLegend.textContent = accepted;
  if (pendingLegend) pendingLegend.textContent = pending;
  if (rejectedLegend) rejectedLegend.textContent = rejected;
}
updateAdminOverviewStats();
