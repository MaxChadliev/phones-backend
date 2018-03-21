var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require("mongoose");
var session = require('express-session');
var passport = require('passport');
var cors = require('cors');

// passport set up
require('./configs/passport-config');

mongoose.connect('mongodb://localhost/myTry')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// add session stuff
app.use(session({
  secret:"some secret goes here",
  resave: true,
  saveUninitialized: true
}));
// add passport stuff
app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    credentials: true,                 // allow other domains to send cookies
    origin: ["http://localhost:4200"]  // these are the domains that are allowed
  })
);

// ============ routes ===================
var index = require("./routes/index");
app.use("/", index);

var authRoutes = require("./routes/auth-routes");
app.use("/", authRoutes);

var phoneRoutes = require("./routes/phone-routes");
app.use("/", phoneRoutes);

// =======================================


app.use((req, res, next) => {
  // If no routes match, send them the Angular HTML.
  res.sendFile(__dirname + "/public/index.html");
});

module.exports = app;
