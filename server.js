/**
 * CampusResolve - Central Real-Time Grievance Server
 * Node.js + Express + Native WebSockets + JSON File Persistence
 * Compliant with UGC & AICTE SGRC Student Grievance Redressal Regulations
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const GRIEVANCES_FILE = path.join(DATA_DIR, 'grievances.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Public')));

// Ensure data persistence directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Dataset for Enterprise Collegiate Grievances
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
    comments: [
      { id: "cm_1", author: "Prof. R. C. Mathur", authorRole: "Chief Proctor", text: "Proctorial flying squad dispatched for midnight patrolling around Block D.", createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() }
    ],
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
    comments: [
      { id: "cm_2", author: "Er. Manoj Kumar", authorRole: "Maintenance Supervisor", text: "Replacement filter cartridges arrived at central store. Scheduled for installation at 11 AM.", createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString() }
    ],
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
    comments: [],
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
    comments: [],
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
    comments: [],
    timeline: [
      { title: "Schedule Clash Flagged", desc: "Submitted with timetable screenshot.", time: "2 Days ago" },
      { title: "Faculty Board Convened", desc: "COE committee reviewed slot distribution.", time: "Yesterday, 02:00 PM" },
      { title: "Student Verified & Closed", desc: "Verified and awarded 5-star resolution rating.", time: "Today, 08:30 AM" }
    ],
    evidence: { hasAudio: false, images: [] }
  }
];

const SEED_USERS = [
  {
    id: "usr_std_01",
    name: "Aarav Sharma",
    role: "student",
    category: "student",
    rollNumber: "22CS049",
    department: "Computer Science & Engineering",
    semester: "6th Semester",
    email: "aarav.sharma@campus.edu",
    password: "password123",
    avatar: "👨‍🎓",
    badge: "Student Representative"
  },
  {
    id: "usr_warden_01",
    name: "Dr. Sunita Rao",
    role: "warden",
    category: "warden",
    staffId: "WRD-4091",
    department: "Hostel Warden & Student Welfare",
    hostelAssigned: "Hostel Block 3 & Gargi Girls Hostel",
    email: "sunita.rao@campus.edu",
    password: "password123",
    avatar: "👩‍🏫",
    badge: "Chief Hostel Warden"
  },
  {
    id: "usr_dean_01",
    name: "Prof. V. K. Malhotra",
    role: "dean",
    category: "dean",
    staffId: "DIR-0012",
    department: "Dean of Student Welfare & Proctor",
    officeCode: "Administrative Block - Room 102",
    email: "dean.sw@campus.edu",
    password: "password123",
    avatar: "🏛️",
    badge: "Dean of Student Welfare"
  },
  {
    id: "usr_staff_01",
    name: "Er. Manoj Kumar",
    role: "staff",
    category: "staff",
    staffId: "EST-8812",
    department: "Estate Office & Maintenance",
    specialization: "Plumbing & Water Infrastructure",
    email: "manoj.estate@campus.edu",
    password: "password123",
    avatar: "🔧",
    badge: "Senior Maintenance Supervisor"
  }
];

// Persistent state loaders
let grievances = [];
let users = [];

function loadGrievances() {
  try {
    if (fs.existsSync(GRIEVANCES_FILE)) {
      const data = fs.readFileSync(GRIEVANCES_FILE, 'utf8');
      grievances = JSON.parse(data);
    } else {
      grievances = [...SEED_GRIEVANCES];
      saveGrievances();
    }
  } catch (err) {
    console.error('[CampusResolve Server] Error reading grievances file:', err);
    grievances = [...SEED_GRIEVANCES];
  }
}

function saveGrievances() {
  try {
    fs.writeFileSync(GRIEVANCES_FILE, JSON.stringify(grievances, null, 2), 'utf8');
  } catch (err) {
    console.error('[CampusResolve Server] Error saving grievances to file:', err);
  }
}

function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      users = JSON.parse(data);
    } else {
      users = [...SEED_USERS];
      saveUsers();
    }
  } catch (err) {
    console.error('[CampusResolve Server] Error reading users file:', err);
    users = [...SEED_USERS];
  }
}

function saveUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('[CampusResolve Server] Error saving users to file:', err);
  }
}

// Initialize datasets
loadGrievances();
loadUsers();

// Broadcast Real-time Event to all connected WebSocket clients
function broadcastEvent(eventType, payload) {
  const message = JSON.stringify({ type: eventType, payload, timestamp: new Date().toISOString() });
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (err) {
        console.error('[CampusResolve WS] Error sending to client:', err);
      }
    }
  });
}

// WebSocket Connection Handler
wss.on('connection', (ws) => {
  console.log(`[WebSocket] Client connected. Total active connections: ${wss.clients.size}`);
  
  ws.send(JSON.stringify({
    type: 'CONNECTION_ESTABLISHED',
    payload: {
      message: 'CampusResolve Real-time WebSocket Live Stream Active',
      activeConnections: wss.clients.size
    }
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      }
    } catch (e) {
      console.error('[WebSocket] Invalid JSON message received', e);
    }
  });

  ws.on('close', () => {
    console.log(`[WebSocket] Client disconnected. Remaining: ${wss.clients.size}`);
  });
});

// REST API Endpoints

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'CampusResolve Central Redressal Engine',
    activeConnections: wss.clients.size,
    totalGrievances: grievances.length,
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 2. High-Level Analytics & KPIs
app.get('/api/stats', (req, res) => {
  const total = grievances.length;
  const resolved = grievances.filter(g => g.status === 'resolved').length;
  const inProgress = grievances.filter(g => g.status === 'in-progress' || g.status === 'pending').length;
  const pendingVerification = grievances.filter(g => g.status === 'pending-verification').length;
  const critical = grievances.filter(g => g.urgency === 'Critical').length;
  
  const now = Date.now();
  const slaBreached = grievances.filter(g => {
    if (g.status === 'resolved') return false;
    const elapsed = (now - new Date(g.createdAt).getTime()) / (3600 * 1000);
    return elapsed > (g.slaHours || 24);
  }).length;

  const slaComplianceRate = total > 0 ? Math.round(((total - slaBreached) / total) * 100) : 100;

  // Hotspots
  const hotspots = {};
  grievances.forEach(g => {
    const zone = (g.location || 'Campus').split('-')[0].trim();
    hotspots[zone] = (hotspots[zone] || 0) + 1;
  });

  // Department distribution
  const departments = {};
  grievances.forEach(g => {
    const dept = g.department || 'General';
    departments[dept] = (departments[dept] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      total,
      resolved,
      inProgress,
      pendingVerification,
      critical,
      slaBreached,
      slaComplianceRate,
      hotspots,
      departments
    }
  });
});

// 3. Get All Complaints
app.get('/api/complaints', (req, res) => {
  res.json({ success: true, count: grievances.length, data: grievances });
});

// 4. Get Single Complaint by ID or Token
app.get('/api/complaints/:id', (req, res) => {
  const id = req.params.id.toUpperCase();
  const g = grievances.find(item => item.id === id || item.trackingCode === id);
  if (!g) return res.status(404).json({ success: false, message: 'Complaint not found' });
  res.json({ success: true, data: g });
});

// 5. Lodge New Grievance (Broadcasts in Real-Time to all screens!)
app.post('/api/complaints', (req, res) => {
  const body = req.body;
  if (!body.title || !body.description) {
    return res.status(400).json({ success: false, message: 'Title and description are required.' });
  }

  const idNum = 100 + grievances.length + 1;
  const newId = `GRV-2026-0${idNum}`;

  const prefix = body.isAnonymous ? "ANON" : "GRV";
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const randChar = Math.random().toString(36).substring(2, 4).toUpperCase();
  const trackingCode = `${prefix}-${randNum}-${randChar}`;

  // Analyze urgency & triage rules
  const textCombined = `${body.title} ${body.description}`.toLowerCase();
  let urgency = "Medium";
  let slaHours = 48;
  let department = body.category ? `${body.category} Department` : "Student Welfare";

  if (/ragging|harass|bully|assault|suicid|electric|fire|weapon/i.test(textCombined)) {
    urgency = "Critical";
    slaHours = 4;
    department = "Anti-Ragging Committee & Chief Proctor";
  } else if (/water|leak|wifi|wi-fi|internet|exam|admit card|food poison|hygiene/i.test(textCombined)) {
    urgency = "High";
    slaHours = 24;
    if (/wifi|wi-fi|internet|lab|switch|network/i.test(textCombined)) {
      department = "Campus Computer Centre";
    } else if (/water|leak|plumb|pipe|tank/i.test(textCombined)) {
      department = "Estate Office & Hostel Maintenance";
    }
  }

  const newTicket = {
    id: newId,
    trackingCode,
    isAnonymous: !!body.isAnonymous,
    studentName: body.isAnonymous ? "Anonymous Whistleblower" : (body.studentName || "Student"),
    studentRoll: body.isAnonymous ? "PROTECTED_IDENTITY" : (body.studentRoll || "22CS049"),
    studentEmail: body.isAnonymous ? "anonymous@secure.campus" : (body.studentEmail || "student@campus.edu"),
    category: body.category || "General",
    department: body.department || department,
    title: body.title,
    description: body.description,
    location: body.location || "Campus Premises",
    urgency: body.urgency || urgency,
    slaHours: body.slaHours || slaHours,
    createdAt: new Date().toISOString(),
    status: "pending",
    assignedTo: "Triage Desk / Auto-Routed",
    currentEscalationLevel: 1,
    upvotes: 1,
    upvotedBy: [],
    isPublic: !body.isAnonymous,
    resolutionProof: null,
    studentVerification: null,
    comments: [],
    timeline: [
      {
        title: body.isAnonymous ? "Anonymous Whistleblower Docket Filed" : "Grievance Lodged",
        desc: `Auto-routed to ${department} with ${slaHours}h SLA target under UGC protocol.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    evidence: {
      hasAudio: !!body.hasAudio,
      audioDuration: body.audioDuration || null,
      images: body.images || []
    }
  };

  grievances.unshift(newTicket);
  saveGrievances();

  // Broadcast in Real-Time via WebSocket!
  broadcastEvent('NEW_GRIEVANCE', newTicket);

  res.status(201).json({ success: true, data: newTicket });
});

// 6. Update Complaint Status (Admin / Warden / Dean action)
app.patch('/api/complaints/:id/status', (req, res) => {
  const id = req.params.id.toUpperCase();
  const { status, adminNote, assignedOfficer } = req.body;

  const target = grievances.find(g => g.id === id || g.trackingCode === id);
  if (!target) return res.status(404).json({ success: false, message: 'Grievance not found' });

  if (status) target.status = status;
  if (assignedOfficer) target.assignedTo = assignedOfficer;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (status === "pending-verification") {
    target.resolutionProof = {
      note: adminNote || "Action completed by authority. Awaiting student verification.",
      resolvedAt: timeStr,
      technician: assignedOfficer || target.assignedTo
    };
    target.timeline.push({
      title: "Action Taken - Pending Verification",
      desc: adminNote || "Work completed on-site. Sent to student for closure confirmation.",
      time: timeStr
    });
  } else if (status) {
    target.timeline.push({
      title: `Status: ${status.toUpperCase()}`,
      desc: adminNote || `Updated to ${status} by administration.`,
      time: timeStr
    });
  }

  saveGrievances();

  // Real-time broadcast
  broadcastEvent('STATUS_UPDATED', target);

  res.json({ success: true, data: target });
});

// 7. Two-Way Student Verification
app.post('/api/complaints/:id/verify', (req, res) => {
  const id = req.params.id.toUpperCase();
  const { confirmed, rating, feedback } = req.body;

  const target = grievances.find(g => g.id === id || g.trackingCode === id);
  if (!target) return res.status(404).json({ success: false, message: 'Grievance not found' });

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (confirmed) {
    target.status = "resolved";
    target.studentVerification = {
      confirmed: true,
      rating: rating || 5,
      feedback: feedback || "Verified satisfied by student.",
      confirmedAt: timeStr
    };
    target.timeline.push({
      title: `Student Confirmed Resolution (${rating || 5} ★)`,
      desc: feedback || "Student verified resolution of the issue.",
      time: timeStr
    });
  } else {
    target.status = "in-progress";
    target.currentEscalationLevel = Math.min(4, (target.currentEscalationLevel || 1) + 1);
    target.resolutionProof = null;
    target.timeline.push({
      title: "⚠️ Resolution Disputed by Student - Reopened",
      desc: `Student reported: "${feedback || 'Issue persists'}". Auto-escalated to Level ${target.currentEscalationLevel}.`,
      time: timeStr
    });
  }

  saveGrievances();

  // Real-time broadcast
  broadcastEvent('VERIFICATION_UPDATED', target);

  res.json({ success: true, data: target });
});

// 8. Upvote Grievance
app.post('/api/complaints/:id/upvote', (req, res) => {
  const id = req.params.id.toUpperCase();
  const target = grievances.find(g => g.id === id || g.trackingCode === id);
  if (!target) return res.status(404).json({ success: false, message: 'Grievance not found' });

  target.upvotes = (target.upvotes || 0) + 1;
  saveGrievances();

  // Real-time broadcast
  broadcastEvent('UPVOTE_UPDATED', { id: target.id, upvotes: target.upvotes });

  res.json({ success: true, upvotes: target.upvotes, data: target });
});

// 9. Case Discussion / Comments Thread
app.get('/api/complaints/:id/comments', (req, res) => {
  const id = req.params.id.toUpperCase();
  const target = grievances.find(g => g.id === id || g.trackingCode === id);
  if (!target) return res.status(404).json({ success: false, message: 'Grievance not found' });

  res.json({ success: true, comments: target.comments || [] });
});

app.post('/api/complaints/:id/comments', (req, res) => {
  const id = req.params.id.toUpperCase();
  const target = grievances.find(g => g.id === id || g.trackingCode === id);
  if (!target) return res.status(404).json({ success: false, message: 'Grievance not found' });

  const { author, authorRole, text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'Comment text is required.' });
  }

  if (!target.comments) target.comments = [];

  const newComment = {
    id: "cm_" + Date.now(),
    author: author || "Campus Member",
    authorRole: authorRole || "Authorized User",
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  target.comments.push(newComment);
  saveGrievances();

  // Broadcast comment in real-time
  broadcastEvent('COMMENT_ADDED', { grievanceId: target.id, comment: newComment });

  res.status(201).json({ success: true, comment: newComment, comments: target.comments });
});

// 10. CSV Export Endpoint
app.get('/api/export/csv', (req, res) => {
  const header = ['ID', 'Tracking Code', 'Complainant', 'Role/Roll', 'Category', 'Department', 'Urgency', 'SLA Hours', 'Status', 'Assigned To', 'Location', 'Upvotes', 'Created At'];
  const rows = grievances.map(g => [
    `"${g.id}"`,
    `"${g.trackingCode}"`,
    `"${g.isAnonymous ? 'Anonymous' : (g.studentName || '').replace(/"/g, '""')}"`,
    `"${g.isAnonymous ? 'PROTECTED' : (g.studentRoll || '').replace(/"/g, '""')}"`,
    `"${(g.category || '').replace(/"/g, '""')}"`,
    `"${(g.department || '').replace(/"/g, '""')}"`,
    `"${g.urgency || ''}"`,
    `"${g.slaHours || 24}"`,
    `"${g.status || ''}"`,
    `"${(g.assignedTo || '').replace(/"/g, '""')}"`,
    `"${(g.location || '').replace(/"/g, '""')}"`,
    `"${g.upvotes || 0}"`,
    `"${g.createdAt || ''}"`
  ]);

  const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\r\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="CampusResolve_Grievances_Export.csv"');
  res.send(csvContent);
});

// 11. Authentication: Login supporting all categories (student, warden, dean, staff)
app.post('/api/auth/login', (req, res) => {
  const { email, password, category } = req.body;
  
  let found = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  
  if (!found) {
    // If not found, allow seamless demo login with chosen category
    const role = category || (email && email.includes('warden') ? 'warden' : email && email.includes('dean') ? 'dean' : 'student');
    found = {
      id: "usr_" + Date.now(),
      name: email ? email.split('@')[0].replace('.', ' ') : 'Campus User',
      email: email || `${role}@campus.edu`,
      role,
      category: role,
      badge: role === 'dean' ? 'Dean of Student Welfare' : role === 'warden' ? 'Hostel Warden' : role === 'staff' ? 'Senior Maintenance Supervisor' : 'Enrolled Student',
      department: role === 'warden' ? 'Hostel Administration' : role === 'dean' ? 'Deanery Office' : role === 'staff' ? 'Estate Maintenance' : 'Computer Science'
    };
    users.push(found);
    saveUsers();
  }

  res.json({
    success: true,
    token: "jwt_token_" + Date.now(),
    user: found
  });
});

// 12. Authentication: Register supporting all categories (student, warden, dean, staff)
app.post('/api/auth/register', (req, res) => {
  const body = req.body;
  const newUser = {
    id: "usr_" + Date.now(),
    name: body.name,
    email: body.email,
    role: body.category || "student",
    category: body.category || "student",
    rollNumber: body.rollNumber || null,
    staffId: body.staffId || null,
    department: body.department || "General",
    hostelAssigned: body.hostelAssigned || null,
    specialization: body.specialization || null,
    badge: body.category === 'dean' ? 'Dean of Student Welfare' : 
           body.category === 'warden' ? 'Hostel Warden' : 
           body.category === 'staff' ? 'Maintenance Supervisor' : 'Verified Student',
    avatar: body.category === 'dean' ? '🏛️' : body.category === 'warden' ? '👩‍🏫' : body.category === 'staff' ? '🔧' : '👨‍🎓'
  };

  users.push(newUser);
  saveUsers();

  res.status(201).json({ success: true, user: newUser });
});

// Start Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 CampusResolve Central Real-Time Server Running`);
  console.log(`🌐 HTTP URL:      http://localhost:${PORT}`);
  console.log(`⚡ WebSocket URL: ws://localhost:${PORT}`);
  console.log(`🏛️ UGC & SGRC Compliant Institutional Portal Ready`);
  console.log(`💾 Data Persistence: JSON file storage in ./data`);
  console.log(`=======================================================`);
});
