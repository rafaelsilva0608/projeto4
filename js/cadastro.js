document.addEventListener('DOMContentLoaded', () => {
  if (window.ParoquiaAuth) ParoquiaAuth.redirectIfLoggedIn();

  const form = document.getElementById('form-cadastro');
  const msg = document.getElementById('form-message');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    msg.className = 'form-message';

    const genderEl = form.querySelector('input[name="gender"]:checked');
    const result = await ParoquiaAuth.register({
      firstName: document.getElementById('firstname').value,
      lastName: document.getElementById('lastname').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('number').value,
      password: document.getElementById('password').value,
      confirmPassword: document.getElementById('confirmPassword').value,
      gender: genderEl ? genderEl.value : '',
    });

    if (result.ok) {
      msg.classList.add('form-message--ok');
      msg.textContent = result.message;
      setTimeout(() => {
        window.location.href = 'pagina_principal.html';
      }, 400);
    } else {
      msg.classList.add('form-message--err');
      msg.textContent = result.message;
    }
  });
});
