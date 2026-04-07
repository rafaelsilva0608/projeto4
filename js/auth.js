/**
 * Autenticação local (demo): senhas com PBKDF2-SHA256 + sal por usuário.
 * Sessão em sessionStorage (encerra ao fechar a aba).
 */
(function (global) {
  const STORAGE_KEY = 'paroquia_users_v1';
  const SESSION_KEY = 'paroquia_session_v1';
  const SESSION_MAX_MS = 24 * 60 * 60 * 1000;
  const PBKDF2_ITERATIONS = 150000;
  const MIN_PASSWORD_LEN = 8;

  function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function getUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  function randomSalt() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    let bin = '';
    for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
    return btoa(bin);
  }

  async function hashPassword(password, saltB64) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    const saltBytes = Uint8Array.from(atob(saltB64), (c) => c.charCodeAt(0));
    const bits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256',
      },
      keyMaterial,
      256
    );
    const out = new Uint8Array(bits);
    let s = '';
    for (let i = 0; i < out.length; i++) s += String.fromCharCode(out[i]);
    return btoa(s);
  }

  function validatePasswordStrength(pw) {
    if (pw.length < MIN_PASSWORD_LEN) {
      return { ok: false, message: `A senha deve ter pelo menos ${MIN_PASSWORD_LEN} caracteres.` };
    }
    if (!/[a-zA-Z]/.test(pw) || !/[0-9]/.test(pw)) {
      return { ok: false, message: 'A senha deve incluir letras e números.' };
    }
    return { ok: true };
  }

  async function register(data) {
    const email = normalizeEmail(data.email);
    if (!email) return { ok: false, message: 'Informe um e-mail válido.' };

    const pw = data.password || '';
    const pw2 = data.confirmPassword || '';
    if (pw !== pw2) return { ok: false, message: 'As senhas não coincidem.' };

    const strength = validatePasswordStrength(pw);
    if (!strength.ok) return { ok: false, message: strength.message };

    const users = getUsers();
    if (users[email]) return { ok: false, message: 'Este e-mail já está cadastrado.' };

    const gender = data.gender || '';
    if (!gender) return { ok: false, message: 'Selecione uma opção de gênero.' };

    const salt = randomSalt();
    const passwordHash = await hashPassword(pw, salt);

    users[email] = {
      firstName: String(data.firstName || '').trim().slice(0, 80),
      lastName: String(data.lastName || '').trim().slice(0, 80),
      phone: String(data.phone || '').trim().slice(0, 30),
      gender,
      passwordHash,
      salt,
      createdAt: Date.now(),
    };
    saveUsers(users);

    setSession(email);
    return { ok: true, message: 'Cadastro realizado com sucesso.' };
  }

  async function login(emailRaw, password) {
    const email = normalizeEmail(emailRaw);
    const users = getUsers();
    const user = users[email];
    if (!user) {
      await delayOnFailure();
      return { ok: false, message: 'E-mail ou senha incorretos.' };
    }
    const hash = await hashPassword(password, user.salt);
    if (hash !== user.passwordHash) {
      await delayOnFailure();
      return { ok: false, message: 'E-mail ou senha incorretos.' };
    }
    setSession(email);
    return { ok: true, message: 'Login realizado.' };
  }

  let failCount = 0;
  async function delayOnFailure() {
    failCount += 1;
    const ms = Math.min(2000, 300 + failCount * 200);
    await new Promise((r) => setTimeout(r, ms));
  }

  function setSession(email) {
    const payload = {
      email,
      exp: Date.now() + SESSION_MAX_MS,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    failCount = 0;
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function isLoggedIn() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return false;
      const p = JSON.parse(raw);
      if (!p.email || !p.exp) return false;
      if (Date.now() > p.exp) {
        logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  function getSessionEmail() {
    if (!isLoggedIn()) return null;
    try {
      const p = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      return p.email || null;
    } catch {
      return null;
    }
  }

  function getProfile() {
    const email = getSessionEmail();
    if (!email) return null;
    const users = getUsers();
    const u = users[email];
    if (!u) return null;
    return {
      email,
      firstName: u.firstName,
      lastName: u.lastName,
      phone: u.phone,
      gender: u.gender,
    };
  }

  /** Redireciona para login se não autenticado */
  function requireAuth() {
    if (!isLoggedIn()) {
      global.location.href = 'entrar.html';
    }
  }

  /** Redireciona para principal se já logado (telas de login/cadastro) */
  function redirectIfLoggedIn() {
    if (isLoggedIn()) {
      global.location.href = 'pagina_principal.html';
    }
  }

  global.ParoquiaAuth = {
    register,
    login,
    logout,
    isLoggedIn,
    getSessionEmail,
    getProfile,
    requireAuth,
    redirectIfLoggedIn,
    normalizeEmail,
  };
})(typeof window !== 'undefined' ? window : globalThis);
