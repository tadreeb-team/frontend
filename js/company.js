// Company dashboard data
function getCompanyApplications(){const studentApps=getStoredList("tadreeb_applications");const defaults=[{id:"app-omar-software",student:"Omar Khalid",email:"omar@just.edu.jo",education:"Jordan University of Science and Technology · Software Engineering",letter:"Software engineering student at JUST with backend internship experience.",title:"Software Engineering Intern",company:"Aramex",status:"Pending",applied:"20h ago"},{id:"app-layla-software",student:"Layla Haddad",email:"student@ju.edu.jo",education:"University of Jordan · Computer Science",letter:"I am a third-year CS student at the University of Jordan with strong Node.js experience.",title:"Software Engineering Intern",company:"Aramex",status:"Pending",applied:"20h ago"},{id:"app-noor-data",student:"Noor Saleh",email:"noor@psut.edu.jo",education:"Princess Sumaya University for Technology · Data Science",letter:"Data Science student at PSUT with experience in pandas and SQL.",title:"Data Analytics Intern",company:"Aramex",status:"Accepted",applied:"20h ago"}];const laithApps=studentApps.filter(app=>app.company==="Aramex").map(app=>({id:app.id,student:"Laith Haddad",email:"student@ju.edu.jo",education:"University of Jordan · Computer Science",letter:"Application submitted from student account.",title:app.title,company:app.company,status:app.status||"Pending",applied:app.applied||"Just now"}));const merged=[...defaults];laithApps.forEach(app=>{const i=merged.findIndex(item=>item.id===app.id||(item.title===app.title&&item.student===app.student));if(i>=0)merged[i]={...merged[i],...app};else merged.unshift(app)});const overrides=getStoredList("tadreeb_company_status_overrides");return merged.map(app=>{const o=overrides.find(item=>item.id===app.id||(item.title===app.title&&item.student===app.student));return o?{...app,status:o.status}:app})}
function updateStudentApplicationStatus(title,status){const apps=getStoredList("tadreeb_applications");setStoredList("tadreeb_applications",apps.map(app=>app.title===title&&app.company==="Aramex"?{...app,status}:app))}
function setCompanyApplicantStatus(app,status){const overrides=getStoredList("tadreeb_company_status_overrides");const next=overrides.filter(item=>!(item.id===app.id||(item.title===app.title&&item.student===app.student)));next.push({id:app.id,title:app.title,student:app.student,status});setStoredList("tadreeb_company_status_overrides",next);if(app.student==="Laith Haddad"||app.student==="Layla Haddad")updateStudentApplicationStatus(app.title,status);showNotification(`Application ${status.toLowerCase()}!`);renderCompanyApplicantPages();renderCompanyDashboard()}
function applicantStatusBadge(status){return `<b class="status ${status.toLowerCase()}">${status}</b>`}
function renderCompanyDashboard(){const recent=document.getElementById("companyRecentApplicants"),pending=document.getElementById("companyPendingCount"),accepted=document.getElementById("companyAcceptedCount"),softLabel=document.getElementById("softwareApplicantsLabel"),softCount=document.getElementById("softwareApplicantsCount");if(!recent&&!pending&&!accepted&&!softLabel&&!softCount)return;const apps=getCompanyApplications();const soft=apps.filter(app=>app.title==="Software Engineering Intern");if(pending)pending.textContent=apps.filter(app=>app.status==="Pending").length;if(accepted)accepted.textContent=apps.filter(app=>app.status==="Accepted").length;if(softLabel)softLabel.textContent=`${soft.length} applicant${soft.length===1?"":"s"}`;if(softCount)softCount.textContent=soft.length;if(recent)recent.innerHTML=apps.slice(0,4).map(app=>`<div class="table-row applicants-row"><span class="student-name">${app.student}<small>${app.education.split("·").pop().trim()}</small></span><span>${app.title}</span><span>${applicantStatusBadge(app.status)}</span><span>${app.applied}</span></div>`).join("")}
function renderCompanyApplicantPages(){const list=document.getElementById("softwareApplicantsList"),count=document.getElementById("softwareApplicantsPageCount");if(!list)return;const apps=getCompanyApplications().filter(app=>app.title==="Software Engineering Intern");if(count)count.textContent=`${apps.length} applicant${apps.length===1?"":"s"}`;list.innerHTML=apps.map(app=>`<div class="applicant-card"><div class="applicant-status">${applicantStatusBadge(app.status)}<span>${app.applied}</span></div><h2>${app.student}</h2><p>${app.email}</p><p>${app.education}</p><div class="cover-letter">${app.letter}</div><div class="applicant-actions"><button class="accept-btn" data-id="${app.id}">✓ Accept</button><button class="reject-btn" data-id="${app.id}">× Reject</button><button class="reset-btn-inline" data-id="${app.id}">Reset to pending</button></div></div>`).join("");list.querySelectorAll("[data-id]").forEach(btn=>{btn.addEventListener("click",()=>{const app=apps.find(item=>item.id===btn.dataset.id);if(!app)return;if(btn.classList.contains("accept-btn"))setCompanyApplicantStatus(app,"Accepted");if(btn.classList.contains("reject-btn"))setCompanyApplicantStatus(app,"Rejected");if(btn.classList.contains("reset-btn-inline"))setCompanyApplicantStatus(app,"Pending")})})}
document.querySelectorAll(".applicant-actions").forEach(actions=>{const app=getCompanyApplications().find(item=>item.title===actions.dataset.appTitle&&item.student===actions.dataset.student);if(!app)return;actions.querySelector(".accept-btn")?.addEventListener("click",()=>setCompanyApplicantStatus(app,"Accepted"));actions.querySelector(".reject-btn")?.addEventListener("click",()=>setCompanyApplicantStatus(app,"Rejected"));actions.querySelector(".reset-btn-inline")?.addEventListener("click",()=>setCompanyApplicantStatus(app,"Pending"))});
document.getElementById("postInternshipForm")?.addEventListener("submit",e=>{e.preventDefault();showNotification("Internship posted!")});
document.getElementById("companyProfileForm")?.addEventListener("submit",e=>{e.preventDefault();showNotification("Company profile saved!")});
renderCompanyDashboard();renderCompanyApplicantPages();

