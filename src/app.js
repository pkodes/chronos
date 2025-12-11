const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3001', // Your React will run on 3000
  credentials: true
}));
app.use(express.json());


app.use('/api/jobs', require('./api/jobs'));

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Chronos Scheduler API' });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Chronos API running on port ${PORT}`);
});