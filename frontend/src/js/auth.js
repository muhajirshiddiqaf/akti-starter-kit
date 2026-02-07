/**
 * Integrasi Login & Register dengan Backend API
 * Token disimpan di localStorage, redirect setelah sukses.
 * Panggilan API langsung ke backend (port 3000) agar terlihat di Network tab.
 */
const API_BASE =
  typeof window !== "undefined" && window.API_BASE_URL
    ? window.API_BASE_URL
    : "http://localhost:3000";

function getJson(res) {
  return res.json().then((data) => ({ ok: res.ok, status: res.status, data }));
}

function showError(containerId, message) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.textContent = message;
  el.classList.remove("hidden");
  el.classList.add("block");
}

function hideError(containerId) {
  const el = document.getElementById(containerId);
  if (el) {
    el.classList.add("hidden");
    el.textContent = "";
  }
}

function initLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError("loginError");
    const btn = form.querySelector('button[type="submit"]');
    const email = form.querySelector('input[name="email"]')?.value?.trim();
    const password = form.querySelector('input[name="password"]')?.value;
    if (!email || !password) {
      showError("loginError", "Email dan password wajib diisi.");
      return;
    }
    btn.disabled = true;
    btn.textContent = "Memproses...";
    try {
      const { ok, status, data } = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }).then(getJson);
      if (ok && data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "index.html";
        return;
      }
      showError("loginError", data?.message || `Login gagal (${status}).`);
    } catch (err) {
      showError("loginError", "Koneksi gagal. Periksa backend atau proxy.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Sign In";
    }
  });
}

function initRegisterForm() {
  const form = document.getElementById("registerForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError("registerError");
    const btn = form.querySelector('button[type="submit"]');
    const nameEl = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="email"]')?.value?.trim();
    const password = form.querySelector('input[name="password"]')?.value;
    const name = nameEl?.value?.trim() || null;
    if (!email || !password) {
      showError("registerError", "Email dan password wajib diisi.");
      return;
    }
    if (password.length < 6) {
      showError("registerError", "Password minimal 6 karakter.");
      return;
    }
    btn.disabled = true;
    btn.textContent = "Memproses...";
    try {
      const { ok, status, data } = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      }).then(getJson);
      if (ok && data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "index.html";
        return;
      }
      showError("registerError", data?.message || `Registrasi gagal (${status}).`);
    } catch (err) {
      showError("registerError", "Koneksi gagal. Periksa backend atau proxy.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Sign Up";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initRegisterForm();
});
