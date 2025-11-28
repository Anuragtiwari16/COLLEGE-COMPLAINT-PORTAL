const API_BASE = "http://localhost:5000/api";   // change if needed

function getToken() {
  return localStorage.getItem("auth_token");
}

async function apiFetch(path, options = {}) {
  const headers = options.headers || {};
  const token = getToken();

  if (token) headers["Authorization"] = Bearer ${token};
  headers["Content-Type"] = "application/json";

  const res = await fetch(API_BASE + path, {
    ...options,
    headers
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw err;
  }

  return res.json();
}