const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.post("/", (req, res) => {
  const trades = req.files?.trades;
  const news = req.files?.news;

  if (!trades || !news)
    return res.status(400).json({ success: false, message: "Both files required" });

  const dir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  trades.mv(path.join(dir, "trades.csv"));
  news.mv(path.join(dir, "news_events.csv"));

  res.json({ success: true });
});

module.exports = router;
