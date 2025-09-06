import { navigate } from '../app.js';
import { state, createPost, updatePost } from '../state.js';

export function renderEditor(container, path) {
  const params = new URLSearchParams(path.split('?')[1]);
  const id = params.get('id');
  let editingPost = null;
  if (id) editingPost = state.posts.find(p => String(p.id) === id);

  container.innerHTML = `
    <div class="container">
      <h2>${editingPost ? 'Edit Post' : 'New Post'}</h2>
      <form id="editorForm">
        <div>
          <label>Title</label><br>
          <input type="text" name="title" value="${editingPost ? editingPost.title : ''}" required>
        </div>
        <div>
          <label>Body</label><br>
          <textarea name="body" rows="5" required>${editingPost ? editingPost.body : ''}</textarea>
        </div>
        <div style="margin-top:1rem; display:flex; gap:1rem;">
          <button type="submit">Save</button>
          <button type="button" id="cancelBtn">Cancel</button>
          <button type="reset">Reset</button>
        </div>
        <p id="errorMsg" style="color:red" aria-live="polite"></p>
      </form>
    </div>
  `;

  const form = document.getElementById('editorForm');
  const error = document.getElementById('errorMsg');
  form.title.focus();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = form.title.value.trim();
    const body = form.body.value.trim();

    if (title.length < 3) {
      error.textContent = 'Title must be at least 3 characters';
      return;
    }
    if (body.length < 10) {
      error.textContent = 'Body must be at least 10 characters';
      return;
    }

    if (editingPost) {
      updatePost(editingPost.id, { title, body });
    } else {
      createPost({ userId: 1, title, body });
    }

    navigate('/dashboard');
  });

  form.querySelector('#cancelBtn').onclick = () => navigate('/dashboard');
}
