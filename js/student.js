// Profile form demo save
const profileForm = document.getElementById("profileForm");
if (profileForm) {
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    showNotification("Profile changes saved!");
  });
}


// Apply + Save internship interactions
// Initialize default saved internships only once
function initializeDefaultStudentData() {
  const savedInitialized = localStorage.getItem("tadreeb_saved_initialized");
  if (!savedInitialized) {
    setStoredList("tadreeb_saved", [
      {
        id:"internship-software-aramex",
        title:"Software Engineering Intern",
        company:"Aramex",
        initials:"A",
        city:"Amman",
        work:"Hybrid",
        duration:"3 months",
        major:"Computer Science",
        desc:"Join the Aramex platform team to build and maintain Node.js microservices powering our shipment tracking experience.",
        url:"../internships/internship-software-aramex.html"
      },
      {
        id:"internship-frontend-orange",
        title:"Frontend Developer Intern",
        company:"Orange Jordan",
        initials:"OJ",
        city:"Amman",
        work:"Remote",
        duration:"3 months",
        major:"Software Engineering",
        desc:"Build customer-facing web experiences with React and TypeScript. Collaborate closely with product designers.",
        url:"../internships/internship-frontend-orange.html"
      }
    ]);
    localStorage.setItem("tadreeb_saved_initialized", "true");
  }
}
initializeDefaultStudentData();


function currentPrefix() {
  return location.pathname.includes("/internships/") || location.pathname.includes("/companies/") || location.pathname.includes("/dashboards/") ? "../" : "";
}


function studentHasAcceptedInternship() {
  return getStoredList("tadreeb_applications").some(app => app.status === "Accepted");
}

function getCompanyListingByTitle(title, company) {
  const listings = getStoredList("tadreeb_company_listings");
  return listings.find(item => item.title === title && company === "Aramex");
}

function countApplicationsForInternship(title, company) {
  const apps = getStoredList("tadreeb_applications");
  return apps.filter(app => app.title === title && app.company === company).length;
}

function isInternshipFull(title, company) {
  const listing = getCompanyListingByTitle(title, company);
  if (!listing || !listing.maxApplicants) return false;
  return countApplicationsForInternship(title, company) >= Number(listing.maxApplicants);
}

function setupApplyAndSave() {
  const role = localStorage.getItem("tadreeb_user_role");

  document.querySelectorAll(".apply-interaction").forEach(box => {
    const form = box.querySelector(".apply-form");
    const appliedBox = box.querySelector(".already-applied");
    const id = box.dataset.id;

    if (role !== "student") {
      box.innerHTML = `<p>Want to apply? <a href="../login.html">Log in</a> or <a href="../signup.html">create a student account</a>.</p>`;
      return;
    }

    const applications = getStoredList("tadreeb_applications");
    const already = applications.some(item => item.id === id);

    if (already) {
      form.classList.add("hidden");
      appliedBox.classList.remove("hidden");
    }

    if (role === "student" && studentHasAcceptedInternship() && !already) {
      form.classList.add("hidden");
      appliedBox.classList.remove("hidden");
      appliedBox.innerHTML = `
        <h2>Application closed</h2>
        <p>You already have an accepted internship, so you cannot apply to another training opportunity.</p>
      `;
      return;
    }

    if (role === "student" && isInternshipFull(box.dataset.title, box.dataset.company) && !already) {
      form.classList.add("hidden");
      appliedBox.classList.remove("hidden");
      appliedBox.innerHTML = `
        <h2>Application closed</h2>
        <p>This internship reached the maximum number of applicants.</p>
      `;
      return;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();


      if (studentHasAcceptedInternship()) {
        showNotification("You already have an accepted internship", "info");
        return;
      }

      if (isInternshipFull(box.dataset.title, box.dataset.company)) {
        showNotification("This internship is full", "info");
        return;
      }

      const applications = getStoredList("tadreeb_applications");
      if (!applications.some(item => item.id === id)) {
        applications.push({
          id,
          title: box.dataset.title,
          company: box.dataset.company,
          initials: box.dataset.initials,
          status: "Pending",
          applied: "Just now",
          url: `../internships/${location.pathname.split("/").pop()}`
        });
        setStoredList("tadreeb_applications", applications);
      }

      form.classList.add("hidden");
      appliedBox.classList.remove("hidden");
      showNotification("Application submitted!");
    });
  });

  document.querySelectorAll(".save-internship-btn").forEach(btn => {
    const id = btn.dataset.id;
    const saved = getStoredList("tadreeb_saved");
    const isSaved = saved.some(item => item.id === id);

    function renderButton(state) {
      btn.classList.toggle("saved", state);
      btn.innerHTML = state ? "♥ Saved" : "♡ Save for later";
    }

    renderButton(isSaved);

    btn.addEventListener("click", () => {
      let savedList = getStoredList("tadreeb_saved");
      const exists = savedList.some(item => item.id === id);

      if (exists) {
        savedList = savedList.filter(item => item.id !== id);
        renderButton(false);
        showNotification("Removed from saved", "info");
      } else {
        savedList.push({
          id,
          title: btn.dataset.title,
          company: btn.dataset.company,
          initials: btn.dataset.initials,
          url: `../internships/${location.pathname.split("/").pop()}`
        });
        renderButton(true);
        showNotification("Saved!");
      }

      setStoredList("tadreeb_saved", savedList);
    });
  });
}

