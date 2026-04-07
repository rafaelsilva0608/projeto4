document.addEventListener('DOMContentLoaded', () => {
  if (window.ParoquiaAuth) ParoquiaAuth.redirectIfLoggedIn();

  const form = document.getElementById('form-login');
  const msg = document.getElementById('form-message');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    msg.className = 'form-message';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const result = await ParoquiaAuth.login(email, password);

    if (result.ok) {
      msg.classList.add('form-message--ok');
      msg.textContent = result.message;
      setTimeout(() => {
        window.location.href = 'pagina_principal.html';
      }, 300);
    } else {
      msg.classList.add('form-message--err');
      msg.textContent = result.message;
    }
  });
});
