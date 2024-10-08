const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('dotenv').config();
const authRouter = require('./routes/auth');
const driverRoutes = require('./routes/driverRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const assignmentRoutes = require('./routes/assignments');
const assignmentRequestsRouter = require('./routes/assignmentRequests');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
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
      'http://localhost:3001',
      'https://drivesync-frontend.vercel.app',
    ],
    optionsSuccessStatus: 200,
  }));


  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); 
  app.use('/api', authRouter);

app.use('/api/drivers', driverRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/assignment-requests', assignmentRequestsRouter);

app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
