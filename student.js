document.addEventListener("DOMContentLoaded", () => {
  loadMyComplaints();
});

async function loadMyComplaints() {
  const container = document.getElementById("myComplaints");
  container.innerHTML = "Loading...";

  try {
    const complaints = await apiFetch("/complaints/my");

    container.innerHTML = "";

    complaints.forEach(c => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h3>${c.title}</h3>
        <p>Category: ${c.category}</p>
        <p>Status: ${c.status}</p>
      `;
      container.appendChild(card);
    });

  } catch (err) {
    container.innerHTML = "Error loading complaints.";
  }
}

document.getElementById("complaintForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const category = document.getElementById("category").value;
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  try {
    await apiFetch("/complaints", {
      method: "POST",
      body: JSON.stringify({ category, title, description })
    });

    alert("Complaint submitted!");
    loadMyComplaints();

  } catch (err) {
    alert("Error: " + err.message);
  }
});