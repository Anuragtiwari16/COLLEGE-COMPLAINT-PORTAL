/**
 * CampusResolve - Common Utilities & Real-Time Live Notification Controller
 * Institutional Edition
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initToastContainer();
  initRealTimeListeners();
});

/**
 * Theme Controller (Dark / Light)
 */
function initTheme() {
  const savedTheme = localStorage.getItem("campusresolve_theme_mode") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }

  updateThemeToggleLabels(document.body.classList.contains("dark-mode"));
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("campusresolve_theme_mode", isDark ? "dark" : "light");
  updateThemeToggleLabels(isDark);
  if (typeof showToast === 'function') {
    showToast(isDark ? "🌙 Dark Mode activated" : "☀️ Light Mode activated", "info", 2000);
  }
}

function updateThemeToggleLabels(isDark) {
  const toggles = document.querySelectorAll(".theme-toggle-btn");
  toggles.forEach(btn => {
    btn.innerHTML = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    btn.title = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    btn.onclick = toggleTheme;
  });
}

window.toggleTheme = toggleTheme;
window.initTheme = initTheme;

/**
 * Real-Time Live Event Subscriber
 */
function initRealTimeListeners() {
  if (!window.CampusResolve) return;

  window.CampusResolve.on((type, payload) => {
    if (type === 'NEW_GRIEVANCE') {
      const isCritical = payload.urgency === 'Critical';
      showToast(
        `${isCritical ? '🚨 [CRITICAL ALERT]' : '📥 [NEW GRIEVANCE]'} ${payload.title} in ${payload.location}`,
        isCritical ? 'error' : 'info',
        6000
      );

      // Trigger automatic UI refresh if on admin or student page
      if (typeof renderGrievanceTable === 'function') renderGrievanceTable();
      if (typeof renderAdminKPIs === 'function') renderAdminKPIs();
      if (typeof renderHotspotMatrix === 'function') renderHotspotMatrix();
      if (typeof renderPublicWall === 'function') renderPublicWall();
    } else if (type === 'STATUS_UPDATED') {
      showToast(
        `🔔 [STATUS UPDATED] "${payload.title}" is now "${payload.status.toUpperCase()}".`,
        'success',
        5000
      );

      if (typeof renderMyGrievances === 'function') renderMyGrievances();
      if (typeof renderStudentStats === 'function') renderStudentStats();
      if (typeof renderGrievanceTable === 'function') renderGrievanceTable();
      if (typeof renderAdminKPIs === 'function') renderAdminKPIs();
    } else if (type === 'VERIFICATION_UPDATED') {
      const isConfirmed = payload.studentVerification && payload.studentVerification.confirmed;
      showToast(
        isConfirmed
          ? `✅ [VERIFIED] Student confirmed resolution for "${payload.title}" (${payload.studentVerification.rating} ★)`
          : `⚠️ [DISPUTED] Student reopened "${payload.title}" (Escalated to Level ${payload.currentEscalationLevel})`,
        isConfirmed ? 'success' : 'error',
        6000
      );

      if (typeof renderMyGrievances === 'function') renderMyGrievances();
      if (typeof renderStudentStats === 'function') renderStudentStats();
      if (typeof renderGrievanceTable === 'function') renderGrievanceTable();
      if (typeof renderAdminKPIs === 'function') renderAdminKPIs();
    } else if (type === 'UPVOTE_UPDATED') {
      if (typeof renderPublicWall === 'function') renderPublicWall();
      if (typeof renderMyGrievances === 'function') renderMyGrievances();
    }
  });
}

/**
 * Toast Notification System
 */
let toastContainer;
function initToastContainer() {
  if (document.getElementById("cr-toast-container")) return;
  toastContainer = document.createElement("div");
  toastContainer.id = "cr-toast-container";
  toastContainer.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
    max-width: 420px;
  `;
  document.body.appendChild(toastContainer);
}

function showToast(message, type = "info", duration = 4500) {
  initToastContainer();
  const toast = document.createElement("div");
  toast.style.cssText = `
    pointer-events: auto;
    padding: 14px 18px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    box-shadow: 0 14px 35px rgba(0,0,0,0.25);
    background: var(--bg-surface);
    color: var(--text-primary);
    border: 1px solid var(--border-subtle);
    border-left: 5px solid ${type === 'success' ? 'var(--accent-emerald)' : type === 'error' ? 'var(--priority-critical)' : 'var(--primary-600)'};
    animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    gap: 10px;
  `;

  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : '⚡';
  toast.innerHTML = `<span style="font-size:1.2rem;">${icon}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/**
 * In-Browser Audio Voice Memo Recorder & Waveform Engine
 */
class VoiceMemoRecorder {
  constructor(canvasId, timerId) {
    this.canvas = document.getElementById(canvasId);
    this.timerEl = document.getElementById(timerId);
    this.isRecording = false;
    this.duration = 0;
    this.timerInterval = null;
    this.animationFrame = null;
  }

  async start() {
    this.isRecording = true;
    this.duration = 0;
    if (this.timerEl) this.timerEl.textContent = "00:00";

    this.timerInterval = setInterval(() => {
      this.duration++;
      const mins = String(Math.floor(this.duration / 60)).padStart(2, "0");
      const secs = String(this.duration % 60).padStart(2, "0");
      if (this.timerEl) this.timerEl.textContent = `${mins}:${secs}`;
    }, 1000);

    this.drawWaveform();
  }

  stop() {
    this.isRecording = false;
    clearInterval(this.timerInterval);
    cancelAnimationFrame(this.animationFrame);

    const mins = Math.floor(this.duration / 60);
    const secs = String(this.duration % 60).padStart(2, "0");
    const durStr = `${mins}:${secs}`;

    return {
      hasAudio: true,
      duration: durStr || "0:12",
      url: "voice_evidence_recording.wav"
    };
  }

  drawWaveform() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext("2d");
    const width = this.canvas.width;
    const height = this.canvas.height;

    const render = () => {
      if (!this.isRecording) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#6366f1";

      const bars = 32;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i++) {
        const barHeight = Math.random() * (height * 0.8) + 4;
        const x = i * barWidth;
        const y = (height - barHeight) / 2;
        ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
      }

      this.animationFrame = requestAnimationFrame(render);
    };

    render();
  }
}

window.VoiceMemoRecorder = VoiceMemoRecorder;
window.showToast = showToast;
window.toggleTheme = toggleTheme;
