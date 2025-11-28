document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  msg.textContent = "Logging in...";

  try {
    const res = await fetch(API_BASE + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw await res.json();

    const { token, role } = await res.json();

    localStorage.setItem("auth_token", token);
    localStorage.setItem("role", role);

    msg.textContent = "Success! Redirecting...";

    if (role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "student-dashboard.html";
    }

  } catch (err) {
    msg.textContent = err.message || "Login failed";
  }
});