// Company final fixes
function companyListingsBase(){
  let list=getStoredList("tadreeb_company_listings");
  if(list.length) return list;
  list=[
    {id:"internship-data-analytics-aramex",title:"Data Analytics Intern",major:"Data Science",city:"Amman",type:"Onsite",status:"Active",applicants:1,duration:"4 months",desc:"Help our analytics team turn shipment and operations data into insights using SQL, Python, and Looker.",url:"../internships/internship-data-analytics-aramex.html"},
    {id:"internship-software-aramex",title:"Software Engineering Intern",major:"Computer Science",city:"Amman",type:"Hybrid",status:"Active",applicants:2,duration:"3 months",desc:"Join the Aramex platform team to build and maintain Node.js microservices.",url:"../internships/internship-software-aramex.html"}
  ];
  setStoredList("tadreeb_company_listings",list);
  return list;
}
function saveCompanyListings(list){setStoredList("tadreeb_company_listings",list)}
function syncInactive(){setStoredList("tadreeb_inactive_company_internships",companyListingsBase().filter(x=>x.status!=="Active").map(x=>x.id))}
function applyCompanyNavbarFixed(){
  if(localStorage.getItem("tadreeb_user_role")!=="company") return;
  const navLinks=document.getElementById("navLinks"), navActions=document.querySelector(".nav-actions");
  if(!navLinks||!navActions) return;
  const prefix=location.pathname.includes("/dashboards/")?"../":"";
  navLinks.innerHTML=`<a href="${prefix}dashboards/company-dashboard.html">Dashboard</a><a href="${prefix}dashboards/company-listings.html">Listings</a><a href="${prefix}dashboards/company-profile.html">Company profile</a>`;
  navLinks.querySelectorAll("a").forEach(a=>{if(location.pathname.includes(a.href.split("/").pop()))a.classList.add("active")});
  const theme=navActions.querySelector("#themeToggle"), menu=navActions.querySelector("#menuBtn");
  navActions.innerHTML="";
  if(theme) navActions.appendChild(theme);
  const wrap=document.createElement("div");
  wrap.className="profile-wrap";
  wrap.innerHTML=`<button class="user-avatar">AH</button><div class="profile-menu"><strong>Aramex HR Team</strong><span>COMPANY</span><hr><a href="${prefix}dashboards/company-profile.html">▦ Company profile</a><button type="button" id="companyLogoutBtn">↪ Sign out</button></div>`;
  navActions.appendChild(wrap);
  wrap.querySelector(".user-avatar").onclick=e=>{e.stopPropagation();wrap.classList.toggle("open")};
  wrap.querySelector("#companyLogoutBtn").onclick=()=>{localStorage.removeItem("tadreeb_user_role");localStorage.removeItem("tadreeb_user_initials");localStorage.removeItem("tadreeb_user_name");notifyThenGo("Signed out",`${prefix}index.html`,"info")};
  document.addEventListener("click",()=>wrap.classList.remove("open"));
  if(menu) navActions.appendChild(menu);
}
applyCompanyNavbarFixed();

