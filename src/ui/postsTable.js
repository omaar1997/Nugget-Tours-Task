import { state, fetchPosts } from '../state.js';
import { navigate } from '../app.js';

export async function renderPostsTable(container) {
  if (state.posts.length === 0 && !state.loading) {
    await fetchPosts();
  }

  const render = () => {
    container.innerHTML = `
      <div>
        <input type="text" id="searchInput" placeholder="Search posts..." />
        <select id="pageSize">
          <option>5</option>
          <option>10</option>
          <option>20</option>
        </select>
        <div id="tableWrapper"></div>
        <div id="pagination"></div>
      </div>
    `;

    const searchInput = container.querySelector('#searchInput');
    const pageSizeSelect = container.querySelector('#pageSize');
    const tableWrapper = container.querySelector('#tableWrapper');
    const pagination = container.querySelector('#pagination');

    let currentPage = 1;
    let pageSize = 5;
    let sortKey = 'id';
    let sortAsc = true;

    function applyFilters() {
      let posts = [...state.posts];
      const q = searchInput.value.toLowerCase();
      if (q) {
        posts = posts.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q)
        );
      }
      posts.sort((a, b) => {
        let x = a[sortKey], y = b[sortKey];
        if (typeof x === 'string') x = x.toLowerCase();
        if (typeof y === 'string') y = y.toLowerCase();
        if (x < y) return sortAsc ? -1 : 1;
        if (x > y) return sortAsc ? 1 : -1;
        return 0;
      });
      return posts;
    }

    function renderTable() {
      const posts = applyFilters();
      const totalPages = Math.ceil(posts.length / pageSize);
      const start = (currentPage - 1) * pageSize;
      const pageItems = posts.slice(start, start + pageSize);

      if (state.loading) {
        tableWrapper.innerHTML = '<p>Loading...</p>';
        return;
      }
      if (state.error) {
        tableWrapper.innerHTML = '<p style="color:red">Error: ' + state.error + '</p>';
        return;
      }
      if (posts.length === 0) {
        tableWrapper.innerHTML = '<p>No posts found.</p>';
        return;
      }

      tableWrapper.innerHTML = `
        <table>
          <thead>
            <tr>
              <th><button data-sort="id">ID</button></th>
              <th><button data-sort="title">Title</button></th>
              <th>Body</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.map(p => `
              <tr>
                <td>${p.id}</td>
                <td>${p.title}</td>
                <td>${p.body}</td>
                <td><button data-edit="${p.id}">Edit</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;

      // Edit buttons
      tableWrapper.querySelectorAll('button[data-edit]').forEach(btn => {
        btn.addEventListener('click', () => {
          navigate('/dashboard/editor?id=' + btn.getAttribute('data-edit'));
        });
      });

      pagination.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        if (i === currentPage) btn.disabled = true;
        btn.onclick = () => { currentPage = i; renderTable(); };
        pagination.appendChild(btn);
      }
    }

    searchInput.addEventListener('input', () => { currentPage = 1; renderTable(); });
    pageSizeSelect.addEventListener('change', () => {
      pageSize = parseInt(pageSizeSelect.value, 10);
      currentPage = 1;
      renderTable();
    });
    container.addEventListener('click', (e) => {
      if (e.target.matches('th button')) {
        const key = e.target.dataset.sort;
        if (sortKey === key) sortAsc = !sortAsc;
        else { sortKey = key; sortAsc = true; }
        renderTable();
      }
    });

    renderTable();
  };

  render();
}
