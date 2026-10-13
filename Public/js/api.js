/**
 * CampusResolve AI - Resilient API & Local Engine Bridge
 * Provides universal HTTP client and unified REST endpoints with offline fallback
 */

const API_BASE = (typeof window !== 'undefined' && window.location && window.location.origin) 
  ? `${window.location.origin}/api` 
  : '/api';

function getToken() {
  return localStorage.getItem("auth_token") || "mock_jwt_token_campusresolve";
}

async function apiFetch(path, options = {}) {
  try {
    const headers = options.headers || {};
    const token = getToken();

    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout

    const res = await fetch(API_BASE + path, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.info(`[CampusResolve Local Engine] Network fallback for '${path}'.`, err.message);
    return handleLocalFallback(path, options);
  }
}

function handleLocalFallback(path, options) {
  const store = window.CampusResolve;
  if (!store) return { success: false, data: [] };

  if (path.includes("/complaints/my")) {
    const currentUser = store.getCurrentUser();
    const all = store.getAllGrievances();
    return { success: true, data: all.filter(g => g.studentEmail === currentUser.email || g.studentName === currentUser.name) };
  }

  if (path.includes("/complaints") && options.method === "POST") {
    const body = JSON.parse(options.body || "{}");
    return { success: true, data: store.addGrievance(body) };
  }

  if (path.includes("/stats")) {
    return { success: true, data: store.getAnalytics() };
  }

  if (path.includes("/complaints")) {
    return { success: true, data: store.getAllGrievances() };
  }

  return { success: true };
}

window.apiFetch = apiFetch;
window.getToken = getToken;
window.API_BASE = API_BASE;