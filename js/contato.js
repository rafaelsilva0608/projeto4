document.addEventListener('DOMContentLoaded', () => {
  if (window.ParoquiaAuth) ParoquiaAuth.requireAuth();

  const profile = ParoquiaAuth.getProfile();
  if (!profile) {
    ParoquiaAuth.logout();
    window.location.href = 'entrar.html';
    return;
  }

  const nameEl = document.getElementById('user-display-name');
  if (nameEl) {
    const full = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.email;
    nameEl.textContent = full;
  }

  const btn = document.getElementById('btn-sair');
  if (btn) {
    btn.addEventListener('click', () => {
      ParoquiaAuth.logout();
      window.location.href = 'entrar.html';
    });
  }
});
