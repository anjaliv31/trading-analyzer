const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const upload = require('./routes/upload');
const authenticateToken = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.post('/upload', authenticateToken, upload);

app.get('/', (req, res) => res.send("✅ Backend running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
