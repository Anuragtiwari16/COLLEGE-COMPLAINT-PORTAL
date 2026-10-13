/**
 * CampusResolve AI - Student Portal Controller
 * Complete State Interactivity, Live AI Urgency Feedback, Voice Memos, Two-Way Verification
 */

let activeVoiceRecorder = null;
let recordedAudioData = null;
let uploadedImages = [];

document.addEventListener("DOMContentLoaded", () => {
  renderStudentProfile();
  renderStudentStats();
  renderMyGrievances();
  renderPublicWall();
  initFormInteractivity();
  checkUrlParamsForTracking();
});

function renderStudentProfile() {
  const user = window.CampusResolve.getCurrentUser();
  const profileNameEl = document.getElementById("profileStudentName");
  const profileDetailsEl = document.getElementById("profileStudentDetails");
  const profileAvatarEl = document.getElementById("profileAvatar");

  if (profileNameEl) profileNameEl.textContent = user.name;
  if (profileDetailsEl) {
    profileDetailsEl.textContent = `${user.rollNumber || "ID: 22CS049"} • ${user.department || "Computer Science"} • ${user.badge || "Student"}`;
  }
  if (profileAvatarEl) profileAvatarEl.textContent = user.avatar || "👨‍🎓";
}

function renderStudentStats() {
  const user = window.CampusResolve.getCurrentUser();
  const all = window.CampusResolve.getAllGrievances();
  const myComplaints = all.filter(g => g.studentEmail === user.email || g.studentName === user.name);

  const totalEl = document.getElementById("statMyTotal");
  const inProgEl = document.getElementById("statMyInProgress");
  const verificationEl = document.getElementById("statMyPendingVerification");
  const resolvedEl = document.getElementById("statMyResolved");

  const total = myComplaints.length;
  const inProg = myComplaints.filter(g => g.status === "in-progress" || g.status === "pending").length;
  const needVerification = myComplaints.filter(g => g.status === "pending-verification").length;
  const resolved = myComplaints.filter(g => g.status === "resolved").length;

  if (totalEl) totalEl.textContent = total;
  if (inProgEl) inProgEl.textContent = inProg;
  if (verificationEl) {
    verificationEl.textContent = needVerification;
    if (needVerification > 0) {
      verificationEl.parentElement.classList.add("pulse-highlight");
    }
  }
  if (resolvedEl) resolvedEl.textContent = resolved;
}