function renderCompanyListingsFixed(){
  const table=document.querySelector(".listings-table");
  if(!table) return;
  const head=table.querySelector(".table-head");
  table.innerHTML=""; table.appendChild(head);
  companyListingsBase().forEach(item=>{
    const row=document.createElement("div");
    row.className="table-row listings-row";
    const inactive=item.status!=="Active";
    row.innerHTML=`<strong>${item.title}</strong><span>${item.major}</span><span>${item.city}</span><span>${item.type}</span><span><b class="status ${inactive?'pending':'accepted'}">${item.status}</b></span><span>${item.applicants}</span><span class="listing-actions"><a class="table-view-btn" href="${item.title.includes('Software')?'company-applicants-software.html':'company-applicants-data.html'}">View</a><a class="icon-edit" href="company-edit-internship.html?id=${item.id}">✎</a><button class="link-btn toggle-listing" data-id="${item.id}">${inactive?'Activate':'Deactivate'}</button><button class="delete-btn" data-id="${item.id}">🗑</button></span>`;
    table.appendChild(row);
  });
  table.querySelectorAll(".toggle-listing").forEach(btn=>btn.onclick=()=>{let list=companyListingsBase().map(x=>x.id===btn.dataset.id?{...x,status:x.status==="Active"?"Inactive":"Active"}:x);saveCompanyListings(list);syncInactive();showNotification("Listing status updated!");renderCompanyListingsFixed()});
  table.querySelectorAll(".delete-btn").forEach(btn=>btn.onclick=()=>{if(!confirm("Are you sure you want to delete this internship?"))return;saveCompanyListings(companyListingsBase().filter(x=>x.id!==btn.dataset.id));syncInactive();showNotification("Internship deleted!","info");renderCompanyListingsFixed()});
}
renderCompanyListingsFixed();

function renderEditInternshipFixed(){
  const form=document.getElementById("editInternshipForm"); if(!form)return;
  const id=new URLSearchParams(location.search).get("id")||"internship-data-analytics-aramex";
  const item=companyListingsBase().find(x=>x.id===id)||companyListingsBase()[0];
  editTitle.value=item.title; editDesc.value=item.desc||""; editMajor.value=item.major; editCity.value=item.city; editWork.value=item.type==="Onsite"?"On-site":item.type; editDuration.value=item.duration||"3 months";
  form.onsubmit=e=>{e.preventDefault();saveCompanyListings(companyListingsBase().map(x=>x.id===id?{...x,title:editTitle.value,desc:editDesc.value,major:editMajor.value,city:editCity.value,type:editWork.value.replace("On-site","Onsite"),duration:editDuration.value, maxApplicants:Number(editMaxApplicants?.value || x.maxApplicants || 15)}:x));showNotification("Internship updated!");setTimeout(()=>location.href="company-listings.html",600)}
}
renderEditInternshipFixed();

