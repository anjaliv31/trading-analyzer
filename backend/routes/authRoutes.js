// backend/routes/authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Dummy in-memory users
const users = [{ username: "anjali", password: "123456" }];

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, "your_secret_key", { expiresIn: "1h" });
  res.json({ message: "Login successful", token });
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const exists = users.find(u => u.username === username);

  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  res.json({ message: "Registration successful" });
});

module.exports = router;
