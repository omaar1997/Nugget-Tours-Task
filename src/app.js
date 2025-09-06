import { renderLogin } from './ui/login.js';
import { renderShell } from './ui/shell.js';

const app = document.getElementById('app');

export function navigate(path) {
  history.pushState({}, '', path);
  router();
}

function router() {
  const token = localStorage.getItem('authToken');
  const path = location.pathname;

  if (!token && path !== '/login') {
    navigate('/login');
    return;
  }

  if (token && path === '/login') {
    navigate('/dashboard');
    return;
  }

  if (path.startsWith('/dashboard')) {
    renderShell(app, path);
  } else if (path === '/login') {
    renderLogin(app);
  } else {
    navigate('/login');
  }
}

window.addEventListener('popstate', router);
router();
