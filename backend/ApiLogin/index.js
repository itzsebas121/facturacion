require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false, 
    trustServerCertificate: true,
  },
};

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    await sql.connect(config);
    const request = new sql.Request();

    request.input('Username', sql.VarChar(50), username);
    request.input('Password', sql.VarChar(100), password);

    const result = await request.execute('ValidateUser');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.UserID, username: user.Username },
      process.env.JWT_SECRET,
      { expiresIn: '3m' }
    );

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
