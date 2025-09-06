# Posts Dashboard (Vanilla JS)

A small dashboard web app built with **HTML, CSS, and vanilla JavaScript (ES6+ only)**.

## Features
- 🔐 Mock Authentication (login, logout, route guard with localStorage token)
- 📊 Dashboard shell with responsive layout (CSS Grid & Flexbox)
- 📝 Posts table:
  - Fetch from JSONPlaceholder API
  - Search (title & body)
  - Sort (ID, Title)
  - Pagination with page size
  - Loading, error, and empty states
- ✏️ Post editor:
  - Create & Edit posts (in-memory)
  - Validation (title ≥ 3, body ≥ 10)
  - Cancel & Reset

## Run locally
```bash
npx serve -s .
