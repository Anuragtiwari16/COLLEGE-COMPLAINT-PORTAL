/**
 * CampusResolve - Central State & Real-Time Intelligence Engine
 * Institutional Edition - Real-Time WebSocket & REST Synchronization
 */

const SEED_GRIEVANCES = [
  {
    id: "GRV-2026-0101",
    trackingCode: "ANON-8821-XQ",
    isAnonymous: true,
    studentName: "Anonymous Whistleblower",
    studentRoll: "PROTECTED_IDENTITY",
    studentEmail: "anonymous@secure.campus",
    category: "Anti-Ragging & Safety",
    department: "Anti-Ragging Committee & Chief Proctor",
    title: "Late night intimidation and unauthorized entry outside Hostel-D Block",
    description: "Group of senior students gathered outside 2nd floor corridor of Hostel-D after 11:30 PM playing loud music and forcing 1st-year students out of rooms. Incident occurred near room 214.",
    location: "Hostel D Block - 2nd Floor Corridor",
    urgency: "Critical",
    slaHours: 4,
    createdAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
    status: "in-progress",
    assignedTo: "Prof. R. C. Mathur (Chief Proctor)",
    currentEscalationLevel: 2,
    upvotes: 64,
    upvotedBy: ["user_1"],
    isPublic: false,
    resolutionProof: null,
    studentVerification: null,
    timeline: [
      { title: "Anonymous Grievance Filed", desc: "Flagged as P0 Emergency (Anti-Ragging Matrix). Zero-Knowledge Token generated.", time: "05:15 PM" },
      { title: "Immediate Proctorial Notice", desc: "Night flying squad dispatched to Hostel D block for inspection.", time: "05:45 PM" }
    ],
    evidence: { hasAudio: true, audioDuration: "0:24", images: [] }
  },
  {
    id: "GRV-2026-0102",
    trackingCode: "PUB-4910-WR",
    isAnonymous: false,
    studentName: "Aarav Sharma",
    studentRoll: "22CS049",
    studentEmail: "aarav.sharma@campus.edu",
    category: "Hostel & Living",
    department: "Estate Office & Hostel Maintenance",
    title: "Drinking water cooler emitting rusty brownish water on 3rd floor",
    description: "The AquaGuard RO cooler near the north staircase has been dispensing yellowish water with high chlorine odor for 2 days. Multiple students are forced to buy packaged bottles.",
    location: "Hostel Block 3 - 3rd Floor North Wing",
    urgency: "High",
    slaHours: 24,
    createdAt: new Date(Date.now() - 16 * 3600 * 1000).toISOString(),
    status: "in-progress",
    assignedTo: "Er. Manoj Kumar (Plumbing Supervisor)",
    currentEscalationLevel: 1,
    upvotes: 43,
    upvotedBy: ["user_2"],
    isPublic: true,
    resolutionProof: null,
    studentVerification: null,
    timeline: [
      { title: "Grievance Registered", desc: "Categorized under Hygiene & Basic Amenities. SLA target: 24h.", time: "08:15 AM" },
      { title: "Plumber Dispatched", desc: "Filter cartridge replacement requisition raised with Estate Store.", time: "11:30 AM" }
    ],
    evidence: { hasAudio: false, images: [] }
  },
  {
    id: "GRV-2026-0103",
    trackingCode: "PUB-5021-IT",
    isAnonymous: false,
    studentName: "Neha Gupta",
    studentRoll: "23IT012",
    studentEmail: "neha.gupta@campus.edu",
    category: "IT & Laboratory",
    department: "Campus Computer Centre",
    title: "High latency and dropped packets in CS Lab 4 during Capstone evaluation",
    description: "Subnet 172.16.42.0/24 in CS Lab 4 drops connection every 3 minutes. Cisco Catalyst switch port blinking amber. Students cannot push code to Git repos.",
    location: "Aryabhatta Academic Block - CS Lab 4 (2nd Floor)",
    urgency: "High",
    slaHours: 12,
    createdAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    status: "pending-verification",
    assignedTo: "Rajesh Soni (System Admin)",
    currentEscalationLevel: 1,
    upvotes: 28,
    upvotedBy: [],
    isPublic: true,
    resolutionProof: {
      note: "Port channel reconfigured and faulty patch cord replaced on Rack #2. Verified ping < 2ms to gateway.",
      resolvedAt: "04:30 PM",
      technician: "Rajesh Soni"
    },
    studentVerification: null,
    timeline: [
      { title: "Ticket Lodged", desc: "Reported by Neha Gupta during B.Tech project review.", time: "10:00 AM" },
      { title: "Network Audit Done", desc: "System Admin identified port collision on switch port 18.", time: "02:15 PM" },
      { title: "Marked Resolved by Admin", desc: "Awaiting student verification & rating.", time: "04:30 PM" }
    ],
    evidence: { hasAudio: false, images: [] }
  },
  {
    id: "GRV-2026-0104",
    trackingCode: "PUB-8812-LB",
    isAnonymous: false,
    studentName: "Vikram Singhal",
    studentRoll: "21ME078",
    studentEmail: "vikram.s@campus.edu",
    category: "Campus Facilities",
    department: "Central Library Administration",
    title: "Central Library 2nd floor air conditioning units failing during exam week",
    description: "Both split ACs in the silent research wing on 2nd floor are blowing hot air. Temperature is unbearable during study hours with over 120 students sitting.",
    location: "Central Library - 2nd Floor Silent Reading Room",
    urgency: "Medium",
    slaHours: 48,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    status: "in-progress",
    assignedTo: "Ashok Verma (HVAC Engineer)",
    currentEscalationLevel: 2,
    upvotes: 94,
    upvotedBy: [],
    isPublic: true,
    resolutionProof: null,
    studentVerification: null,
    timeline: [
      { title: "Ticket Created", desc: "Community grievance with 94 student upvotes.", time: "Yesterday, 09:30 AM" },
      { title: "HVAC Inspection", desc: "Compressor coolant leak detected; replacement part ordered.", time: "Yesterday, 03:00 PM" }
    ],
    evidence: { hasAudio: false, images: [] }
  },
  {
    id: "GRV-2026-0105",
    trackingCode: "ACAD-3310-EX",
    isAnonymous: false,
    studentName: "Priya Nair",
    studentRoll: "23EC034",
    studentEmail: "priya.nair@campus.edu",
    category: "Academics & Examination",
    department: "Controller of Examinations (COE)",
    title: "Clash in Mid-Semester Exam Schedule: Microprocessors and Signals & Systems",
    description: "Both EC301 and EC305 are listed for Slot B on Monday 10:00 AM to 12:00 PM on the official exam portal. Dual-degree and repeat exam students cannot attend both.",
    location: "Examination Cell / Academic Block",
    urgency: "High",
    slaHours: 24,
    createdAt: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
    status: "resolved",
    assignedTo: "Dr. K. Swaminathan (Deputy COE)",
    currentEscalationLevel: 2,
    upvotes: 19,
    upvotedBy: [],
    isPublic: true,
    resolutionProof: {
      note: "Revised schedule issued under Circular #EC/2026/04. EC305 rescheduled to Thursday 02:00 PM.",
      resolvedAt: "Yesterday, 06:10 PM",
      technician: "Dr. Swaminathan"
    },
    studentVerification: {
      confirmed: true,
      rating: 5,
      feedback: "Prompt timetable revision before the exam!",
      confirmedAt: "Today, 08:30 AM"
    },
    timeline: [
      { title: "Schedule Clash Flagged", desc: "Submitted with timetable screenshot.", time: "2 Days ago" },
      { title: "Faculty Board Convened", desc: "COE committee reviewed slot distribution.", time: "Yesterday, 02:00 PM" },
      { title: "Student Verified & Closed", desc: "Verified and awarded 5-star resolution rating.", time: "Today, 08:30 AM" }
    ],
    evidence: { hasAudio: false, images: [] }
  }
];

