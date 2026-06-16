    // ── app.js ────────────────────────────────────────────────────────────────────
// Players CRUD — conecta con /api/items (GET · POST · DELETE)
// ─────────────────────────────────────────────────────────────────────────────

const API = "http://localhost:3000/api/items";

// ── DOM refs ─────────────────────────────────────────────────────────────────
const playersList = document.getElementById("players-list");
const loader      = document.getElementById("loader");
const emptyState  = document.getElementById("empty");
const countLabel  = document.getElementById("count-label");
const inpName     = document.getElementById("inp-name");
const inpAge      = document.getElementById("inp-age");
const btnAdd      = document.getElementById("btn-add");
const formError   = document.getElementById("form-error");

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = "ok") {
  const toast    = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");
  const toastIcon= document.getElementById("toast-icon");

  const styles = {
    ok:  { border: "var(--accent)",  icon: "✓" },
    err: { border: "var(--danger)",  icon: "✕" },
    del: { border: "var(--accent2)", icon: "🗑" },
  };

  const s = styles[type] || styles.ok;
  toast.style.borderColor = s.border;
  toastIcon.textContent   = s.icon;
  toastMsg.textContent    = msg;
  toast.classList.remove("hidden");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 3000);
}

// ── Render helpers ────────────────────────────────────────────────────────────
function renderRow(player, index) {
  const row = document.createElement("div");
  row.className = "player-row grid grid-cols-12 items-center px-5 py-3.5 text-sm font-mono";
  row.style.cssText = `
    border-bottom: 1px solid var(--border);
    animation-delay: ${index * 40}ms;
  `;
  row.dataset.id = player.Id;

  row.innerHTML = `
    <span class="col-span-1 text-xs" style="color:var(--muted);">${player.Id}</span>
    <span class="col-span-5" style="color:var(--text);">${escapeHtml(player.name)}</span>
    <span class="col-span-4">
      <span class="inline-block px-2 py-0.5 rounded text-xs font-bold"
            style="background:#1a2a1f; color:var(--accent);">${player.age} age</span>
    </span>
    <span class="col-span-2 flex justify-end">
      <button class="btn-del p-1.5 rounded" data-id="${player.Id}" title="Eliminar">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6"/><path d="M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </span>
  `;

  row.querySelector("button[data-id]").addEventListener("click", () => deletePlayer(player.Id));
  return row;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function setLoading(on) {
  loader.classList.toggle("hidden", !on);
}

function updateEmpty(count) {
  if (count === 0) {
    emptyState.classList.remove("hidden");
    emptyState.classList.add("flex");
  } else {
    emptyState.classList.add("hidden");
    emptyState.classList.remove("flex");
  }
  countLabel.textContent = count > 0 ? `${count} player${count !== 1 ? "s" : ""} registered` : "";
}

// ── API calls ─────────────────────────────────────────────────────────────────
async function loadPlayers() {
  setLoading(true);
  playersList.innerHTML = "";
  try {
    const res  = await fetch(API);
    console.log(res);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    setLoading(false);
    updateEmpty(data.length);
    data.forEach((p, i) => playersList.appendChild(renderRow(p, i)));
  } catch (err) {
    setLoading(false);
    showToast("Error al cargar jugadores", "err");
    console.error(err);
  }
}

async function addPlayer() {
  const name = inpName.value.trim();
  const age  = parseInt(inpAge.value, 10);

  // Validation
  formError.classList.add("hidden");
  if (!name) {
    formError.textContent = "El nombre no puede estar vacío.";
    formError.classList.remove("hidden");
    inpName.focus();
    return;
  }
  if (!age || age < 1 || age > 120) {
    formError.textContent = "Ingresa una edad válida (1–120).";
    formError.classList.remove("hidden");
    inpAge.focus();
    return;
  }

  btnAdd.disabled = true;
  btnAdd.textContent = "...";

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, age:age }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    inpName.value = "";
    inpAge.value  = "";
    showToast(`Jugador "${name}" agregado`, "ok");
    await loadPlayers();
  } catch (err) {
    showToast(err.message || "Error al agregar", "err");
  } finally {
    btnAdd.disabled = false;
    btnAdd.textContent = "Agregar";
  }
}

async function deletePlayer(id) {
  const row = playersList.querySelector(`[data-id="${id}"]`);

  // Fade out the row before removal
  if (row) {
    row.style.transition = "opacity 0.2s, transform 0.2s";
    row.style.opacity    = "0";
    row.style.transform  = "translateX(12px)";
    await new Promise(r => setTimeout(r, 200));
  }

  try {
    const res = await fetch(`${API}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    showToast(`Jugador #${id} eliminado`, "del");
    await loadPlayers();
  } catch (err) {
    showToast(err.message || "Error al eliminar", "err");
    await loadPlayers(); // re-render to restore row
  }
}

// ── Event listeners ───────────────────────────────────────────────────────────
btnAdd.addEventListener("click", addPlayer);

inpName.addEventListener("keydown", (e) => { if (e.key === "Enter") inpAge.focus(); });
inpAge.addEventListener("keydown",  (e) => { if (e.key === "Enter") addPlayer(); });

// ── Init ──────────────────────────────────────────────────────────────────────
loadPlayers();