const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Use a file next to this script so it persists in Docker volumes
const db = new Database(path.join(__dirname, 'todos.db'));

// Create the todos table (safe to run every time)
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    title     TEXT    NOT NULL,
    completed INTEGER DEFAULT 0
  )
`);

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------

// GET  /api/todos     – list all todos (newest first)
app.get('/api/todos', (_req, res) => {
  const todos = db.prepare('SELECT * FROM todos ORDER BY id DESC').all();
  // Convert SQLite integer to real boolean
  res.json(todos.map(t => ({ ...t, completed: !!t.completed })));
});

// POST /api/todos     – create a new todo  { title: "..." }
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const result = db
    .prepare('INSERT INTO todos (title) VALUES (?)')
    .run(title.trim());

  const todo = db
    .prepare('SELECT * FROM todos WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json({ ...todo, completed: !!todo.completed });
});

// PUT  /api/todos/:id – toggle completed
app.put('/api/todos/:id', (req, res) => {
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const newVal = todo.completed ? 0 : 1;
  db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(newVal, req.params.id);

  res.json({ ...todo, completed: !todo.completed });
});

// DELETE /api/todos/:id – remove a todo
app.delete('/api/todos/:id', (req, res) => {
  const result = db
    .prepare('DELETE FROM todos WHERE id = ?')
    .run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json({ success: true });
});

// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
