
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'my_secret_key';

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const db = new sqlite3.Database('./data.db', (err) => {
  if (err) {
    console.error('Failed to connect to DB:', err.message);
  } else {
    console.log('Connected to SQLite DB.');

    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        specialization TEXT NOT NULL,
        profile_image TEXT,
        availability_status TEXT DEFAULT 'available',
        email TEXT,
        phone TEXT,
        experience_years INTEGER,
        rating REAL DEFAULT 4.5,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_id INTEGER,
        patient_name TEXT NOT NULL,
        patient_email TEXT NOT NULL,
        appointment_date TEXT NOT NULL,
        appointment_time TEXT NOT NULL,
        status TEXT DEFAULT 'scheduled',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doctor_id) REFERENCES doctors (id)
      )`);

      db.get("SELECT COUNT(*) AS count FROM doctors", (err, row) => {
        if (row.count === 0) {
          const sampleDoctors = [
            ['Dr. Sarah Johnson', 'Cardiologist', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300', 'sarah@hospital.com', '555-0101', 12, 4.8],
            ['Dr. Michael Chen', 'Dermatologist', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300', 'michael@hospital.com', '555-0102', 8, 4.6],
            ['Dr. Emily Rodriguez', 'Pediatrician', 'https://images.unsplash.com/photo-1594824475338-bb16d0797516?w=300', 'emily@hospital.com', '555-0103', 15, 4.9],
            ['Dr. James Wilson', 'Orthopedic', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300', 'james@hospital.com', '555-0104', 20, 4.7],
            ['Dr. Lisa Thompson', 'Neurologist', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300', 'lisa@hospital.com', '555-0105', 10, 4.5],
          ];
          const stmt = db.prepare("INSERT INTO doctors (name, specialization, profile_image, email, phone, experience_years, rating) VALUES (?, ?, ?, ?, ?, ?, ?)");
          sampleDoctors.forEach(doc => stmt.run(doc));
          stmt.finalize();
          console.log('Sample doctors inserted');
        }
      });
    });
  }
});

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
}

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is healthy ✅' });
});

app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
  stmt.run(name, email, password, function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(409).json({ error: 'Email already registered' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Signup successful', userId: this.lastID });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 3600000,
    });

    res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
  });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/doctors', authenticateToken, (req, res) => {
  const { search } = req.query;
  let sql = "SELECT * FROM doctors";
  let params = [];

  if (search) {
    sql += " WHERE name LIKE ? OR specialization LIKE ?";
    params = [`%${search}%`, `%${search}%`];
  }

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ data: rows });
  });
});

app.get('/api/doctors/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM doctors WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Doctor not found' });
    res.json({ data: row });
  });
});

app.post('/api/appointments', authenticateToken, (req, res) => {
  const { doctor_id, patient_name, patient_email, appointment_date, appointment_time } = req.body;
  if (!doctor_id || !patient_name || !patient_email || !appointment_date || !appointment_time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.get("SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ? AND status != 'cancelled'",
    [doctor_id, appointment_date, appointment_time],
    (err, existing) => {
      if (err) return res.status(500).json({ error: err.message });
      if (existing) return res.status(409).json({ error: "Slot already booked" });

      db.run("INSERT INTO appointments (doctor_id, patient_name, patient_email, appointment_date, appointment_time) VALUES (?, ?, ?, ?, ?)",
        [doctor_id, patient_name, patient_email, appointment_date, appointment_time],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({
            message: "Appointment booked",
            data: {
              id: this.lastID,
              doctor_id,
              patient_name,
              patient_email,
              appointment_date,
              appointment_time
            }
          });
        });
    });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  db.close(() => {
    console.log('\nDatabase closed. Server shutting down.');
    process.exit(0);
  });
});
