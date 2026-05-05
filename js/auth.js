// Demo login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const users = {
      "admin@internjo.jo": { password: "admin123", page: "dashboards/admin-dashboard.html", role: "admin", initials: "PA", name: "Platform Admin" },
      "student@ju.edu.jo": { password: "student123", page: "dashboards/student-dashboard.html", role: "student", initials: "LH", name: "Laith Haddad" },
      "hr@aramex.com": { password: "company123", page: "dashboards/company-dashboard.html", role: "company", initials: "AH", name: "Aramex HR" }
    };

    if (users[email] && users[email].password === password) {
      localStorage.setItem("tadreeb_user_role", users[email].role);
      localStorage.setItem("tadreeb_user_initials", users[email].initials);
      localStorage.setItem("tadreeb_user_name", users[email].name || "Laith Haddad");
      notifyThenGo("Welcome back!", users[email].page);
    } else {
      showNotification("Wrong email or password", "info");
    }
  });
}

// Signup role switch
const signupForm = document.getElementById("signupForm");
const roleCards = document.querySelectorAll(".role-card");
const studentFields = document.getElementById("studentFields");
const companyFields = document.getElementById("companyFields");

if (roleCards.length && studentFields && companyFields) {
  roleCards.forEach(card => {
    card.addEventListener("click", () => {
      roleCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");

      const role = card.dataset.role;
      if (role === "company") {
        studentFields.classList.add("hidden");
        companyFields.classList.remove("hidden");
      } else {
        companyFields.classList.add("hidden");
        studentFields.classList.remove("hidden");
      }
    });
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Account created successfully");
    window.location.href = "login.html";
  });
}