setupApplyAndSave();

function renderApplicationsPage() {
  const rows = document.getElementById("applicationsRows");
  if (!rows) return;

  const base = [
    {title:"Frontend Developer Intern", company:"Orange Jordan", status:"Accepted", applied:"5h ago", url:"../internships/internship-frontend-orange.html"},
    {title:"Software Engineering Intern", company:"Aramex", status:"Pending", applied:"5h ago", url:"../internships/internship-software-aramex.html"}
  ];

  const stored = getStoredList("tadreeb_applications");
  const all = [...base, ...stored.filter(s => !base.some(b => b.title === s.title))];

  rows.innerHTML = all.map(app => {
    let url = app.url || "#";
    if (url.startsWith("/")) {
      const parts = url.split("/internships/");
      url = parts.length > 1 ? `../internships/${parts[1]}` : url;
    }
    return `
      <div class="table-row applications-row">
        <span>${app.title}</span>
        <span>${app.company}</span>
        <span><b class="status ${app.status.toLowerCase()}">${app.status}</b></span>
        <span>${app.applied}</span>
        <a class="table-view-btn" href="${url}">View</a>
      </div>
    `;
  }).join("");
}

renderApplicationsPage();

function renderSavedPage() {
  const savedGrid = document.getElementById("savedGrid");
  if (!savedGrid) return;

  const all = getStoredList("tadreeb_saved");

  if (!all.length) {
    savedGrid.innerHTML = `
      <div class="empty-saved-state">
        <div class="empty-heart">♡</div>
        <h2>No saved internships yet</h2>
        <p>Tap the heart on any internship to save it here.</p>
        <a class="primary" href="../internships.html">Browse internships</a>
      </div>
    `;
    return;
  }

  savedGrid.innerHTML = all.map(item => `
    <a class="internship-card card-link" href="${item.url}">
      <div class="card-head">
        <div class="avatar">${item.initials}</div>
        <div>
          <h3>${item.title}</h3>
          <span class="company">${item.company}</span>
        </div>
      </div>
      <div class="tags">
        <span class="tag">⌾ ${item.city || "Amman"}</span>
        <span class="tag work">${item.work || "Hybrid"}</span>
        <span class="tag duration">${item.duration || "3 months"}</span>
        <span class="tag">${item.major || "Computer Science"}</span>
      </div>
      <p>${item.desc || "Saved internship opportunity."}</p>
      <div class="card-foot">
        <span>Saved</span>
        <span class="view">View →</span>
      </div>
    </a>
  `).join("");
}

renderSavedPage();




// Student dashboard dynamic numbers
function updateStudentDashboardStats() {
  const totalEl = document.getElementById("totalApplicationsCount");
  const pendingEl = document.getElementById("pendingApplicationsCount");
  const acceptedEl = document.getElementById("acceptedApplicationsCount");
  const savedEl = document.getElementById("savedCount");

  if (!totalEl || !pendingEl || !acceptedEl || !savedEl) return;

  const defaultApplications = [
    { title: "Frontend Developer Intern", status: "Accepted" },
    { title: "Software Engineering Intern", status: "Pending" }
  ];

  const storedApplications = getStoredList("tadreeb_applications");
  const saved = getStoredList("tadreeb_saved");

  const applications = [
    ...defaultApplications,
    ...storedApplications.filter(app => !defaultApplications.some(d => d.title === app.title))
  ];

  totalEl.textContent = applications.length;
  pendingEl.textContent = applications.filter(app => app.status === "Pending").length;
  acceptedEl.textContent = applications.filter(app => app.status === "Accepted").length;
  savedEl.textContent = saved.length;
}

updateStudentDashboardStats();