// Institutional Categories Directory
const INSTITUTIONAL_USERS = {
  student: {
    id: "usr_std_01",
    name: "Aarav Sharma",
    role: "student",
    category: "student",
    rollNumber: "22CS049",
    department: "Computer Science & Engineering",
    semester: "6th Semester",
    email: "aarav.sharma@campus.edu",
    avatar: "👨‍🎓",
    badge: "Student Representative"
  },
  warden: {
    id: "usr_warden_01",
    name: "Dr. Sunita Rao",
    role: "warden",
    category: "warden",
    staffId: "WRD-4091",
    department: "Hostel Administration & Student Welfare",
    hostelAssigned: "Hostel Block 3 & Gargi Girls Hostel",
    email: "sunita.rao@campus.edu",
    avatar: "👩‍🏫",
    badge: "Chief Hostel Warden"
  },
  dean: {
    id: "usr_dean_01",
    name: "Prof. V. K. Malhotra",
    role: "dean",
    category: "dean",
    staffId: "DIR-0012",
    department: "Dean of Student Welfare & Proctorial Board",
    officeCode: "Administrative Block - Room 102",
    email: "dean.sw@campus.edu",
    avatar: "🏛️",
    badge: "Dean of Student Welfare"
  },
  staff: {
    id: "usr_staff_01",
    name: "Er. Manoj Kumar",
    role: "staff",
    category: "staff",
    staffId: "EST-8812",
    department: "Estate Office & Maintenance",
    specialization: "Plumbing & Water Infrastructure",
    email: "manoj.estate@campus.edu",
    avatar: "🔧",
    badge: "Senior Maintenance Supervisor"
  },
  anonymous: {
    id: "usr_anon",
    name: "Confidential Student",
    role: "student",
    category: "student",
    rollNumber: "PROTECTED",
    department: "Campus Wide",
    email: "whistleblower@secure.campus",
    avatar: "🕵️",
    badge: "Zero-Knowledge Whistleblower"
  }
};