const postFormFixed=document.getElementById("postInternshipForm");
if(postFormFixed){postFormFixed.onsubmit=e=>{e.preventDefault();const els=postFormFixed.querySelectorAll("input, textarea, select");let list=companyListingsBase();list.push({id:"internship-company-"+Date.now(),title:els[0].value||"New Internship",desc:els[1].value||"New internship opportunity.",major:els[2].value==="Select major"?"Computer Science":els[2].value,city:els[3].value==="Select city"?"Amman":els[3].value,type:els[4].value.replace("On-site","Onsite"),duration:els[5].value||"3 months",status:"Active",applicants:0,url:"#"});saveCompanyListings(list);showNotification("Internship posted!");setTimeout(()=>location.href="company-listings.html",700)}}

function hideInactiveFromStudents(){const inactive=getStoredList("tadreeb_inactive_company_internships");if(!inactive.length)return;document.querySelectorAll('a[href*="internship-"]').forEach(a=>{const href=a.getAttribute("href")||"";if(inactive.some(id=>href.includes(id)))a.remove()})}
hideInactiveFromStudents();

function enhanceCompanyApplicantButtons(){document.querySelectorAll(".applicant-card").forEach(card=>{const badge=card.querySelector(".status");const actions=card.querySelector(".applicant-actions");if(!badge||!actions)return;const status=badge.textContent.trim();actions.querySelectorAll(".accept-btn,.reject-btn").forEach(b=>b.style.display=status==="Pending"?"":"none")})}
setTimeout(enhanceCompanyApplicantButtons,300);
if(typeof setCompanyApplicantStatus==="function"){const old=setCompanyApplicantStatus;setCompanyApplicantStatus=function(app,status){old(app,status);setTimeout(enhanceCompanyApplicantButtons,300)}}

// Company dashboard polish fixes v2
function companyListingsV2() {
  let list = getStoredList("tadreeb_company_listings");
  if (!list.length) {
    list = [
      {id:"internship-data-analytics-aramex", title:"Data Analytics Intern", major:"Data Science", city:"Amman", type:"Onsite", status:"Active", applicants:1, maxApplicants:15, duration:"4 months", desc:"Help our analytics team turn shipment and operations data into insights using SQL, Python, and Looker.", url:"../internships/internship-data-analytics-aramex.html"},
      {id:"internship-software-aramex", title:"Software Engineering Intern", major:"Computer Science", city:"Amman", type:"Hybrid", status:"Active", applicants:2, maxApplicants:20, duration:"3 months", desc:"Join the Aramex platform team to build and maintain Node.js microservices.", url:"../internships/internship-software-aramex.html"}
    ];
    setStoredList("tadreeb_company_listings", list);
  }
  return list;
}

function saveCompanyListingsV2(list) {
  setStoredList("tadreeb_company_listings", list);
}

function aramexAppsV2() {
  return typeof getCompanyApplications === "function" ? getCompanyApplications() : [];
}

function appCountV2(title) {
  return aramexAppsV2().filter(app => app.title === title).length;
}

function updateCompanyStatsV2() {
  const cards = document.querySelectorAll(".company-stats article strong");
  if (!cards.length) return;
  const listings = companyListingsV2();
  const apps = aramexAppsV2();
  if (cards[0]) cards[0].textContent = listings.length;
  if (cards[1]) cards[1].textContent = listings.filter(x => x.status === "Active").length;
  if (cards[2]) cards[2].textContent = apps.filter(x => x.status === "Pending").length;
  if (cards[3]) cards[3].textContent = apps.filter(x => x.status === "Accepted").length;
}

