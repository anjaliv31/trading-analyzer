const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const users = []; // In-memory user store

router.post('/register', (req, res) => {
  const { email, password } = req.body;

  const existing = users.find(user => user.email === email);
  if (existing) return res.status(400).json({ message: "User already exists" });

  const newUser = { email, password };
  users.push(newUser);

  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  res.status(201).json({ message: "Registered successfully", token });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(user => user.email === email && user.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET);
  res.status(200).json({ message: "Logged in", token });
});

module.exports = router;
