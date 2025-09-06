import { navigate } from '../app.js';
import { renderPostsTable } from './postsTable.js';
import { renderEditor } from './editor.js';

export function renderShell(container, path) {
  container.innerHTML = `
    <div class="dashboard">
      <header class="header">
        <h1>Posts Dashboard</h1>
        <button id="logoutBtn">Logout</button>
      </header>
      <aside class="sidebar">
        <nav>
          <ul>
            <li><a href="/dashboard" data-link>Posts</a></li>
            <li><a href="/dashboard/editor" data-link>New Post</a></li>
          </ul>
        </nav>
      </aside>
      <main class="main" id="mainContent"></main>
    </div>
  `;

  document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  container.querySelectorAll('[data-link]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(link.getAttribute('href'));
    });
  });

  const main = document.getElementById('mainContent');
  if (path === '/dashboard' || path === '/dashboard/') {
    renderPostsTable(main);
  } else if (path.startsWith('/dashboard/editor')) {
    renderEditor(main, path);
  }
}
