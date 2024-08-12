const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
mongoose.connect(process.env.ATLASDB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('Connected to MongoDB');
  });
  
  // Middleware
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'https://drivesync-frontend.vercel.app',
    ],
    optionsSuccessStatus: 200,
  }));


app.use(express.json());

app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
