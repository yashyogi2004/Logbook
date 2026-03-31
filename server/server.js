import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';

import connectDB from './db/connectivity/dbConnection.js';
import './controller/passport.js';
import './db/models/Logs.js';
import userRoutes from './Routes/AuthRoutes.js';
import logRoutes from './Routes/LogRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    console.log('Database connected');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: [process.env.CLIENT_URL || 'http://localhost:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.options('/*', cors());

  app.use(passport.initialize());

  app.use('/', userRoutes);
  app.use('/', logRoutes);
  app.get('/', (req, res) => res.send('API is running...'));

  app.listen(port, () => console.log(`Server is running on port ${port}`));
})();