function initFormInteractivity() {
  const titleInput = document.getElementById("complaintTitle");
  const descInput = document.getElementById("complaintDesc");
  const catInput = document.getElementById("complaintCategory");
  const locInput = document.getElementById("complaintLocation");
  const anonToggle = document.getElementById("anonToggle");

  const aiBox = document.getElementById("aiLiveUrgencyBox");
  const duplicateBox = document.getElementById("duplicateAlertBox");

  const updateAI = () => {
    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    const cat = catInput.value;
    const loc = locInput.value.trim();

    if (!title && !desc) {
      if (aiBox) aiBox.style.display = "none";
      if (duplicateBox) duplicateBox.style.display = "none";
      return;
    }

    // Run AI Urgency Engine
    const analysis = window.CampusResolveAI.analyze(`${title} ${desc}`, cat);
    if (aiBox) {
      aiBox.style.display = "flex";
      aiBox.innerHTML = `
        <div class="ai-feedback-header">
          <span style="display:flex; align-items:center; gap:6px;">
            🤖 AI Real-Time Triage Assessment:
            <span class="badge badge-${analysis.badgeColor}">${analysis.urgency} Urgency</span>
          </span>
          <span style="font-size:0.75rem; color:var(--text-muted);">SLA Target: ${analysis.slaHours} Hours</span>
        </div>
        <div class="ai-feedback-body">
          <p><strong>Auto-Routing To:</strong> ${analysis.department}</p>
          <p style="margin-top:4px;">${analysis.rationale}</p>
          <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">💡 Action Rule: ${analysis.suggestedAction}</p>
        </div>
      `;
    }

    // Check for Duplicates in same campus location
    const duplicates = window.CampusResolveAI.findDuplicates(title, desc, loc, window.CampusResolve.getAllGrievances());
    if (duplicateBox) {
      if (duplicates.length > 0) {
        const topMatch = duplicates[0];
        duplicateBox.style.display = "block";
        duplicateBox.innerHTML = `
          <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 12px; padding: 12px 16px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
            <div>
              <div style="font-weight:700; color:#d97706; font-size:0.84rem; display:flex; align-items:center; gap:6px;">
                ⚠️ Potential Duplicate Issue Detected (${topMatch.similarity}% match)
              </div>
              <div style="font-size:0.8rem; color:var(--text-primary); margin-top:3px;">
                "${topMatch.grievance.title}" in <strong>${topMatch.grievance.location}</strong> (${topMatch.grievance.upvotes} student upvotes)
              </div>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" onclick="upvoteAndLink('${topMatch.grievance.id}')">
              👍 Upvote Existing Ticket Instead
            </button>
          </div>
        `;
      } else {
        duplicateBox.style.display = "none";
      }
    }
  };

  if (titleInput) titleInput.addEventListener("input", updateAI);
  if (descInput) descInput.addEventListener("input", updateAI);
  if (catInput) catInput.addEventListener("change", updateAI);
  if (locInput) locInput.addEventListener("input", updateAI);

  if (anonToggle) {
    anonToggle.addEventListener("change", (e) => {
      const banner = document.getElementById("anonExplainerBanner");
      if (banner) {
        banner.style.display = e.target.checked ? "block" : "none";
      }
    });
  }

  // Audio Voice Memo Button
  const recordBtn = document.getElementById("recordVoiceBtn");
  const stopBtn = document.getElementById("stopVoiceBtn");
  if (recordBtn && stopBtn) {
    recordBtn.addEventListener("click", () => {
      activeVoiceRecorder = new VoiceMemoRecorder("voiceWaveformCanvas", "voiceRecordTimer");
      activeVoiceRecorder.start();
      recordBtn.style.display = "none";
      stopBtn.style.display = "inline-flex";
      document.getElementById("voiceRecorderContainer").style.display = "block";
    });

    stopBtn.addEventListener("click", () => {
      if (activeVoiceRecorder) {
        recordedAudioData = activeVoiceRecorder.stop();
        stopBtn.style.display = "none";
        recordBtn.style.display = "inline-flex";
        recordBtn.innerHTML = `🎙️ Voice Note Attached (${recordedAudioData.duration}) ✅`;
        recordBtn.classList.add("btn-success");
        showToast("Voice memo recorded & attached to case evidence!", "success");
      }
    });
  }

  // Image Upload Simulation
  const fileInput = document.getElementById("evidenceFileInput");
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        uploadedImages = ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80"];
        const previewEl = document.getElementById("imagePreviewList");
        if (previewEl) {
          previewEl.innerHTML = `
            <div style="font-size:0.75rem; color:var(--accent-emerald); font-weight:600; display:flex; align-items:center; gap:6px;">
              📷 ${files.length} Photo Evidence Attached
            </div>
          `;
        }
      }
    });
  }

  // Grievance Form Submit
  const form = document.getElementById("newGrievanceForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = "⏳ Submitting & Routing...";

      try {
        const title = titleInput.value.trim();
        const description = descInput.value.trim();
        const category = catInput.value;
        const location = locInput.value.trim();
        const isAnonymous = anonToggle ? anonToggle.checked : false;

        const newTicket = await window.CampusResolve.addGrievance({
          title,
          description,
          category,
          location,
          isAnonymous,
          hasAudio: !!recordedAudioData,
          audioDuration: recordedAudioData ? recordedAudioData.duration : null,
          images: uploadedImages
        });

        // Show Docket Confirmation Modal
        showDocketModal(newTicket);

        // Reset form
        form.reset();
        recordedAudioData = null;
        uploadedImages = [];
        if (aiBox) aiBox.style.display = "none";
        if (duplicateBox) duplicateBox.style.display = "none";
        if (recordBtn) {
          recordBtn.innerHTML = "🎙️ Record Voice Memo";
          recordBtn.classList.remove("btn-success");
        }
        document.getElementById("voiceRecorderContainer").style.display = "none";

        renderStudentStats();
        renderMyGrievances();
        renderPublicWall();
      } catch (err) {
        showToast("Error lodging grievance. Please retry.", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }
}

function upvoteAndLink(grievanceId) {
  const user = window.CampusResolve.getCurrentUser();
  window.CampusResolve.upvoteGrievance(grievanceId, user.id);
  showToast("Upvoted existing grievance! You will receive notification updates.", "success");
  switchStudentTab("myGrievancesTab");
  renderPublicWall();
  renderMyGrievances();
}

function renderMyGrievances(filter = "all") {
  const container = document.getElementById("myGrievancesList");
  if (!container) return;

  const user = window.CampusResolve.getCurrentUser();
  const all = window.CampusResolve.getAllGrievances();
  
  let list = all.filter(g => g.studentEmail === user.email || g.studentName === user.name || (user.id === "user_anon" && g.isAnonymous));

  if (filter === "in-progress") {
    list = list.filter(g => g.status === "in-progress" || g.status === "pending");
  } else if (filter === "verification") {
    list = list.filter(g => g.status === "pending-verification");
  } else if (filter === "resolved") {
    list = list.filter(g => g.status === "resolved");
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="glass-card" style="padding: 40px; text-align: center; color: var(--text-muted);">
        <div style="font-size: 2.2rem; margin-bottom: 10px;">📋</div>
        <h4 style="color: var(--text-primary); margin-bottom: 6px;">No Grievances Found</h4>
        <p style="font-size: 0.85rem;">You do not have any complaints in this status. Use the "Lodge Grievance" tab to file an issue.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(g => {
    const sla = window.CampusResolve.calculateSLA(g);
    const isVerificationNeeded = g.status === "pending-verification";

    return `
      <div class="glass-card" style="padding: 22px; margin-bottom: 16px; border-left: 5px solid ${g.urgency === 'Critical' ? 'var(--priority-critical)' : g.urgency === 'High' ? 'var(--priority-high)' : 'var(--primary-600)'};">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-bottom: 10px;">
          <div style="display:flex; align-items:center; gap: 8px;">
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 0.82rem; background: var(--bg-subtle); padding: 3px 8px; border-radius: 6px; border: 1px solid var(--border-subtle);">
              ${g.isAnonymous ? '🛡️ ' + g.trackingCode : g.id}
            </span>
            <span class="badge badge-${g.urgency.toLowerCase()}">${g.urgency}</span>
            <span style="font-size: 0.78rem; color: var(--text-muted);">${g.category}</span>
          </div>
          <span class="badge-status ${g.status}">${formatStatus(g.status)}</span>
        </div>

        <h3 style="font-size: 1.1rem; margin-bottom: 6px; color: var(--text-primary);">${g.title}</h3>
        <p style="font-size: 0.86rem; color: var(--text-secondary); margin-bottom: 12px;">${g.description}</p>

        <!-- SLA Progress & Escalation Matrix Banner -->
        <div class="sla-bar-container">
          <div class="sla-bar-header">
            <span><strong>⏱️ SLA Escalation:</strong> ${sla.tierName}</span>
            <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${sla.isBreached ? 'var(--priority-critical)' : 'var(--text-primary)'};">
              ${sla.displayTime}
            </span>
          </div>
          <div class="sla-track">
            <div class="sla-progress-fill" style="width: ${sla.percent}%; background: ${sla.isBreached ? 'var(--priority-critical)' : sla.percent > 75 ? 'var(--accent-amber)' : 'var(--accent-emerald)'};"></div>
          </div>
        </div>

        <!-- Two-Way Resolution Confirmation Prompt if Admin marked resolved -->
        ${isVerificationNeeded ? `
          <div style="background: rgba(6, 182, 212, 0.1); border: 2px solid rgba(6, 182, 212, 0.4); border-radius: 14px; padding: 16px; margin: 16px 0; animation: fadeIn 0.4s ease;">
            <div style="font-weight: 700; color: #0891b2; font-size: 0.9rem; margin-bottom: 4px; display:flex; align-items:center; gap:6px;">
              🔔 Two-Way Resolution Confirmation Required
            </div>
            <p style="font-size: 0.82rem; margin-bottom: 10px;">
              Admin submitted the following resolution note: <em>"${g.resolutionProof ? g.resolutionProof.note : 'Action completed on-site.'}"</em>
            </p>
            <div style="display:flex; gap: 10px; flex-wrap:wrap;">
              <button class="btn btn-success btn-sm" onclick="openStudentVerificationModal('${g.id}', true)">
                ✅ Confirm Resolution & Rate
              </button>
              <button class="btn btn-danger btn-sm" onclick="openStudentVerificationModal('${g.id}', false)">
                ❌ Dispute & Reopen Ticket
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Card Footer -->
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-subtle); font-size: 0.78rem; color: var(--text-muted);">
          <div style="display:flex; gap: 14px; flex-wrap:wrap;">
            <span>📍 ${g.location}</span>
            <span>🏛️ ${g.department}</span>
            <span>👤 ${g.assignedTo}</span>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="openGrievanceDetailsModal('${g.id}')">
            View Docket & Timeline →
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function renderPublicWall() {
  const container = document.getElementById("publicWallList");
  if (!container) return;

  const all = window.CampusResolve.getAllGrievances();
  const publicList = all.filter(g => g.isPublic);

  const currentUser = window.CampusResolve.getCurrentUser();

  container.innerHTML = publicList.map(g => {
    const isUpvoted = g.upvotedBy && g.upvotedBy.includes(currentUser.id);
    return `
      <div class="glass-card" style="padding: 20px; margin-bottom: 14px; display: flex; gap: 16px;">
        <!-- Upvote Action Box -->
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 58px; background: var(--bg-subtle); border-radius: 12px; padding: 8px 6px; border: 1px solid var(--border-subtle);">
          <button class="btn-ghost" style="padding: 4px; font-size: 1.2rem; cursor: pointer;" onclick="toggleWallUpvote('${g.id}')">
            ${isUpvoted ? '▲' : '△'}
          </button>
          <span style="font-weight: 800; font-size: 0.95rem; color: ${isUpvoted ? 'var(--primary-600)' : 'var(--text-primary)'};">
            ${g.upvotes}
          </span>
          <span style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase;">Votes</span>
        </div>

        <!-- Content -->
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span class="badge badge-${g.urgency.toLowerCase()}">${g.category}</span>
            <span class="badge-status ${g.status}">${formatStatus(g.status)}</span>
          </div>
          <h4 style="font-size: 1.05rem; margin-bottom: 6px;">${g.title}</h4>
          <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 8px;">${g.description}</p>
          <div style="font-size: 0.76rem; color: var(--text-muted); display:flex; gap: 12px;">
            <span>📍 ${g.location}</span>
            <span>🏛️ ${g.department}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function toggleWallUpvote(id) {
  const user = window.CampusResolve.getCurrentUser();
  window.CampusResolve.upvoteGrievance(id, user.id);
  renderPublicWall();
  renderMyGrievances();
}

/**
 * Two-Way Resolution Modal (Confirm or Dispute)
 */
function openStudentVerificationModal(id, isConfirm) {
  const g = window.CampusResolve.getGrievanceById(id);
  if (!g) return;

  const modal = document.getElementById("verificationModal");
  const titleEl = document.getElementById("verifModalTitle");
  const bodyEl = document.getElementById("verifModalBody");

  if (isConfirm) {
    titleEl.textContent = "Confirm Resolution & Rate Service";
    bodyEl.innerHTML = `
      <p style="font-size: 0.88rem; margin-bottom: 14px;">
        You are confirming that the issue reported in <strong>"${g.title}"</strong> has been successfully fixed.
      </p>
      <div class="form-group">
        <label class="form-label">How satisfied are you with the redressal?</label>
        <div style="display:flex; gap: 8px; font-size: 1.5rem; cursor: pointer; margin-bottom: 8px;" id="starRatingBox">
          <span onclick="setRating(1)">⭐</span>
          <span onclick="setRating(2)">⭐</span>
          <span onclick="setRating(3)">⭐</span>
          <span onclick="setRating(4)">⭐</span>
          <span onclick="setRating(5)">⭐</span>
        </div>
        <input type="hidden" id="verifRatingValue" value="5" />
      </div>
      <div class="form-group">
        <label class="form-label">Optional Feedback for Administrative Record</label>
        <textarea id="verifFeedbackText" class="form-textarea" placeholder="e.g. Prompt fix, technician was courteous."></textarea>
      </div>
      <button class="btn btn-success" style="width:100%;" onclick="submitVerification('${g.id}', true)">
        Confirm Closure & Submit Feedback
      </button>
    `;
  } else {
    titleEl.textContent = "Dispute Resolution & Reopen Ticket";
    bodyEl.innerHTML = `
      <p style="font-size: 0.88rem; margin-bottom: 14px; color: var(--priority-critical);">
        ⚠️ If the issue still persists, please describe what remains unfixed. The ticket will be auto-escalated to higher authority.
      </p>
      <div class="form-group">
        <label class="form-label">Why is this issue still unresolved?</label>
        <textarea id="verifFeedbackText" class="form-textarea" placeholder="e.g. Water is still leaking from the main pipe underneath." required></textarea>
      </div>
      <button class="btn btn-danger" style="width:100%;" onclick="submitVerification('${g.id}', false)">
        Reopen Ticket with Escalation
      </button>
    `;
  }

  modal.classList.add("open");
}

function setRating(val) {
  document.getElementById("verifRatingValue").value = val;
  const stars = document.getElementById("starRatingBox").children;
  for (let i = 0; i < 5; i++) {
    stars[i].style.opacity = i < val ? "1" : "0.3";
  }
}

async function submitVerification(id, confirmed) {
  const ratingEl = document.getElementById("verifRatingValue");
  const rating = ratingEl ? parseInt(ratingEl.value) : 5;
  const feedback = document.getElementById("verifFeedbackText").value.trim();

  await window.CampusResolve.studentVerifyResolution(id, confirmed, rating, feedback);
  closeModal("verificationModal");
  showToast(confirmed ? "Grievance marked closed. Thank you for verifying!" : "Ticket reopened and escalated to department head.", confirmed ? "success" : "error");

  renderStudentStats();
  renderMyGrievances();
}

/**
 * Docket Summary & Case Timeline Modal
 */
function openGrievanceDetailsModal(id) {
  const g = window.CampusResolve.getGrievanceById(id);
  if (!g) return;

  const modal = document.getElementById("detailsModal");
  const sla = window.CampusResolve.calculateSLA(g);

  document.getElementById("detailsModalBody").innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span style="font-family:'JetBrains Mono', monospace; font-size:0.85rem; font-weight:700;">${g.isAnonymous ? '🛡️ ' + g.trackingCode : g.id}</span>
      <span class="badge-status ${g.status}">${formatStatus(g.status)}</span>
    </div>
    <h3 style="font-size:1.2rem; margin-bottom:8px;">${g.title}</h3>
    <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:14px;">${g.description}</p>

    <div style="background:var(--bg-subtle); border-radius:12px; padding:12px 14px; margin-bottom:18px; font-size:0.8rem; display:grid; grid-template-columns:1fr 1fr; gap:8px;">
      <div><strong>Urgency:</strong> <span class="badge badge-${g.urgency.toLowerCase()}">${g.urgency}</span></div>
      <div><strong>Location:</strong> ${g.location}</div>
      <div><strong>Routed Dept:</strong> ${g.department}</div>
      <div><strong>Assigned Officer:</strong> ${g.assignedTo}</div>
      <div><strong>SLA Status:</strong> ${sla.displayTime}</div>
      <div><strong>Current Level:</strong> ${sla.tierName}</div>
    </div>

    <h4 style="font-size:0.95rem; margin-bottom:8px;">Activity Audit Timeline</h4>
    <div class="timeline-stepper">
      ${g.timeline.map((step, idx) => `
        <div class="timeline-step completed">
          <div class="timeline-step-title">${step.title}</div>
          <div class="timeline-step-time">${step.time}</div>
          <div class="timeline-step-desc">${step.desc}</div>
        </div>
      `).join("")}
    </div>

    <!-- Live Case Inquiry & Remarks Thread -->
    <div style="border-top:1px solid var(--border-subtle); margin-top:20px; padding-top:16px;">
      <h4 style="font-size:0.95rem; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
        <span>💬 Progress Remarks & Inquiry Thread</span>
        <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">Live Synchronized</span>
      </h4>
      <div id="modalCommentsThread" style="max-height:180px; overflow-y:auto; margin-bottom:12px; display:flex; flex-direction:column; gap:8px;">
        ${(g.comments && g.comments.length > 0) ? g.comments.map(c => `
          <div style="padding:10px 12px; background:var(--bg-subtle); border-radius:10px; font-size:0.8rem; border-left:3px solid var(--primary-500);">
            <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:2px; font-size:0.75rem;">
              <span>${c.author} <span style="font-weight:normal; color:var(--text-muted);">(${c.authorRole})</span></span>
              <span style="color:var(--text-muted);">${new Date(c.createdAt).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</span>
            </div>
            <div>${c.text}</div>
          </div>
        `).join("") : '<div style="font-size:0.78rem; color:var(--text-muted); padding:6px 0;">No inquiries or notes added yet. Post a question below.</div>'}
      </div>

      <div style="display:flex; gap:8px;">
        <input type="text" id="newCommentInput_${g.id}" class="form-input" placeholder="Type an inquiry or progress follow-up..." style="font-size:0.82rem; padding:8px 12px;" onkeydown="if(event.key==='Enter'){ submitCaseComment('${g.id}'); }" />
        <button class="btn btn-primary btn-sm" onclick="submitCaseComment('${g.id}')">Post</button>
      </div>
    </div>
  `;

  modal.classList.add("open");
}

async function submitCaseComment(grievanceId) {
  const input = document.getElementById(`newCommentInput_${grievanceId}`);
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = "";

  const user = window.CampusResolve.getCurrentUser();
  await window.CampusResolve.addComment(grievanceId, text, user.name, user.badge || "Student");

  showToast("Comment added to case record!", "success");
  openGrievanceDetailsModal(grievanceId);
}
window.submitCaseComment = submitCaseComment;

function showDocketModal(ticket) {
  const modal = document.getElementById("docketSuccessModal");
  if (!modal) return;

  document.getElementById("docketCodeDisplay").textContent = ticket.isAnonymous ? ticket.trackingCode : ticket.id;
  document.getElementById("docketAnonNotice").style.display = ticket.isAnonymous ? "block" : "none";

  modal.classList.add("open");
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("open");
}

function switchStudentTab(tabId) {
  const tabs = ["lodgeTab", "myGrievancesTab", "publicWallTab", "anonTrackTab"];
  tabs.forEach(t => {
    const btn = document.getElementById(`btn-${t}`);
    const sec = document.getElementById(`sec-${t}`);
    if (btn) btn.classList.remove("active");
    if (sec) sec.style.display = "none";
  });

  const activeBtn = document.getElementById(`btn-${tabId}`);
  const activeSec = document.getElementById(`sec-${tabId}`);
  if (activeBtn) activeBtn.classList.add("active");
  if (activeSec) activeSec.style.display = "block";
}

function formatStatus(status) {
  if (status === "pending-verification") return "Pending Your Verification";
  if (status === "in-progress") return "In Progress";
  if (status === "in-review") return "Under Review";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function checkUrlParamsForTracking() {
  const params = new URLSearchParams(window.location.search);
  const trackCode = params.get("track");
  if (trackCode) {
    switchStudentTab("myGrievancesTab");
    setTimeout(() => {
      openGrievanceDetailsModal(trackCode);
    }, 400);
  }
}

window.switchStudentTab = switchStudentTab;
window.closeModal = closeModal;
window.openStudentVerificationModal = openStudentVerificationModal;
window.openGrievanceDetailsModal = openGrievanceDetailsModal;
window.setRating = setRating;
window.submitVerification = submitVerification;
window.toggleWallUpvote = toggleWallUpvote;
window.upvoteAndLink = upvoteAndLink;
window.renderMyGrievances = renderMyGrievances;
window.renderStudentStats = renderStudentStats;
window.renderPublicWall = renderPublicWall;