/**
 * CampusResolve AI - Authentication Controller & Quick Demo Login
 */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const msg = document.getElementById("msg");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (msg) msg.textContent = "Authenticating with Campus Directory...";

      // Check if admin credentials or student
      let role = "student";
      let userObj = window.DEMO_USERS ? window.DEMO_USERS.student : null;

      if (email.includes("admin") || email.includes("dean") || email.includes("warden") || email.includes("proctor")) {
        role = "admin";
        userObj = email.includes("warden") ? window.DEMO_USERS.warden : window.DEMO_USERS.dean;
      } else {
        role = "student";
        userObj = window.DEMO_USERS.student;
      }

      localStorage.setItem("auth_token", "jwt_token_" + Date.now());
      localStorage.setItem("role", role);
      if (window.CampusResolve && userObj) {
        window.CampusResolve.setCurrentUser(userObj);
      }

      if (msg) {
        msg.style.color = "var(--accent-emerald)";
        msg.textContent = `Welcome ${userObj ? userObj.name : email}! Redirecting...`;
      }

      setTimeout(() => {
        if (role === "admin") {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "student-dashboard.html";
        }
      }, 500);
    });
  }

  // Quick 1-Click Demo Logins
  const demoStudentBtn = document.getElementById("quickDemoStudent");
  if (demoStudentBtn) {
    demoStudentBtn.onclick = () => {
      quickLogin("student");
    };
  }

  const demoWardenBtn = document.getElementById("quickDemoWarden");
  if (demoWardenBtn) {
    demoWardenBtn.onclick = () => {
      quickLogin("warden");
    };
  }

  const demoDeanBtn = document.getElementById("quickDemoDean");
  if (demoDeanBtn) {
    demoDeanBtn.onclick = () => {
      quickLogin("dean");
    };
  }

  // Anonymous Tracking Form
  const anonLookupForm = document.getElementById("anonLookupForm");
  if (anonLookupForm) {
    anonLookupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const token = document.getElementById("anonTokenInput").value.trim().toUpperCase();
      if (!token) return;

      const grievance = window.CampusResolve.getGrievanceById(token);
      const resultBox = document.getElementById("anonLookupResult");
      if (!resultBox) return;

      if (grievance) {
        resultBox.style.display = "block";
        const sla = window.CampusResolve.calculateSLA(grievance);
        resultBox.innerHTML = `
          <div class="glass-card" style="padding: 18px; margin-top: 15px; border-left: 4px solid var(--accent-cyan);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="badge badge-${grievance.urgency.toLowerCase()}">${grievance.urgency} Urgency</span>
              <span class="badge-status ${grievance.status}">${grievance.status.toUpperCase()}</span>
            </div>
            <h4 style="margin: 4px 0 8px;">${grievance.title}</h4>
            <p style="font-size: 0.82rem; margin-bottom: 8px;">${grievance.description}</p>
            <div style="font-size: 0.76rem; color: var(--text-muted); display:flex; flex-direction:column; gap:4px;">
              <div>📍 <strong>Location:</strong> ${grievance.location}</div>
              <div>🏛️ <strong>Routed Department:</strong> ${grievance.department}</div>
              <div>⏱️ <strong>SLA Status:</strong> ${sla.displayTime} (${sla.tierName})</div>
            </div>
            <div style="margin-top: 14px;">
              <a href="student-dashboard.html?track=${grievance.trackingCode}" class="btn btn-primary btn-sm" style="width: 100%;">Open Full Case File</a>
            </div>
          </div>
        `;
      } else {
        resultBox.style.display = "block";
        resultBox.innerHTML = `
          <div style="padding: 12px; margin-top: 12px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; color: var(--priority-critical); font-size: 0.85rem;">
            ⚠️ No active grievance found with Token Code <strong>"${token}"</strong>. Please verify your token or case ID.
          </div>
        `;
      }
    });
  }
});

function quickLogin(roleKey) {
  if (!window.DEMO_USERS) return;
  const user = window.DEMO_USERS[roleKey];
  if (!user) return;

  window.CampusResolve.setCurrentUser(user);
  localStorage.setItem("auth_token", "demo_jwt_token_" + roleKey);
  localStorage.setItem("role", user.role);

  if (window.showToast) {
    window.showToast(`Logged in as ${user.name} (${user.badge})`, "success");
  }

  setTimeout(() => {
    if (user.role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "student-dashboard.html";
    }
  }, 400);
}