/**
 * AI Natural Language Processing Urgency Engine
 */
const CampusResolveAI = {
  CRISIS_PATTERNS: [
    /ragging/i, /harass/i, /bully/i, /assault/i, /suicid/i, /depression/i, /mental health/i,
    /molest/i, /threat/i, /bribe/i, /electric.*shock/i, /short.*circuit/i, /fire/i, /gas leak/i,
    /violence/i, /caste/i, /ragged/i, /beaten/i
  ],

  HIGH_PATTERNS: [
    /water.*leak/i, /no water/i, /yellow.*water/i, /contaminated/i, /food.*poison/i, /vomit/i,
    /power.*cut/i, /exam.*clash/i, /admit card/i, /hall ticket/i, /gpu.*quota/i, /wifi.*down/i,
    /internet.*exam/i, /stolen/i, /theft/i, /washroom.*overflow/i
  ],

  analyze(text = "", category = "") {
    const combined = `${category} ${text}`.toLowerCase();

    for (const pat of this.CRISIS_PATTERNS) {
      if (pat.test(combined)) {
        return {
          urgency: "Critical",
          slaHours: 4,
          crisisFlag: true,
          badgeColor: "critical",
          department: combined.includes("ragging") || combined.includes("harass") ? "Anti-Ragging Committee & Chief Proctor" : "Emergency Campus Response Cell",
          rationale: "🚨 AI Critical Flag: High-risk safety/welfare trigger detected. Auto-routed with 4-hour strict SLA.",
          suggestedAction: "Immediate notification dispatched to Chief Proctor and Warden flying squad."
        };
      }
    }

    for (const pat of this.HIGH_PATTERNS) {
      if (pat.test(combined)) {
        return {
          urgency: "High",
          slaHours: 24,
          crisisFlag: false,
          badgeColor: "high",
          department: this.getDepartment(category),
          rationale: "⚡ AI High Priority: Essential utility or academic disruption detected (24h SLA target).",
          suggestedAction: "Assigned directly to on-call duty technician."
        };
      }
    }

    return {
      urgency: "Medium",
      slaHours: 48,
      crisisFlag: false,
      badgeColor: "medium",
      department: this.getDepartment(category),
      rationale: "📋 Standard Grievance: Under normal review cycle with 48h resolution SLA.",
      suggestedAction: "Forwarded to department coordinator for scheduled inspection."
    };
  },

  getDepartment(category = "") {
    const cat = category.toLowerCase();
    if (cat.includes("ragging") || cat.includes("safety")) return "Anti-Ragging Committee & Chief Proctor";
    if (cat.includes("hostel")) return "Hostel Administration & Estate Office";
    if (cat.includes("it") || cat.includes("network") || cat.includes("wifi")) return "Campus Computer Centre & IT Cell";
    if (cat.includes("academic") || cat.includes("exam")) return "Academic Affairs & Examination Cell";
    if (cat.includes("mess") || cat.includes("canteen")) return "Food Safety & Canteen Committee";
    if (cat.includes("facility") || cat.includes("library")) return "Estate & Infrastructure Directorate";
    return "Dean of Student Welfare Office";
  },

  findDuplicates(title, description, location, allGrievances) {
    if (!title || title.length < 5) return [];

    const queryWords = `${title} ${description} ${location}`
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3);

    const matches = [];

    allGrievances.forEach(g => {
      if (g.status === "resolved" || g.status === "closed") return;

      const targetWords = `${g.title} ${g.description} ${g.location}`
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/);

      let sharedCount = 0;
      queryWords.forEach(w => {
        if (targetWords.includes(w)) sharedCount++;
      });

      const similarityScore = Math.min(100, Math.round((sharedCount / Math.max(queryWords.length, 1)) * 100));

      if (similarityScore >= 35 || (location && g.location && g.location.toLowerCase().includes(location.toLowerCase()))) {
        matches.push({
          grievance: g,
          similarity: Math.max(similarityScore, 50)
        });
      }
    });

    return matches.sort((a, b) => b.similarity - a.similarity).slice(0, 2);
  }
};

