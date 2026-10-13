/**
 * CampusResolve AI - Executive Admin Command Center Controller
 * Live KPI Engine, Hotspot Analytics, Interactive Triage, Status Transitions & Audit Logs
 */

let activeFilterDepartment = "all";
let activeFilterPriority = "all";
let activeFilterStatus = "all";
let activeSearchQuery = "";

function checkAdminAuth() {
  const role = localStorage.getItem("role");
  const user = window.CampusResolve ? window.CampusResolve.getCurrentUser() : null;

  if (role === "student" || (user && user.role === "student" && !["warden", "dean", "staff", "admin"].includes(role))) {
    alert("Access Restricted: This console is reserved for Deans, Wardens, and Campus Authorities. Redirecting to Student Portal...");
    window.location.href = "student-dashboard.html";
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  if (!checkAdminAuth()) return;
  renderAdminProfile();
  renderAdminKPIs();
  renderHotspotMatrix();
  renderGrievanceTable();
  initAdminFilters();

  // Real-time synchronization listener
  if (window.CampusResolve) {
    window.CampusResolve.on((type, data) => {
      renderAdminKPIs();
      renderHotspotMatrix();
      renderGrievanceTable();
    });
  }
});

function renderAdminProfile() {
  const user = window.CampusResolve.getCurrentUser();
  const nameEl = document.getElementById("adminProfileName");
  const badgeEl = document.getElementById("adminProfileBadge");
  const avatarEl = document.getElementById("adminProfileAvatar");

  if (nameEl) nameEl.textContent = user.name || "Dr. Sunita Rao";
  if (badgeEl) badgeEl.textContent = `${user.badge || "Hostel Warden & Assoc. Professor"} • ${user.department || "Student Welfare"}`;
  if (avatarEl) avatarEl.textContent = user.avatar || "👩‍🏫";
}

function renderAdminKPIs() {
  const analytics = window.CampusResolve.getAnalytics();

  const totalEl = document.getElementById("kpiTotal");
  const slaEl = document.getElementById("kpiSla");
  const criticalEl = document.getElementById("kpiCritical");
  const inProgEl = document.getElementById("kpiInProgress");

  if (totalEl) totalEl.textContent = analytics.total;
  if (slaEl) slaEl.textContent = `${analytics.slaComplianceRate}%`;
  if (criticalEl) criticalEl.textContent = analytics.critical;
  if (inProgEl) inProgEl.textContent = analytics.inProgress;
}

function renderHotspotMatrix() {
  const container = document.getElementById("hotspotListContainer");
  if (!container) return;

  const analytics = window.CampusResolve.getAnalytics();
  const hotspots = Object.entries(analytics.hotspotCounts).sort((a, b) => b[1] - a[1]);

  if (hotspots.length === 0) {
    container.innerHTML = `<p style="font-size:0.8rem; color:var(--text-muted);">No campus hotspots detected yet.</p>`;
    return;
  }

  const maxVal = Math.max(...hotspots.map(h => h[1]), 1);

  container.innerHTML = hotspots.slice(0, 4).map(([zone, count]) => {
    const percent = Math.round((count / maxVal) * 100);
    return `
      <div style="margin-bottom: 10px;">
        <div style="display:flex; justify-content:space-between; font-size:0.78rem; font-weight:600; margin-bottom:3px;">
          <span>📍 ${zone}</span>
          <span style="font-family:'JetBrains Mono', monospace;">${count} issues</span>
        </div>
        <div style="width:100%; height:6px; background:var(--bg-subtle); border-radius:999px; overflow:hidden;">
          <div style="width:${percent}%; height:100%; background:linear-gradient(90deg, #6366f1, #06b6d4); border-radius:999px;"></div>
        </div>
      </div>
    `;
  }).join("");
}

