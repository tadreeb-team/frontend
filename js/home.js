// Home featured cards
const grid = document.getElementById("internshipGrid");

function renderHomeCards() {
  if (!grid) return;
  grid.innerHTML = internships.slice(0, 6).map(item => `
    <a class="internship-card card-link" href="${item.url}">
      <div class="card-head">
        <div class="avatar">${item.initials}</div>
        <div>
          <h3>${item.title}</h3>
          <span class="company">${item.company}</span>
        </div>
      </div>
      <div class="tags">
        <span class="tag">⌾ ${item.city}</span>
        <span class="tag work">${item.work}</span>
        <span class="tag duration">${item.duration}</span>
        <span class="tag">${item.major}</span>
      </div>
      <p>${item.desc}</p>
      <div class="card-foot">
        <span>9 min ago</span>
        <span class="view">View →</span>
      </div>
    </a>
  `).join("");
}
renderHomeCards();
