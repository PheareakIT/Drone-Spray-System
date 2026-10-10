require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/database');
const customerRoutes = require('./routes/customerRoutes');
const sprayListRoutes = require('./routes/sprayListRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// APIs
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/spray-lists', sprayListRoutes);
app.use('/api/users', userRoutes);


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


