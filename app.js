<<<<<<< HEAD
require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const logger = require("morgan");
const path = require("path");
const createError = require("http-errors");

// require all the packages you install
// Test Commit!
=======
require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const logger = require('morgan');
const path = require('path');
const createError = require('http-errors');

// require all the packages you install
const cors = require('cors');
>>>>>>> b0377f315ae67f91e49207f2db99284bb29f3004

const app = express();

// Middleware Setup
<<<<<<< HEAD
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
app.use(logger("dev"));
=======
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
>>>>>>> b0377f315ae67f91e49207f2db99284bb29f3004
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// require database configuration
<<<<<<< HEAD
require("./configs/db.config");

// require CORS (Cross-Origin Resource Sharing)
// ... here

// require session
// ... here

// require passport
// ... here

// routes middleware
app.use("/", require("./routes/index.routes"));
=======
require('./configs/db.config');

// require CORS (Cross-Origin Resource Sharing)
app.use(
  cors({
    origin: [process.env.FRONTEND_POINT],
    credentials: true // this needs set up on the frontend side as well
    //                   in axios "withCredentials: true"
  })
);

// require session
require('./configs/session.config')(app);

// require passport
require('./configs/passport/passport.config.js')(app);

// routes middleware
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/authentication.routes'));
app.use('/', require('./routes/author.routes'));
app.use('/', require('./routes/book.routes'));
>>>>>>> b0377f315ae67f91e49207f2db99284bb29f3004

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
<<<<<<< HEAD
  res.json({ type: "error", error: { message: error.message } });
=======
  res.json({ type: 'error', error: { message: error.message } });
>>>>>>> b0377f315ae67f91e49207f2db99284bb29f3004
});

module.exports = app;
