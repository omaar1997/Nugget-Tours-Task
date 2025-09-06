import { navigate } from '../app.js';

export function renderLogin(container) {
  container.innerHTML = `
    <div class="container">
      <h2>Login</h2>
      <form id="loginForm">
        <div>
          <label>Email</label><br>
          <input type="email" id="loginEmail" required>
        </div>
        <div>
          <label>Password</label><br>
          <input type="password" id="loginPassword" required minlength="6">
        </div>
        <button type="submit">Login</button>
        <p id="loginError" style="color:red" aria-live="polite"></p>
      </form>
    </div>
  `;

  document.getElementById('loginEmail').focus();

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const error = document.getElementById('loginError');

    if (!/\S+@\S+\.\S+/.test(email)) {
      error.textContent = 'Invalid email';
      return;
    }
    if (password.length < 6) {
      error.textContent = 'Password must be at least 6 chars';
      return;
    }

    localStorage.setItem('authToken', 'mock-token');
    navigate('/dashboard');
  });
}
