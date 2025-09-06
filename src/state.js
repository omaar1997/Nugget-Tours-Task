export let state = {
  posts: [],
  loading: false,
  error: null,
};

export async function fetchPosts() {
  state.loading = true;
  state.error = null;
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    state.posts = data;
  } catch (e) {
    state.error = e.message;
  } finally {
    state.loading = false;
  }
}

export function createPost(post) {
  const id = Math.max(0, ...state.posts.map(p => p.id)) + 1;
  state.posts.unshift({ id, ...post });
}

export function updatePost(id, updates) {
  const idx = state.posts.findIndex(p => p.id === id);
  if (idx > -1) state.posts[idx] = { ...state.posts[idx], ...updates };
}
