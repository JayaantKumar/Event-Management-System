const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5174', 
    'https://event-management-system-93h3.vercel.app'
  ],
   // Allow all origins for development; restrict in production
  credentials: true
}));
app.use(express.json());

// NOW define the routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/vendor', require('./routes/vendorRoutes'));
app.use('/api/user', require('./routes/userRoutes'));

app.get('/', (req, res) => {
  res.send('Event Management API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));