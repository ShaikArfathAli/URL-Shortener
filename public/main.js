const host = "http://localhost:5000/";

// DOM Elements
const elements = {
  themeToggle: document.getElementById('theme-toggle'),
  themeIcon: document.getElementById('theme-icon'),
  body: document.body,
  createShortUrlBtn: document.querySelector("#create-short-url"),
  longUrlInput: document.querySelector("#longurl"),
  shortUrlDisplay: document.querySelector("#short-url"),
  urlTableBody: document.querySelector("#list_urls tbody"),
  clearAllBtn: document.querySelector("#clear-all")
};

// Theme Toggle Functionality
elements.themeToggle.addEventListener('click', toggleTheme);

function toggleTheme() {
  elements.body.classList.toggle('light');
  elements.body.classList.toggle('dark');
  const isDark = elements.body.classList.contains('dark');
  elements.themeIcon.innerHTML = isDark 
    ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>' 
    : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>';
}

// URL Shortener Functionality
elements.createShortUrlBtn.addEventListener("click", createShortUrl);

async function createShortUrl() {
  const longurl = elements.longUrlInput.value.trim();
  
  if (!validateUrl(longurl)) {
    showAlert("Please enter a valid URL starting with http:// or https://", "error");
    return;
  }

  try {
    const response = await fetch(`${host}api/create-short-url`, {
      method: "POST",
      body: JSON.stringify({ longurl }),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });
    
    const data = await response.json();
    
    if (data.status === "ok") {
      updateShortUrlDisplay(data.shorturlid);
      addUrlToTable(longurl, data.shorturlid);
      showAlert("URL shortened successfully!", "success");
    } else {
      throw new Error(data.message || "Failed to create short URL");
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert(error.message, "error");
  }
}

function validateUrl(url) {
  return url.length > 0 && (url.startsWith("http://") || url.startsWith("https://"));
}

function updateShortUrlDisplay(shorturlid) {
  elements.shortUrlDisplay.innerText = `${host}${shorturlid}`;
  elements.shortUrlDisplay.href = `${host}${shorturlid}`;
}

function addUrlToTable(longurl, shorturlid) {
  const html = `
    <tr>
      <td class="p-4 truncate max-w-xs">${longurl}</td>
      <td class="p-4"><a href="${host}${shorturlid}" target="_blank" class="hover:underline">${host}${shorturlid}</a></td>
      <td class="p-4">0</td>
      <td class="p-4">
        <button class="delete-btn px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors" data-shorturlid="${shorturlid}">
          Delete
        </button>
      </td>
    </tr>
  `;
  elements.urlTableBody.insertAdjacentHTML('afterbegin', html);
  
  // Add event listener to the new delete button
  const deleteBtn = elements.urlTableBody.querySelector(`[data-shorturlid="${shorturlid}"]`);
  deleteBtn.addEventListener('click', () => deleteUrl(shorturlid));
}

function renderUrlTable(urls) {
  let html = "";
  urls.forEach(url => {
    html += `
      <tr>
        <td class="p-4 truncate max-w-xs">${url.longurl}</td>
        <td class="p-4"><a href="${host}${url.shorturlid}" target="_blank" class="hover:underline">${host}${url.shorturlid}</a></td>
        <td class="p-4">${url.count}</td>
        <td class="p-4">
          <button class="delete-btn px-3 py-1 bg-blue-600 hover:bg-red-700 text-white rounded-lg transition-colors" data-shorturlid="${url.shorturlid}">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
  elements.urlTableBody.innerHTML = html;
  
  // Add event listeners to all delete buttons
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteUrl(btn.dataset.shorturlid));
  });
}

async function deleteUrl(shorturlid) {
  if (!confirm("Are you sure you want to delete this URL?")) {
    return;
  }

  try {
    const response = await fetch(`${host}api/delete-url/${shorturlid}`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    if (data.status === "ok") {
      // Remove the row from the table
      const row = document.querySelector(`[data-shorturlid="${shorturlid}"]`).closest('tr');
      if (row) {
        row.remove();
        showAlert("URL deleted successfully", "success");
      } else {
        // If row not found in DOM, reload the table
        loadAllUrls();
      }
    } else {
      throw new Error(data.message || "Failed to delete URL");
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert(error.message, "error");
  }
}

// Load all URLs on page load
document.addEventListener('DOMContentLoaded', loadAllUrls);

async function loadAllUrls() {
  try {
    const response = await fetch(`${host}api/get-all-short-urls`);
    const data = await response.json();
    
    if (Array.isArray(data)) {
      renderUrlTable(data);
    } else {
      throw new Error("Invalid data format received");
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert("Failed to load URLs. Please refresh the page.", "error");
  }
}

// Clear All Functionality
elements.clearAllBtn.addEventListener("click", clearAllUrls);

async function clearAllUrls() {
  if (!confirm("⚠️ Are you sure you want to delete ALL shortened URLs?\nThis action cannot be undone!")) {
    return;
  }

  try {
    const response = await fetch(`${host}api/clear-all-urls`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    if (data.status === "ok") {
      elements.urlTableBody.innerHTML = "";
      elements.shortUrlDisplay.innerText = "";
      elements.shortUrlDisplay.href = "#";
      showAlert("All URLs have been cleared successfully", "success");
    } else {
      throw new Error(data.message || "Failed to clear URLs");
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert(error.message, "error");
  }
}

// Notification System
function showAlert(message, type = "info") {
  const alertBox = document.createElement("div");
  alertBox.classList.add("alert", `alert-${type}`);
  alertBox.textContent = message;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 3000);
}
