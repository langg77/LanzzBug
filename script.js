// === Elemen DOM ===
const popup = document.getElementById("popup");
const popupTo = document.getElementById("popupTo");
const popupBugType = document.getElementById("popupBugType");
const waitText = document.getElementById("waitText");
const inputNumber = document.getElementById("number");
const bugTypeSelect = document.getElementById("bugType");
const historyBox = document.getElementById("historyBox");
const historyList = document.getElementById("historyList");
const historyIcon = document.querySelector(".history-icon");
const sendBtn = document.getElementById("sendBug");
const popupError = document.getElementById("popupError");
const popupErrorText = document.getElementById("popupErrorText");
const closePopupBtn = document.getElementById("closePopup");
const botStatus = document.getElementById("botStatus");
const clearHistoryBtn = document.getElementById("clearHistory");

// === Data ===
let history = JSON.parse(localStorage.getItem("bugHistory")) || [];
let bugSpamCount = 0;
let isBotActive = true;
const COOLDOWN_MINUTES = 10;
const BUG_COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;

// === Fungsi Utilitas ===
function closePopup() {
  popup.style.display = "none";
}

function showPopupError(message) {
  popupErrorText.textContent = message;
  popupError.style.display = "flex";
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateHistoryUI() {
  historyList.innerHTML = "";
  history.slice(-5).reverse().forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.number} (${item.type})`;
    historyList.appendChild(li);
  });
  historyBox.style.display = history.length ? "block" : "none";
}

function getCooldownRemaining() {
  const lastTime = localStorage.getItem("bugServerBusyUntil");
  if (!lastTime) return 0;
  const remaining = parseInt(lastTime, 10) - Date.now();
  return remaining > 0 ? remaining : 0;
}

function deactivateBot() {
  isBotActive = false;
  bugSpamCount = 0;

  botStatus.textContent = "Server Sibuk";
  botStatus.classList.add("inactive");
  sendBtn.disabled = true;

  const interval = setInterval(() => {
    const remaining = getCooldownRemaining();
    if (remaining <= 0) {
      clearInterval(interval);
      activateBot();
    } else {
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      sendBtn.textContent = `Wait ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    }
  }, 1000);
}

function activateBot() {
  isBotActive = true;
  bugSpamCount = 0;
  sendBtn.disabled = false;
  sendBtn.textContent = "SEND BUG";
  botStatus.classList.remove("inactive");
  localStorage.removeItem("bugServerBusyUntil");
}

// === Event: Error Popup Close ===
closePopupBtn?.addEventListener("click", () => {
  popupError.style.display = "none";
});

// === Event: Toggle History ===
historyIcon?.addEventListener("click", () => {
  if (historyBox.style.display === "block") {
    historyBox.style.display = "none";
  } else {
    updateHistoryUI();
    historyBox.style.display = "block";
  }
});

// === Event: Clear History ===
clearHistoryBtn?.addEventListener("click", () => {
  if (confirm("Yakin ingin menghapus riwayat?")) {
    history = [];
    localStorage.removeItem("bugHistory");
    updateHistoryUI();
  }
});

// === Event: SEND BUG Button ===
sendBtn?.addEventListener("click", async () => {
  if (!isBotActive) return;

  const number = inputNumber.value.trim();
  const type = bugTypeSelect.value;

  // Validasi input
  if (!number.startsWith("628")) {
    showPopupError("Nomor harus diawali dengan 628");
    return;
  }
  if (number.length > 13) {
    showPopupError("Maksimal 13 digit angka.");
    return;
  }
  if (!/^\d+$/.test(number)) {
    showPopupError("Nomor hanya boleh mengandung angka.");
    return;
  }

  // Efek loading
  waitText.textContent = "wait.";
  await delay(500);
  waitText.textContent = "wait..";
  await delay(500);
  waitText.textContent = "wait...";
  await delay(500);
  waitText.textContent = "";

  // Simulasi popup sukses
  popupTo.textContent = number;
  popupBugType.textContent = type;
  popup.style.display = "flex";

  // Simpan history
  history.push({ number, type });
  localStorage.setItem("bugHistory", JSON.stringify(history));
  updateHistoryUI();

  // Hitung spam
  bugSpamCount++;
  if (bugSpamCount >= 3) {
    const busyTime = Date.now() + BUG_COOLDOWN_MS;
    localStorage.setItem("bugServerBusyUntil", busyTime.toString());
    deactivateBot();
  }
});

// === Inisialisasi saat load ===
const bugBusyUntil = localStorage.getItem("bugServerBusyUntil");
if (bugBusyUntil && Date.now() < parseInt(bugBusyUntil, 10)) {
  deactivateBot();
} else {
  activateBot();
}

const accounts = [
    { user: "lanzz", pass: "free", used: false }
];

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const loginError = document.getElementById("loginError");
    const loginScreen = document.getElementById("loginScreen");
    const attackMenu = document.getElementById("attackContainer");

    const account = accounts.find(acc => acc.user === username && acc.pass === password);

    if (account) {
        if (account.used) {
            loginError.textContent = "Akun sudah digunakan!";
            loginError.style.display = "block";
        } else {
            account.used = true;
            localStorage.setItem("loggedInUser", username);
            loginScreen.style.display = "none";
            attackMenu.style.display = "block";
            loginError.style.display = "none";
        }
    } else {
        loginError.textContent = "Username / Password salah!";
        loginError.style.display = "block";
    }
}

function logout() {
    const attackContainer = document.getElementById("attackContainer");
    const loginScreen = document.getElementById("loginScreen");

    if (attackContainer && loginScreen) {
        attackContainer.style.display = "none";
        loginScreen.style.display = "flex";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        localStorage.removeItem("loggedInUser");
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    location.reload();
}

// Auto login kalau sudah ada user
window.onload = function () {
    const loggedInUser = localStorage.getItem("loggedInUser");
    const attackMenu = document.getElementById("attackContainer");
    const loginScreen = document.getElementById("loginScreen");

    if (loggedInUser) {
        loginScreen.style.display = "none";
        attackMenu.style.display = "block";
    }
};

// === Info Button Popup ===
const infoBtn = document.getElementById("infoBtn");
const infoPopup = document.getElementById("infoPopup");

infoBtn.addEventListener("click", () => {
    const isVisible = infoPopup.style.display === "block";
    infoPopup.style.display = isVisible ? "none" : "block";
});

document.addEventListener("click", (e) => {
    if (!infoBtn.contains(e.target) && !infoPopup.contains(e.target)) {
        infoPopup.style.display = "none";
    }
});