function renderActiveInternshipsV2() {
  const grid = document.querySelector(".company-active-grid");
  if (!grid) return;
  const active = companyListingsV2().filter(x => x.status === "Active");
  grid.innerHTML = active.length ? active.map(item => {
    const count = appCountV2(item.title) || item.applicants || 0;
    const page = item.title.includes("Software") ? "company-applicants-software.html" : "company-applicants-data.html";
    return `
      <article class="company-active-card">
        <h3>${item.title}</h3>
        <div class="tags">
          <span class="tag">${item.major}</span>
          <span class="tag work">${item.type}</span>
          <span class="tag accepted-tag">Active</span>
        </div>
        <p>${count}/${item.maxApplicants || 20} applicants</p>
        <div class="active-card-actions">
          <a class="secondary" href="${page}">Applicants</a>
          <a class="icon-edit" href="company-edit-internship.html?id=${item.id}">✎</a>
        </div>
      </article>`;
  }).join("") : `<div class="empty-list">No active internships yet.</div>`;
}

function renderListingsV2() {
  const table = document.querySelector(".listings-table");
  if (!table) return;
  const head = table.querySelector(".table-head");
  table.innerHTML = "";
  if (head) table.appendChild(head);
  companyListingsV2().forEach(item => {
    const count = appCountV2(item.title) || item.applicants || 0;
    const inactive = item.status !== "Active";
    const row = document.createElement("div");
    row.className = "table-row listings-row";
    row.innerHTML = `
      <strong>${item.title}</strong>
      <span>${item.major}</span>
      <span>${item.city}</span>
      <span>${item.type}</span>
      <span><b class="status ${inactive ? "pending" : "accepted"}">${item.status}</b></span>
      <span>${count}/${item.maxApplicants || 20}</span>
      <span class="listing-actions">
        <a class="table-view-btn" href="${item.title.includes("Software") ? "company-applicants-software.html" : "company-applicants-data.html"}">View</a>
        <a class="icon-edit" href="company-edit-internship.html?id=${item.id}">✎</a>
        <button class="link-btn toggle-v2" data-id="${item.id}">${inactive ? "Activate" : "Deactivate"}</button>
        <button class="delete-btn delete-v2" data-id="${item.id}">🗑</button>
      </span>`;
    table.appendChild(row);
  });
  table.querySelectorAll(".toggle-v2").forEach(btn => {
    btn.onclick = () => {
      const next = companyListingsV2().map(x => x.id === btn.dataset.id ? {...x, status:x.status === "Active" ? "Inactive" : "Active"} : x);
      saveCompanyListingsV2(next);
      setStoredList("tadreeb_inactive_company_internships", next.filter(x => x.status !== "Active").map(x => x.id));
      showNotification("Listing status updated!");
      renderListingsV2();
      renderActiveInternshipsV2();
      updateCompanyStatsV2();
    };
  });
  table.querySelectorAll(".delete-v2").forEach(btn => {
    btn.onclick = () => {
      if (!confirm("Are you sure you want to delete this internship?")) return;
      const next = companyListingsV2().filter(x => x.id !== btn.dataset.id);
      saveCompanyListingsV2(next);
      const hidden = getStoredList("tadreeb_inactive_company_internships");
      hidden.push(btn.dataset.id);
      setStoredList("tadreeb_inactive_company_internships", hidden);
      showNotification("Internship deleted!", "info");
      renderListingsV2();
      renderActiveInternshipsV2();
      updateCompanyStatsV2();
    };
  });
}

