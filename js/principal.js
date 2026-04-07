document.addEventListener('DOMContentLoaded', () => {
  ParoquiaAuth.requireAuth();

  const PAROQUIA_INFO = window.ParoquiaDados ? window.ParoquiaDados.info : {};

  function setText(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value ? String(value) : '—';
  }

  let profile = ParoquiaAuth.getProfile();
  if (!profile) {
    ParoquiaAuth.logout();
    window.location.href = 'entrar.html';
    return;
  }

  // Preenche informações da paróquia
  setText('parish-name', PAROQUIA_INFO.name);
  setText('parish-priest', PAROQUIA_INFO.priest);
  setText('parish-address', PAROQUIA_INFO.address);
  setText('parish-phone', PAROQUIA_INFO.phone);
  setText('parish-email', PAROQUIA_INFO.email);
  setText('parish-mass-hours', PAROQUIA_INFO.massHours);

  const nameEl = document.getElementById('user-display-name');
  const emailEl = document.getElementById('user-email');
  const fnEl = document.getElementById('profile-firstname');
  const lnEl = document.getElementById('profile-lastname');
  const phEl = document.getElementById('profile-phone');
  const gEl = document.getElementById('profile-gender');

  const full = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.email;
  if (nameEl) nameEl.textContent = full;
  if (emailEl) emailEl.textContent = profile.email;
  if (fnEl) fnEl.textContent = profile.firstName || '—';
  if (lnEl) lnEl.textContent = profile.lastName || '—';
  if (phEl) phEl.textContent = profile.phone || '—';
  if (gEl) gEl.textContent = profile.gender || '—';

  const btn = document.getElementById('btn-sair');
  if (btn) {
    btn.addEventListener('click', () => {
      ParoquiaAuth.logout();
      window.location.href = 'entrar.html';
    });
  }
});
