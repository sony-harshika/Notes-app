const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'data.json');
const JWT_SECRET = 'notes_app_secret_key_2024';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


function readData() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], notes: [] }));
  }
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  if (!data.users) data.users = [];
  if (!data.notes) data.notes = [];
  return data;
}

function writeData(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Please login first.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Session expired. Please login again.' });
  }
}

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  const data = readData();
  if (data.users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already taken.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  data.users.push({ id: Date.now().toString(), username, password: hashed });
  writeData(data);

  res.status(201).json({ message: 'Account created! Please login.' });
});


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const data = readData();
  const user = data.users.find(u => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, username: user.username });
});

app.get('/api/notes', authMiddleware, (req, res) => {
  const data = readData();
  const userNotes = data.notes.filter(n => n.userId === req.user.id);
  res.json(userNotes);
});


app.post('/api/notes', authMiddleware, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content are required.' });

  const newNote = {
    id: Date.now().toString(),
    title,
    content,
    userId: req.user.id,
    username: req.user.username,
    createdAt: new Date().toISOString()
  };

  const data = readData();
  data.notes.push(newNote);
  writeData(data);

  res.status(201).json(newNote);
});


app.delete('/api/notes/:id', authMiddleware, (req, res) => {
  const data = readData();
  const index = data.notes.findIndex(n => n.id === req.params.id && n.userId === req.user.id);

  if (index === -1) return res.status(404).json({ error: 'Note not found.' });

  data.notes.splice(index, 1);
  writeData(data);

  res.json({ message: 'Note deleted.' });
});

app.listen(PORT, () => {
  console.log(`\n Server running at http://localhost:${PORT}\n`);
});
