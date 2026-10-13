# CampusResolve Central 🏛️⚡
### Institutional Grievance Redressal & Cryptographic Whistleblower Portal
**UGC (Grievance Redressal of Students) Regulations, 2023 & AICTE SGRC Compliant**

---

## 🌟 Executive Overview
Traditional college complaint boxes and static web forms fail in universities for critical reasons:
1. **Fear of Victimization & Reprisal:** Students avoid reporting severe issues (ragging, mental distress, grading bias, harassment) due to fear of backlash.
2. **Duplicate Flooding:** 50+ students submit identical tickets for the same broken water cooler or Wi-Fi outage.
3. **Slow Triage & Wrong Routing:** Complaints sit for days before being forwarded to the appropriate committee or warden.
4. **Lack of SLA Accountability:** Tickets are forgotten with no automated escalation when deadlines are breached.
5. **False Closures:** Authorities mark tickets "Resolved" without verified on-ground work.

**CampusResolve** provides an autonomous, real-time redressal pipeline with live WebSocket synchronization across all stakeholder consoles.

---

## 👥 Multi-Category Institutional Stakeholders

The portal features dedicated, tailored workflows for every institutional stakeholder:

| Category | Role Description | Console Features |
| :--- | :--- | :--- |
| 👨‍🎓 **Student** | Enrolled Undergraduate & Postgraduate Students | AI Triage, Voice Memo recording, Live SLA countdowns, Two-Way Resolution Confirmation & Rating, Campus Public Wall upvoting. |
| 👩‍🏫 **Hostel Warden** | Chief & Assistant Hostel Wardens | Hostel-specific grievance queue, living conditions, water & mess hygiene inspection notes, student welfare tracking. |
| 🏛️ **Dean / Director** | Dean of Student Welfare (DSW), Chief Proctor, Director | Campus-wide governance, P0 emergency anti-ragging flags, 4-tier SLA escalation audit, official PDF dossier generation with QR seal. |
| 🔧 **Department Caretaker** | Estate Office, System Admins, Maintenance Supervisors | Direct technician assignment, on-site action reports, resolution proof submission. |
| 🕵️ **Whistleblower** | Zero-Knowledge Anonymous Reporting | 100% identity protection. No login required. Track case with confidential 12-character token. |

---

## ⚡ Real-Time Architecture & Innovations

### 1. 📡 Live Bi-Directional WebSockets
- Connected clients receive instant updates via native WebSockets:
  - **Instant Grievance Inflow:** When a student lodges an issue, all Deans & Wardens immediately hear an audio chime and see the new row flash onto their command center in real-time.
  - **Live Status Push:** When an authority updates status, the student's screen updates immediately without requiring a manual refresh.
  - **Two-Way Verification Sync:** Student satisfaction ratings and closure confirmations broadcast instantaneously.

### 2. 🤖 Real-Time NLP Urgency & Triage AI
- Evaluates sentiment, emergency triggers, and severity live as the student types.
- Crisis words (*ragging, harassment, electrical shock, suicide, fire, food poisoning*) auto-trigger **P0 Critical** status with a mandatory **4-hour response window**.
- Auto-routes complaints directly to the concerned body (Anti-Ragging Committee, Women's Internal Complaints Committee, Estate Office, Computer Centre, Examination Cell).

### 3. 🛡️ Zero-Knowledge Whistleblower Protection
- Students can toggle **Whistleblower Mode** with zero identity storage.
- Name, roll number, and email are completely stripped and replaced with a cryptographic Anonymous Token (e.g. `ANON-8821-XQ`).
- Follow up on cases and communicate without compromising personal identity.

### 4. ⏱️ 4-Tier Automated SLA Escalation Engine
- **Tier 1 (0 – 24 hrs):** First Responder (Caretaker / Technician)
- **Tier 2 (24 – 48 hrs):** Department Head / Hostel Warden
- **Tier 3 (48 – 72 hrs):** Dean of Student Welfare / Chief Proctor
- **Tier 4 (> 72 hrs):** College Director / Ombudsman (Statutory Audit Flag)

### 5. 🤝 Two-Way "Proof of Resolution" & Student Verification
- Eliminates fake closures.
- When an authority marks an issue complete, it enters **`Pending Student Verification`**.
- The student must confirm the fix and provide a 1-5 star rating before the ticket officially closes, or dispute and reopen with 1-click.

---

## 🏃 Running the Portal

The application runs on a high-performance Node.js real-time server with Express and WebSockets:

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Start the real-time server
npm start
```

Access in your browser:
👉 **`http://localhost:3000`**

### Pre-Configured Sample Accounts

| Category | Identifier / Email | Password |
| :--- | :--- | :--- |
| 👨‍🎓 Student | `aarav.sharma@campus.edu` (Roll: `22CS049`) | `password123` |
| 👩‍🏫 Warden | `sunita.rao@campus.edu` (ID: `WRD-4091`) | `password123` |
| 🏛️ Dean / Proctor | `dean.sw@campus.edu` (ID: `DIR-0012`) | `password123` |
| 🔧 Caretaker | `manoj.estate@campus.edu` (ID: `EST-8812`) | `password123` |
| 🕵️ Whistleblower | Sample Token: `ANON-8821-XQ` | *(No password required)* |
