const express = require('express');
const multer = require('multer');
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'data/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post(
  '/',
  upload.fields([
    { name: 'trades', maxCount: 1 },
    { name: 'news', maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const analysis = [
        { stock: 'AAPL', signal: 'Buy', confidence: 'High', profit: '+3.4%' },
        { stock: 'TSLA', signal: 'Sell', confidence: 'Medium', profit: '-1.2%' },
        { stock: 'INFY', signal: 'Hold', confidence: 'Low', profit: '0.0%' },
      ];
      res.json({ message: 'Success', analysis });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
