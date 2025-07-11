const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- In-Memory Auth Storage ----------
const users = []; // This will store registered users { username, password }

// ---------- Auth Routes ----------
app.post("/auth/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Missing username or password" });

  const exists = users.find((u) => u.username === username);
  if (exists)
    return res.status(409).json({ message: "User already exists" });

  users.push({ username, password });
  return res.status(201).json({ message: "User registered" });
});

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  // Return dummy token for now
  return res.json({ access_token: "dummy-token" });
});

// ---------- Multer Upload Setup ----------
const upload = multer({ dest: "uploads/" });

// ---------- Upload Route ----------
app.post("/upload", upload.fields([{ name: "stock" }, { name: "news" }]), (req, res) => {
  try {
    const stock = req.files?.stock?.[0];
    const news = req.files?.news?.[0];

    if (!stock || !news) {
      return res.status(400).json({ success: false, message: "Missing files" });
    }

    // Save files with fixed names
    fs.renameSync(stock.path, path.join("uploads", "stock.csv"));
    fs.renameSync(news.path, path.join("uploads", "news.csv"));

    return res.json({ success: true, message: "Files uploaded successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error during file upload" });
  }
});

// ---------- Analyze Route ----------
app.get("/api/analyze", (req, res) => {
  // Simulate some backend processing
  return res.json({
    success: true,
    result: "📈 Based on stock and news data, BUY signal detected for XYZ Corp."
  });
});

// ---------- Start Server ----------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
