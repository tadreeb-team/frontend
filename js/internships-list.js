// Full internships page
const internshipList = document.getElementById("internshipList");
const resultCount = document.getElementById("resultCount");
const listSearch = document.getElementById("listSearch");
const listMajor = document.getElementById("listMajor");
const listCity = document.getElementById("listCity");
const listWork = document.getElementById("listWork");
const applyFilters = document.getElementById("applyFilters");
const resetFilters = document.getElementById("resetFilters");

function renderInternshipList() {
  if (!internshipList || !resultCount) return;

  const search = (listSearch?.value || "").toLowerCase();
  const major = listMajor?.value || "all";
  const city = listCity?.value || "all";
  const work = listWork?.value || "all";

  const filtered = allInternships.filter(item => {
    const text = `${item.title} ${item.company} ${item.major} ${item.desc}`.toLowerCase();
    return text.includes(search)
      && (major === "all" || item.major === major)
      && (city === "all" || item.city === city)
      && (work === "all" || item.work === work);
  });

  resultCount.textContent = `Showing ${filtered.length} result${filtered.length === 1 ? "" : "s"}`;

  internshipList.innerHTML = filtered.map(item => `
    <a class="list-card card-link" href="${item.url}">
      <div class="avatar">${item.initials}</div>
      <div>
        <h3>${item.title}</h3>
        <span class="company">${item.company}</span>
        <div class="tags">
          <span class="tag">⌾ ${item.city}</span>
          <span class="tag work">${item.work}</span>
          <span class="tag duration">${item.duration}</span>
          <span class="tag">${item.major}</span>
        </div>
        <p>${item.desc}</p>
        <div class="card-foot">
          <span>1h ago</span>
          <span class="view">View →</span>
        </div>
      </div>
    </a>
  `).join("") || `<div class="empty-list">No internships found. Try changing your filters.</div>`;
}

if (internshipList) {
  renderInternshipList();
  applyFilters?.addEventListener("click", renderInternshipList);
  [listSearch, listMajor, listCity, listWork].forEach(el => {
    if (el) el.addEventListener("input", renderInternshipList);
  });
  resetFilters?.addEventListener("click", () => {
    listSearch.value = "";
    listMajor.value = "all";
    listCity.value = "all";
    listWork.value = "all";
    renderInternshipList();
  });
}
