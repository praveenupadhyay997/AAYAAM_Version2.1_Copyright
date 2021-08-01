const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load Config
dotenv.config({ path: './config/config.env' });

// DB Connection
connectDB();
// Express Middleware
const app = express();

const PORT = process.env.PORT || 3000;

// Cors MiddleWare
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body- Parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Routes
app.use('/', require('./routes/landing'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/admission', require('./routes/auth/admission'));
app.use('/studentLogin', require('./routes/auth/studentLogin'));
app.use('/staff', require('./routes/auth/staff'));
app.use('/forgotPass', require('./routes/auth/forgotpass'));
app.use('/reception', require('./routes/reception'));
app.use('/examCell', require('./routes/examCell'));
app.use('/student', require('./routes/student'));
app.use('/changepass', require('./routes/auth/changepass'));
app.use('/batch', require('./routes/batch'));
app.use('/account', require('./routes/account'));
app.use('/logger', require('./routes/accountantLogs'));
app.use('/studentLogger', require('./routes/studentLogs'));
app.use('/restore', require('./routes/restore'));
app.use('/chequeSystem', require('./routes/chequeDetail'));

// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

// Start Server
app.listen(
    PORT,
    console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);