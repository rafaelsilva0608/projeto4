document.addEventListener('DOMContentLoaded', () => {
  if (window.ParoquiaAuth) ParoquiaAuth.requireAuth();

  const profile = ParoquiaAuth.getProfile();
  if (!profile) {
    ParoquiaAuth.logout();
    window.location.href = 'entrar.html';
    return;
  }

  const dados = window.ParoquiaDados || { info: {}, massSchedule: [] };
  const info = dados.info || {};
  const schedule = Array.isArray(dados.massSchedule) ? dados.massSchedule : [];

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  const nameEl = document.getElementById('user-display-name');
  if (nameEl) {
    const full = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.email;
    nameEl.textContent = full;
  }

  const strip = document.getElementById('parish-strip');
  if (strip) {
    const line = (info.address || '').split('\n')[0] || info.address || '';
    strip.textContent = [info.phone, line].filter(Boolean).join(' · ') || '—';
  }

  const brand = document.getElementById('parish-brand-title');
  if (brand) brand.textContent = info.name || 'Paróquia';

  const footName = document.getElementById('footer-parish-name');
  if (footName) footName.textContent = info.name || 'Paróquia';

  const footContact = document.getElementById('footer-contact');
  if (footContact) {
    const addr = (info.address || '')
      .split('\n')
      .map((line) => escapeHtml(line))
      .join('<br>');
    const priestLine = info.priest ? `Pároco: ${escapeHtml(info.priest)}` : '';
    const phoneLine = info.phone ? escapeHtml(info.phone) : '';
    const emailLine = info.email
      ? `<a href="mailto:${escapeHtml(info.email)}">${escapeHtml(info.email)}</a>`
      : '';
    footContact.innerHTML =
      [priestLine, addr, phoneLine, emailLine].filter(Boolean).join('<br>') || '—';
  }

  const y = document.getElementById('footer-year');
  if (y) y.textContent = String(new Date().getFullYear());

  const btn = document.getElementById('btn-sair');
  if (btn) {
    btn.addEventListener('click', () => {
      ParoquiaAuth.logout();
      window.location.href = 'entrar.html';
    });
  }

  const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const dayButtonsRoot = document.getElementById('day-buttons');
  let selectedDay = null;

  function renderDayButtons() {
    if (!dayButtonsRoot) return;
    dayButtonsRoot.innerHTML = '';
    const all = document.createElement('button');
    all.type = 'button';
    all.className = 'day-btn is-active';
    all.textContent = 'Todos';
    all.dataset.day = '';
    dayButtonsRoot.appendChild(all);
    DIAS.forEach((d) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'day-btn';
      b.textContent = d;
      b.dataset.day = d;
      dayButtonsRoot.appendChild(b);
    });
    dayButtonsRoot.querySelectorAll('.day-btn').forEach((btnEl) => {
      btnEl.addEventListener('click', () => {
        dayButtonsRoot.querySelectorAll('.day-btn').forEach((x) => x.classList.remove('is-active'));
        btnEl.classList.add('is-active');
        selectedDay = btnEl.dataset.day || null;
        renderTable();
      });
    });
  }

  function normTime(s) {
    return String(s || '')
      .trim()
      .replace(/\./g, ':');
  }

  function timeToMinutes(t) {
    const m = normTime(t).match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
  }

  function rowMatchesFilters(row) {
    if (selectedDay && row.day !== selectedDay) return false;

    const infoInput = (document.getElementById('horario-info') && document.getElementById('horario-info').value) || '';
    const initialInput = document.getElementById('horario-inicial') && document.getElementById('horario-inicial').value;

    if (infoInput.trim()) {
      const needle = infoInput.trim().toLowerCase();
      const hay = row.times.map((x) => normTime(x).toLowerCase()).join(' ');
      if (!hay.includes(needle)) return false;
    }

    if (initialInput) {
      const tMin = timeToMinutes(initialInput);
      if (tMin != null) {
        const ok = row.times.some((t) => {
          const tm = timeToMinutes(t);
          return tm != null && tm >= tMin;
        });
        if (!ok) return false;
      }
    }

    return true;
  }

  function renderTable() {
    const tbody = document.getElementById('schedule-tbody');
    const empty = document.getElementById('schedule-empty');
    if (!tbody) return;

    tbody.innerHTML = '';
    const rows = schedule.filter(rowMatchesFilters);

    rows.forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(row.parish)}</td>
        <td>${escapeHtml(row.locality)}</td>
        <td>${escapeHtml(row.day)}</td>
        <td>${escapeHtml(row.times.join(', '))}</td>
      `;
      tbody.appendChild(tr);
    });

    if (empty) {
      empty.hidden = rows.length > 0;
    }
  }

  const hi = document.getElementById('horario-info');
  const ht = document.getElementById('horario-inicial');
  if (hi) hi.addEventListener('input', () => renderTable());
  if (ht) ht.addEventListener('input', () => renderTable());

  renderDayButtons();
  renderTable();
});