function initAdminFilters() {
  const deptSelect = document.getElementById("filterDepartment");
  const prioritySelect = document.getElementById("filterPriority");
  const statusSelect = document.getElementById("filterStatus");
  const searchInput = document.getElementById("adminSearchInput");

  if (deptSelect) {
    deptSelect.addEventListener("change", (e) => {
      activeFilterDepartment = e.target.value;
      renderGrievanceTable();
    });
  }

  if (prioritySelect) {
    prioritySelect.addEventListener("change", (e) => {
      activeFilterPriority = e.target.value;
      renderGrievanceTable();
    });
  }

  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      activeFilterStatus = e.target.value;
      renderGrievanceTable();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      activeSearchQuery = e.target.value.toLowerCase().trim();
      renderGrievanceTable();
    });
  }
}

function renderGrievanceTable() {
  const tbody = document.getElementById("adminTableBody");
  if (!tbody) return;

  const all = window.CampusResolve.getAllGrievances();

  let filtered = all.filter(g => {
    // Department filter
    if (activeFilterDepartment !== "all" && !g.department.toLowerCase().includes(activeFilterDepartment.toLowerCase())) {
      return false;
    }
    // Priority filter
    if (activeFilterPriority !== "all" && g.urgency.toLowerCase() !== activeFilterPriority.toLowerCase()) {
      return false;
    }
    // Status filter
    if (activeFilterStatus !== "all" && g.status !== activeFilterStatus) {
      return false;
    }
    // Search query
    if (activeSearchQuery) {
      const match = g.title.toLowerCase().includes(activeSearchQuery) ||
                    g.description.toLowerCase().includes(activeSearchQuery) ||
                    g.location.toLowerCase().includes(activeSearchQuery) ||
                    g.id.toLowerCase().includes(activeSearchQuery) ||
                    g.trackingCode.toLowerCase().includes(activeSearchQuery) ||
                    g.studentName.toLowerCase().includes(activeSearchQuery);
      if (!match) return false;
    }
    return true;
  });

  const countEl = document.getElementById("adminRecordCount");
  if (countEl) countEl.textContent = `${filtered.length} Grievances Shown`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
          No grievances match your selected filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(g => {
    const sla = window.CampusResolve.calculateSLA(g);
    const isAnon = g.isAnonymous;

    return `
      <tr>
        <!-- ID & Code -->
        <td>
          <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.8rem; background: var(--bg-subtle); padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border-subtle); display: inline-block;">
            ${isAnon ? '🛡️ ' + g.trackingCode : g.id}
          </span>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">${g.category}</div>
        </td>

        <!-- Complainant -->
        <td>
          <div style="font-weight: 600; font-size: 0.84rem;">
            ${isAnon ? '<span style="color: var(--accent-cyan); font-weight: 700;">Zero-Knowledge Whistleblower</span>' : g.studentName}
          </div>
          <div style="font-size: 0.72rem; color: var(--text-muted);">
            ${isAnon ? 'Identity Cryptographically Stripped' : (g.studentRoll || 'Student')}
          </div>
        </td>

        <!-- Headline & Location -->
        <td style="max-width: 280px;">
          <div style="font-weight: 600; font-size: 0.86rem; color: var(--text-primary); margin-bottom: 2px;">
            ${g.title}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">
            📍 ${g.location}
          </div>
        </td>

        <!-- AI Urgency -->
        <td>
          <span class="badge badge-${g.urgency.toLowerCase()}">
            <span class="badge-dot"></span>
            ${g.urgency}
          </span>
        </td>

        <!-- Dynamic SLA & Auto-Escalation Tier -->
        <td>
          <div style="font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${sla.isBreached ? 'var(--priority-critical)' : 'var(--text-primary)'};">
            ${sla.displayTime}
          </div>
          <div style="font-size: 0.7rem; color: ${sla.currentTier >= 3 ? 'var(--priority-critical)' : 'var(--text-muted)'}; font-weight: 600;">
            ${sla.tierName.split(':')[0]}
          </div>
        </td>

        <!-- Status -->
        <td>
          <span class="badge-status ${g.status}">${formatStatus(g.status)}</span>
        </td>

        <!-- Actions -->
        <td>
          <button class="btn btn-primary btn-sm" onclick="openAdminTriageModal('${g.id}')">
            Triage & Action ⚙️
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

/**
 * Admin Triage & Action Modal
 */
let currentTriageGrievanceId = null;

function openAdminTriageModal(id) {
  const g = window.CampusResolve.getGrievanceById(id);
  if (!g) return;

  currentTriageGrievanceId = g.id;
  const modal = document.getElementById("adminTriageModal");
  const sla = window.CampusResolve.calculateSLA(g);

  document.getElementById("modalTriageId").textContent = g.isAnonymous ? '🛡️ ' + g.trackingCode : g.id;
  document.getElementById("modalTriageTitle").textContent = g.title;
  document.getElementById("modalTriageDesc").textContent = g.description;
  document.getElementById("modalTriageLocation").textContent = g.location;
  document.getElementById("modalTriageCategory").textContent = g.category;
  document.getElementById("modalTriageDepartment").textContent = g.department;
  document.getElementById("modalTriageStudent").textContent = g.isAnonymous ? "Zero-Knowledge Whistleblower (Confidential)" : `${g.studentName} (${g.studentRoll})`;
  document.getElementById("modalTriageSla").textContent = `${sla.displayTime} • Current Escalation: ${sla.tierName}`;

  // Audio Player Preview
  const audioBox = document.getElementById("modalAudioPreviewBox");
  if (g.evidence && g.evidence.hasAudio) {
    audioBox.style.display = "block";
    audioBox.innerHTML = `
      <div style="background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.3); border-radius: 10px; padding: 12px 14px; display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.5rem;">🎙️</span>
          <div>
            <div style="font-weight:700; font-size:0.82rem;">Student Voice Recording (${g.evidence.audioDuration || '0:24'})</div>
            <div style="font-size:0.72rem; color:var(--text-muted);">Recorded live in-browser via Web Audio</div>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="playSimulatedAudio(this)">▶ Play Recording</button>
      </div>
    `;
  } else {
    audioBox.style.display = "none";
  }

  // Pre-fill form
  document.getElementById("triageStatusSelect").value = g.status;
  document.getElementById("triageAssignedOfficer").value = g.assignedTo;
  document.getElementById("triageAdminNote").value = g.resolutionProof ? g.resolutionProof.note : "";

  // Render audit history
  const auditContainer = document.getElementById("modalAuditStepper");
  auditContainer.innerHTML = g.timeline.map(step => `
    <div class="timeline-step completed">
      <div class="timeline-step-title">${step.title}</div>
      <div class="timeline-step-time">${step.time}</div>
      <div class="timeline-step-desc">${step.desc}</div>
    </div>
  `).join("");

  modal.classList.add("open");
}

function playSimulatedAudio(btn) {
  btn.textContent = "🔊 Playing Audio...";
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = "▶ Replay Recording";
    btn.disabled = false;
  }, 2500);
}

async function saveTriageChanges() {
  if (!currentTriageGrievanceId) return;

  const newStatus = document.getElementById("triageStatusSelect").value;
  const officer = document.getElementById("triageAssignedOfficer").value.trim();
  const note = document.getElementById("triageAdminNote").value.trim();

  await window.CampusResolve.updateGrievanceStatus(currentTriageGrievanceId, newStatus, note, officer);
  closeModal("adminTriageModal");
  showToast("Grievance updated and logged into immutable audit registry.", "success");

  renderAdminKPIs();
  renderHotspotMatrix();
  renderGrievanceTable();
}

/**
 * Real CSV Data Export for Collegiate Audit
 */
function exportGrievancesCSV() {
  const all = window.CampusResolve.getAllGrievances();
  if (!all || all.length === 0) {
    showToast("No grievance records to export.", "error");
    return;
  }

  // Direct backend export endpoint or fallback blob download
  try {
    window.location.href = "/api/export/csv";
  } catch (e) {
    const header = ['ID', 'TrackingCode', 'Complainant', 'Category', 'Urgency', 'Status', 'AssignedTo', 'Location'];
    const rows = all.map(g => [
      g.id,
      g.trackingCode,
      `"${g.isAnonymous ? 'Anonymous' : g.studentName}"`,
      `"${g.category}"`,
      g.urgency,
      g.status,
      `"${g.assignedTo}"`,
      `"${g.location}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [header.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CampusResolve_Grievances_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
window.exportGrievancesCSV = exportGrievancesCSV;

/**
 * Print & Export Collegiate Grievance Dossier PDF
 */
function exportDossierPDF() {
  if (!currentTriageGrievanceId) return;
  const g = window.CampusResolve.getGrievanceById(currentTriageGrievanceId);
  if (!g) return;

  const printWindow = window.open("", "_blank");
  const sla = window.CampusResolve.calculateSLA(g);

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Official Grievance Dossier - ${g.id}</title>
      <style>
        body { font-family: sans-serif; padding: 40px; color: #111; line-height: 1.5; }
        .header { border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
        .qr-placeholder { border: 2px solid #000; padding: 10px; font-size: 11px; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th, td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; font-size: 13px; }
        th { background: #f0f0f0; }
        .timeline-box { margin-top: 20px; font-size: 12px; }
        .sig-block { margin-top: 60px; display: flex; justify-content: space-between; }
        .sig-line { width: 220px; border-top: 1px solid #000; text-align: center; padding-top: 5px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h2 style="margin:0;">NATIONAL INSTITUTE GRIEVANCE REDRESSAL DOCKET</h2>
          <div style="font-size: 12px;">Office of the Dean (Student Welfare) & Grievance Redressal Cell</div>
        </div>
        <div class="qr-placeholder">
          <div>[ OFFICIAL QR VERIFIED ]</div>
          <div style="font-family: monospace; font-weight: bold; margin-top: 4px;">${g.id}</div>
        </div>
      </div>

      <table>
        <tr><th>Docket Case ID</th><td>${g.id} (${g.trackingCode})</td></tr>
        <tr><th>Complainant Name</th><td>${g.isAnonymous ? "Zero-Knowledge Whistleblower (Identity Protected under UGC Mandate)" : g.studentName}</td></tr>
        <tr><th>Scholar / Roll No.</th><td>${g.isAnonymous ? "CONFIDENTIAL" : g.studentRoll}</td></tr>
        <tr><th>Category & Urgency</th><td>${g.category} (AI Urgency Score: ${g.urgency})</td></tr>
        <tr><th>Campus Location</th><td>${g.location}</td></tr>
        <tr><th>Assigned Officer</th><td>${g.assignedTo} (${g.department})</td></tr>
        <tr><th>Current Status</th><td><strong>${g.status.toUpperCase()}</strong></td></tr>
      </table>

      <h4 style="margin-top:20px; margin-bottom:6px;">Case Description:</h4>
      <div style="background: #f9f9f9; padding: 12px; border: 1px solid #ddd; font-size: 13px;">${g.description}</div>

      <h4 style="margin-top:20px; margin-bottom:6px;">Chronological Action Audit Trail:</h4>
      <div class="timeline-box">
        ${g.timeline.map(t => `<div>• <strong>${t.time}</strong> - ${t.title}: ${t.desc}</div>`).join("")}
      </div>

      <div class="sig-block">
        <div class="sig-line">Investigating Officer / Caretaker</div>
        <div class="sig-line">Head of Department / Warden</div>
        <div class="sig-line">Dean of Student Welfare</div>
      </div>

      <script>
        window.print();
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function formatStatus(status) {
  if (status === "pending-verification") return "Pending Verification";
  if (status === "in-progress") return "In Progress";
  if (status === "in-review") return "In Review";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("open");
}

window.openAdminTriageModal = openAdminTriageModal;
window.saveTriageChanges = saveTriageChanges;
window.exportDossierPDF = exportDossierPDF;
window.playSimulatedAudio = playSimulatedAudio;
window.closeModal = closeModal;
window.renderGrievanceTable = renderGrievanceTable;
window.renderAdminKPIs = renderAdminKPIs;
window.renderHotspotMatrix = renderHotspotMatrix;