function handlePostV2() {
  const form = document.getElementById("postInternshipForm");
  if (!form) return;
  form.onsubmit = e => {
    e.preventDefault();
    const fields = form.querySelectorAll("input, textarea, select");
    const list = companyListingsV2();
    list.push({
      id:"internship-company-" + Date.now(),
      title:fields[0].value || "New Internship",
      desc:fields[1].value || "New internship opportunity.",
      major:fields[2].value === "Select major" ? "Computer Science" : fields[2].value,
      city:fields[3].value === "Select city" ? "Amman" : fields[3].value,
      type:fields[4].value.replace("On-site", "Onsite"),
      duration:fields[5].value || "3 months",
      maxApplicants:Number(document.getElementById("maxApplicants")?.value || fields[6]?.value || 15),
      status:"Active",
      applicants:0,
      url:"#"
    });
    saveCompanyListingsV2(list);
    showNotification("Internship posted!");
    setTimeout(() => location.href = "company-listings.html", 700);
  };
}

function handleEditV2() {
  const form = document.getElementById("editInternshipForm");
  if (!form) return;
  const id = new URLSearchParams(location.search).get("id") || "internship-data-analytics-aramex";
  const item = companyListingsV2().find(x => x.id === id) || companyListingsV2()[0];
  editTitle.value = item.title;
  editDesc.value = item.desc || "";
  editMajor.value = item.major;
  editCity.value = item.city;
  editWork.value = item.type === "Onsite" ? "On-site" : item.type;
  editDuration.value = item.duration || "3 months";
  if (typeof editMaxApplicants !== "undefined") editMaxApplicants.value = item.maxApplicants || 15;
  form.onsubmit = e => {
    e.preventDefault();
    const next = companyListingsV2().map(x => x.id === id ? {
      ...x, title:editTitle.value, desc:editDesc.value, major:editMajor.value,
      city:editCity.value, type:editWork.value.replace("On-site","Onsite"), duration:editDuration.value, maxApplicants:Number(editMaxApplicants?.value || x.maxApplicants || 15)
    } : x);
    saveCompanyListingsV2(next);
    showNotification("Internship updated!");
    setTimeout(() => location.href = "company-listings.html", 700);
  };
}

function applicantButtonsV2() {
  document.querySelectorAll(".applicant-card").forEach(card => {
    const badge = card.querySelector(".status");
    const accept = card.querySelector(".accept-btn");
    const reject = card.querySelector(".reject-btn");
    const reset = card.querySelector(".reset-btn-inline");
    if (!badge || !accept || !reject || !reset) return;
    const isPending = badge.textContent.trim() === "Pending";
    accept.style.display = isPending ? "inline-flex" : "none";
    reject.style.display = isPending ? "inline-flex" : "none";
    reset.style.display = "inline-flex";
  });
}

if (typeof setCompanyApplicantStatus === "function") {
  const oldSetV2 = setCompanyApplicantStatus;
  setCompanyApplicantStatus = function(app, status) {
    oldSetV2(app, status);
    enforceSingleAcceptedInternship(app, status);
    setTimeout(() => {
      applicantButtonsV2();
      updateCompanyStatsV2();
      renderActiveInternshipsV2();
      renderListingsV2();
    }, 200);
  };
}

function hideInactiveFromStudentsV2() {
  const hidden = getStoredList("tadreeb_inactive_company_internships");
  if (!hidden.length) return;
  document.querySelectorAll('a[href*="internship-"]').forEach(a => {
    const href = a.getAttribute("href") || "";
    if (hidden.some(id => href.includes(id))) a.remove();
  });
}

handlePostV2();
handleEditV2();
renderActiveInternshipsV2();
renderListingsV2();
updateCompanyStatsV2();
setTimeout(applicantButtonsV2, 300);
hideInactiveFromStudentsV2();


function enforceSingleAcceptedInternship(app, status) {
  if (status !== "Accepted") return;

  const apps = getStoredList("tadreeb_applications");
  if (!apps.length) return;

  const updated = apps.map(item => {
    if (item.title === app.title && item.company === app.company) {
      return { ...item, status: "Accepted" };
    }
    if (item.status === "Pending" || item.status === "Under Review") {
      return { ...item, status: "Rejected" };
    }
    return item;
  });

  setStoredList("tadreeb_applications", updated);
}