/**
 * CampusResolve Central State Engine
 * Connected to live WebSockets + BroadcastChannel + Local Cache
 */
class CampusResolveStore {
  constructor() {
    this.storageKey = "campusresolve_db_v3";
    this.userKey = "campusresolve_active_user_v3";
    this.ws = null;
    this.broadcastChannel = null;
    this.listeners = [];

    this.init();
    this.initRealTimeChannel();
    this.initWebSocket();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(SEED_GRIEVANCES));
    }
    if (!localStorage.getItem(this.userKey)) {
      localStorage.setItem(this.userKey, JSON.stringify(INSTITUTIONAL_USERS.student));
    }

    // Try fetching initial from server
    fetch('/api/complaints')
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          this.saveGrievancesLocally(res.data);
        }
      })
      .catch(() => {});
  }

  initRealTimeChannel() {
    if (typeof BroadcastChannel !== 'undefined') {
      this.broadcastChannel = new BroadcastChannel('campusresolve_realtime_bus');
      this.broadcastChannel.onmessage = (event) => {
        this.handleIncomingEvent(event.data);
      };
    }

    window.addEventListener('storage', (e) => {
      if (e.key === this.storageKey) {
        this.notifyListeners('STORAGE_UPDATED', this.getAllGrievances());
      }
    });
  }

  initWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:3000';
    const wsUrl = `${protocol}//${host}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[CampusResolve Real-Time] Connected to WebSocket Hub');
        this.updateLiveIndicator(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleIncomingEvent(msg);
        } catch (e) {
          console.error('[CampusResolve WS] Error parsing message', e);
        }
      };

      this.ws.onclose = () => {
        console.warn('[CampusResolve WS] Disconnected. Reconnecting in 3s...');
        this.updateLiveIndicator(false);
        setTimeout(() => this.initWebSocket(), 3000);
      };

      this.ws.onerror = () => {
        this.updateLiveIndicator(false);
      };
    } catch (e) {
      console.info('[CampusResolve WS] Fallback to BroadcastChannel real-time mode.');
    }
  }

  updateLiveIndicator(isConnected) {
    const el = document.getElementById('liveRealtimeBadge');
    if (el) {
      if (isConnected) {
        el.innerHTML = '<span style="width:7px; height:7px; border-radius:50%; background:#10b981; display:inline-block; box-shadow:0 0 8px #10b981;"></span> Real-Time Live Sync';
        el.style.color = '#10b981';
      } else {
        el.innerHTML = '<span style="width:7px; height:7px; border-radius:50%; background:#f59e0b; display:inline-block;"></span> Local Real-Time Sync';
        el.style.color = '#f59e0b';
      }
    }
  }

  handleIncomingEvent(event) {
    if (!event || !event.type) return;

    if (event.type === 'NEW_GRIEVANCE') {
      const list = this.getAllGrievances();
      if (!list.some(g => g.id === event.payload.id)) {
        list.unshift(event.payload);
        this.saveGrievancesLocally(list);
      }
      this.playNotificationChime();
      this.notifyListeners('NEW_GRIEVANCE', event.payload);
    } else if (event.type === 'STATUS_UPDATED') {
      const list = this.getAllGrievances();
      const idx = list.findIndex(g => g.id === event.payload.id);
      if (idx !== -1) {
        list[idx] = event.payload;
        this.saveGrievancesLocally(list);
      }
      this.playNotificationChime();
      this.notifyListeners('STATUS_UPDATED', event.payload);
    } else if (event.type === 'VERIFICATION_UPDATED') {
      const list = this.getAllGrievances();
      const idx = list.findIndex(g => g.id === event.payload.id);
      if (idx !== -1) {
        list[idx] = event.payload;
        this.saveGrievancesLocally(list);
      }
      this.notifyListeners('VERIFICATION_UPDATED', event.payload);
    } else if (event.type === 'UPVOTE_UPDATED') {
      const list = this.getAllGrievances();
      const target = list.find(g => g.id === event.payload.id);
      if (target) {
        target.upvotes = event.payload.upvotes;
        this.saveGrievancesLocally(list);
      }
      this.notifyListeners('UPVOTE_UPDATED', event.payload);
    } else if (event.type === 'COMMENT_ADDED') {
      const list = this.getAllGrievances();
      const target = list.find(g => g.id === event.payload.grievanceId);
      if (target) {
        if (!target.comments) target.comments = [];
        if (!target.comments.some(c => c.id === event.payload.comment.id)) {
          target.comments.push(event.payload.comment);
          this.saveGrievancesLocally(list);
        }
      }
      this.playNotificationChime();
      this.notifyListeners('COMMENT_ADDED', event.payload);
    }
  }

  playNotificationChime() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  }

  on(listener) {
    this.listeners.push(listener);
  }

  notifyListeners(type, data) {
    this.listeners.forEach(fn => {
      try { fn(type, data); } catch (e) {}
    });
  }

  getAllGrievances() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : SEED_GRIEVANCES;
    } catch (e) {
      return SEED_GRIEVANCES;
    }
  }

  saveGrievancesLocally(list) {
    localStorage.setItem(this.storageKey, JSON.stringify(list));
  }

  getGrievanceById(id) {
    const list = this.getAllGrievances();
    return list.find(g => g.id === id || g.trackingCode === id);
  }

  getCurrentUser() {
    try {
      const u = localStorage.getItem(this.userKey);
      return u ? JSON.parse(u) : INSTITUTIONAL_USERS.student;
    } catch {
      return INSTITUTIONAL_USERS.student;
    }
  }

  setCurrentUser(userObj) {
    localStorage.setItem(this.userKey, JSON.stringify(userObj));
    window.dispatchEvent(new CustomEvent("campusresolve:user_changed", { detail: userObj }));
  }

  async addGrievance(data) {
    const currentUser = this.getCurrentUser();
    const payload = {
      ...data,
      studentName: data.isAnonymous ? "Anonymous Whistleblower" : currentUser.name,
      studentRoll: data.isAnonymous ? "PROTECTED_IDENTITY" : (currentUser.rollNumber || "22CS049"),
      studentEmail: data.isAnonymous ? "anonymous@secure.campus" : (currentUser.email || "student@campus.edu")
    };

    // Try posting to REST backend
    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success && json.data) {
        const list = this.getAllGrievances();
        const existingIdx = list.findIndex(g => g.id === json.data.id || g.trackingCode === json.data.trackingCode);
        if (existingIdx !== -1) {
          list[existingIdx] = json.data;
        } else {
          list.unshift(json.data);
        }
        this.saveGrievancesLocally(list);
        return json.data;
      }
    } catch (e) {}

    // Fallback: Local Generation & Broadcast
    const list = this.getAllGrievances();
    const idNum = 100 + list.length + 1;
    const newId = `GRV-2026-0${idNum}`;
    const prefix = data.isAnonymous ? "ANON" : "GRV";
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const randChar = Math.random().toString(36).substring(2, 4).toUpperCase();
    const trackingCode = `${prefix}-${randNum}-${randChar}`;

    const aiAssessment = CampusResolveAI.analyze(`${data.title} ${data.description}`, data.category);

    const newTicket = {
      id: newId,
      trackingCode,
      isAnonymous: !!data.isAnonymous,
      studentName: payload.studentName,
      studentRoll: payload.studentRoll,
      studentEmail: payload.studentEmail,
      category: data.category || "General",
      department: aiAssessment.department,
      title: data.title,
      description: data.description,
      location: data.location || "Campus Premises",
      urgency: aiAssessment.urgency,
      slaHours: aiAssessment.slaHours,
      createdAt: new Date().toISOString(),
      status: "pending",
      assignedTo: "Triage Desk / Auto-Routed",
      currentEscalationLevel: 1,
      upvotes: 1,
      upvotedBy: [],
      isPublic: !data.isAnonymous,
      resolutionProof: null,
      studentVerification: null,
      timeline: [
        {
          title: data.isAnonymous ? "Anonymous Docket Filed" : "Grievance Lodged",
          desc: `${aiAssessment.rationale} Routed to ${aiAssessment.department}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      evidence: {
        hasAudio: !!data.hasAudio,
        audioDuration: data.audioDuration || null,
        images: data.images || []
      }
    };

    list.unshift(newTicket);
    this.saveGrievancesLocally(list);

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'NEW_GRIEVANCE', payload: newTicket });
    }

    return newTicket;
  }

  async updateGrievanceStatus(id, newStatus, adminNote = "", assignedOfficer = "") {
    // Try REST
    try {
      const res = await fetch(`/api/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNote, assignedOfficer })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const list = this.getAllGrievances();
        const idx = list.findIndex(g => g.id === id || g.trackingCode === id);
        if (idx !== -1) {
          list[idx] = json.data;
          this.saveGrievancesLocally(list);
        }
        return json.data;
      }
    } catch (e) {}

    // Fallback: Local
    const list = this.getAllGrievances();
    const target = list.find(g => g.id === id);
    if (!target) return null;

    target.status = newStatus;
    if (assignedOfficer) target.assignedTo = assignedOfficer;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (newStatus === "pending-verification") {
      target.resolutionProof = {
        note: adminNote || "Action completed by authority. Awaiting student verification.",
        resolvedAt: timeStr,
        technician: assignedOfficer || target.assignedTo
      };
      target.timeline.push({
        title: "Action Taken - Pending Verification",
        desc: adminNote || "Issue marked resolved by authority. Sent to student for closure approval.",
        time: timeStr
      });
    } else {
      target.timeline.push({
        title: `Status: ${newStatus.toUpperCase()}`,
        desc: adminNote || `Updated by authority to ${newStatus}.`,
        time: timeStr
      });
    }

    this.saveGrievancesLocally(list);
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'STATUS_UPDATED', payload: target });
    }
    return target;
  }

  async studentVerifyResolution(id, confirmed, rating = 5, feedback = "") {
    // Try REST
    try {
      const res = await fetch(`/api/complaints/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmed, rating, feedback })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const list = this.getAllGrievances();
        const idx = list.findIndex(g => g.id === id || g.trackingCode === id);
        if (idx !== -1) {
          list[idx] = json.data;
          this.saveGrievancesLocally(list);
        }
        return json.data;
      }
    } catch (e) {}

    // Fallback: Local
    const list = this.getAllGrievances();
    const target = list.find(g => g.id === id || g.trackingCode === id);
    if (!target) return null;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (confirmed) {
      target.status = "resolved";
      target.studentVerification = {
        confirmed: true,
        rating,
        feedback: feedback || "Verified and confirmed satisfied by student.",
        confirmedAt: timeStr
      };
      target.timeline.push({
        title: `Student Confirmed Resolution (${rating} ★)`,
        desc: feedback || "Student verified resolution of the issue.",
        time: timeStr
      });
    } else {
      target.status = "in-progress";
      target.currentEscalationLevel = Math.min(4, target.currentEscalationLevel + 1);
      target.resolutionProof = null;
      target.timeline.push({
        title: "⚠️ Resolution Disputed by Student - Ticket Reopened",
        desc: `Student reported issue persists: "${feedback}". Escalated to Tier ${target.currentEscalationLevel}.`,
        time: timeStr
      });
    }

    this.saveGrievancesLocally(list);
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'VERIFICATION_UPDATED', payload: target });
    }
    return target;
  }

  async upvoteGrievance(id, userId = "currentUser") {
    // Try REST
    try {
      const res = await fetch(`/api/complaints/${id}/upvote`, { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        const list = this.getAllGrievances();
        const t = list.find(g => g.id === id || g.trackingCode === id);
        if (t) {
          t.upvotes = json.upvotes;
          this.saveGrievancesLocally(list);
        }
        return t;
      }
    } catch (e) {}

    // Fallback: Local
    const list = this.getAllGrievances();
    const target = list.find(g => g.id === id || g.trackingCode === id);
    if (!target) return null;

    target.upvotes = (target.upvotes || 0) + 1;
    this.saveGrievancesLocally(list);

    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({ type: 'UPVOTE_UPDATED', payload: { id: target.id, upvotes: target.upvotes } });
    }
    return target;
  }

  async addComment(grievanceId, text, author, authorRole) {
    const user = this.getCurrentUser();
    const payload = {
      text,
      author: author || user.name || "Student",
      authorRole: authorRole || user.badge || "Authorized Member"
    };

    try {
      const res = await fetch(`/api/complaints/${grievanceId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (json.success && json.comment) {
        const list = this.getAllGrievances();
        const target = list.find(g => g.id === grievanceId || g.trackingCode === grievanceId);
        if (target) {
          if (!target.comments) target.comments = [];
          if (!target.comments.some(c => c.id === json.comment.id)) {
            target.comments.push(json.comment);
            this.saveGrievancesLocally(list);
          }
        }
        return json.comment;
      }
    } catch (e) {}

    // Fallback: Local
    const list = this.getAllGrievances();
    const target = list.find(g => g.id === grievanceId || g.trackingCode === grievanceId);
    if (!target) return null;
    if (!target.comments) target.comments = [];
    const localComment = {
      id: "cm_" + Date.now(),
      author: payload.author,
      authorRole: payload.authorRole,
      text: payload.text,
      createdAt: new Date().toISOString()
    };
    target.comments.push(localComment);
    this.saveGrievancesLocally(list);
    return localComment;
  }

  calculateSLA(grievance) {
    const created = new Date(grievance.createdAt).getTime();
    const now = Date.now();
    const elapsedHours = (now - created) / (1000 * 3600);
    const targetHours = grievance.slaHours || 24;

    const remainingHours = targetHours - elapsedHours;
    const isBreached = remainingHours <= 0;

    let tier = 1;
    let tierName = "Level 1: Caretaker / Lab Assistant";

    if (elapsedHours > 72) {
      tier = 4;
      tierName = "Level 4: College Director & Ombudsman";
    } else if (elapsedHours > 48) {
      tier = 3;
      tierName = "Level 3: Dean of Student Welfare";
    } else if (elapsedHours > 24) {
      tier = 2;
      tierName = "Level 2: Head of Department / Warden";
    }

    let displayTime = "";
    if (isBreached) {
      const overHours = Math.abs(remainingHours).toFixed(1);
      displayTime = `Breached by ${overHours}h`;
    } else {
      const remH = Math.floor(remainingHours);
      const remM = Math.floor((remainingHours - remH) * 60);
      displayTime = `${remH}h ${remM}m left`;
    }

    const percent = Math.min(100, Math.max(0, (elapsedHours / targetHours) * 100));

    return {
      elapsedHours: elapsedHours.toFixed(1),
      targetHours,
      remainingHours,
      isBreached,
      displayTime,
      percent: Math.round(percent),
      currentTier: tier,
      tierName
    };
  }

  getAnalytics() {
    const list = this.getAllGrievances();
    const total = list.length;
    const resolved = list.filter(g => g.status === "resolved").length;
    const inProgress = list.filter(g => g.status === "in-progress" || g.status === "pending-verification").length;
    const pending = list.filter(g => g.status === "pending").length;
    const critical = list.filter(g => g.urgency === "Critical").length;

    let compliantCount = 0;
    list.forEach(g => {
      const sla = this.calculateSLA(g);
      if (!sla.isBreached || g.status === "resolved") compliantCount++;
    });
    const slaComplianceRate = total > 0 ? Math.round((compliantCount / total) * 100) : 100;

    const categoryCounts = {};
    list.forEach(g => {
      categoryCounts[g.category] = (categoryCounts[g.category] || 0) + 1;
    });

    const hotspotCounts = {};
    list.forEach(g => {
      if (g.location) {
        let prefix = g.location.split("-")[0].trim();
        hotspotCounts[prefix] = (hotspotCounts[prefix] || 0) + 1;
      }
    });

    return {
      total,
      resolved,
      inProgress,
      pending,
      critical,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      slaComplianceRate,
      categoryCounts,
      hotspotCounts
    };
  }
}

// Global Singleton Instance
window.CampusResolve = new CampusResolveStore();
window.CampusResolveAI = CampusResolveAI;
window.INSTITUTIONAL_USERS = INSTITUTIONAL_USERS;
