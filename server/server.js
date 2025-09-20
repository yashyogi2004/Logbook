const express= require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;
const connectDB = require('./db/connectivity/dbConnection');
const UserModel = require('./db/models/Users');
const LogModel = require('./db/models/Logs');
const userRoutes = require('./Routes/AuthRoutes');
const logRoutes = require('./Routes/LogRoutes');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require('cors');
app.use(cors({
  origin: 'https://logbook-topaz.vercel.app', // frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true // if sending cookies/auth headers
}));



app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://logbook-topaz.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});
app.use('/', userRoutes);
app.use('/', logRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    });


