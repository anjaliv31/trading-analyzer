const express = require("express");
const router = express.Router();

router.get("/analyze", (req, res) => {
  // Simulated result
  return res.json({ success: true, result: "Market trend shows a slight upward pattern 📈" });
});

module.exports = router;
