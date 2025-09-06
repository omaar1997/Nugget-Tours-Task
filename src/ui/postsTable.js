import { fetchPosts, posts } from '../state.js';
import { renderEditor } from './editor.js';

let currentPage = 1;
let pageSize = 5;
let currentSort = { key: 'id', direction: 'asc' };
let searchQuery = '';

function sortData(data) {
  const { key, direction } = currentSort;
  return [...data].sort((a, b) => {
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

function filterData(data) {
  if (!searchQuery) return data;
  return data.filter(
    p =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.body.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

function paginateData(data) {
  const start = (currentPage - 1) * pageSize;
  return data.slice(start, start + pageSize);
}

export async function renderPostsTable(root) {
  root.innerHTML = '<p>Loading...</p>';
  try {
    let data = posts.length ? posts : await fetchPosts();
    if (!data.length) {
      root.innerHTML = '<p>No posts found.</p>';
      return;
    }

    // filter, sort, paginate
    let filtered = filterData(data);
    let sorted = sortData(filtered);
    let paginated = paginateData(sorted);

    const container = document.createElement('div');

    // Search & controls
    container.innerHTML = `
      <div style="margin-bottom: 1rem;">
        <input type="text" id="searchInput" placeholder="Search..." value="${searchQuery}" />
        <label> Page size:
          <select id="pageSize">
            <option value="5" ${pageSize == 5 ? 'selected' : ''}>5</option>
            <option value="10" ${pageSize == 10 ? 'selected' : ''}>10</option>
            <option value="20" ${pageSize == 20 ? 'selected' : ''}>20</option>
          </select>
        </label>
      </div>
      <table border="1" style="width:100%; border-collapse:collapse;">
        <thead>
          <tr>
            <th><button data-sort="id">ID</button></th>
            <th><button data-sort="title">Title</button></th>
            <th>Body</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${paginated
            .map(
              p => `
            <tr>
              <td>${p.id}</td>
              <td>${p.title}</td>
              <td>${p.body}</td>
              <td><button data-id="${p.id}">Edit</button></td>
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      <div style="margin-top: 1rem; display:flex; gap:1rem; align-items:center;">
        <button id="prevPage">Prev</button>
        <span>Page ${currentPage} of ${Math.ceil(filtered.length / pageSize)}</span>
        <button id="nextPage">Next</button>
      </div>
    `;

    root.innerHTML = '';
    root.appendChild(container);

    // Events
    container.querySelector('#searchInput').addEventListener('input', e => {
      searchQuery = e.target.value;
      currentPage = 1;
      renderPostsTable(root);
    });

    container.querySelector('#pageSize').addEventListener('change', e => {
      pageSize = parseInt(e.target.value);
      currentPage = 1;
      renderPostsTable(root);
    });

    container.querySelectorAll('th button[data-sort]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.sort;
        if (currentSort.key === key) {
          currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
          currentSort = { key, direction: 'asc' };
        }
        renderPostsTable(root);
      });
    });

    container.querySelector('#prevPage').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderPostsTable(root);
      }
    });

    container.querySelector('#nextPage').addEventListener('click', () => {
      if (currentPage < Math.ceil(filtered.length / pageSize)) {
        currentPage++;
        renderPostsTable(root);
      }
    });

    container.querySelectorAll('button[data-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const post = data.find(p => p.id === id);
        renderEditor(root, post);
      });
    });
  } catch (err) {
    root.innerHTML = '<p>Error loading posts.</p>';
  }
}
