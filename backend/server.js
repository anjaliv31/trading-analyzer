const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// In-memory user store (for demo)
const users = []; // { username, passwordHash }

app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    createParentPath: true,
  })
);

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const exists = users.find((u) => u.username === username);
    if (exists) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    users.push({ username, passwordHash });
    return res.json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username and password required" });

    const user = users.find((u) => u.username === username);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "8h" });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

// PROTECTED UPLOAD ROUTE
app.post("/upload", authMiddleware, async (req, res) => {
  try {
    if (!req.files || !req.files.trades || !req.files.news) {
      return res.status(400).json({ message: "Both trades and news CSV files are required" });
    }

    const tradesFile = req.files.trades;
    const newsFile = req.files.news;

    // Ensure uploads folder exists
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    // Save files
    const tradesPath = path.join(uploadDir, "trades.csv");
    const newsPath = path.join(uploadDir, "news.csv");
    await tradesFile.mv(tradesPath);
    await newsFile.mv(newsPath);

    // Dummy analysis (replace with your real analysis logic)
    const analysis = [
      { stock: "AAPL", signal: "Buy", confidence: "85%", profit: "$1200" },
      { stock: "TSLA", signal: "Sell", confidence: "78%", profit: "$800" },
      { stock: "GOOGL", signal: "Hold", confidence: "60%", profit: "$300" },
    ];

    return res.json({ analysis });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Upload failed" });
  }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
