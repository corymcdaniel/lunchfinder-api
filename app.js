'use strict';

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const compress = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const flash = require('express-flash');
const passport = require('passport');
const mongoStore = require('connect-mongo')({
  session: session
});
const expressValidator = require('express-validator');
const multer = require('multer');
const config = require('./config/config');
const cors = require('cors');

global.appRoot = path.resolve(__dirname);

let app = express();

// Bootstrap db connection
let db = mongoose.connect(config.db.mongo, function(err) {
  if (err) {
    console.error('Could not connect to MongoDB!');
    console.log(err);
  }
});

// Globbing model files
config.getGlobbedFiles('./models/**/*.js').forEach(function(modelPath) {
  require(path.resolve(modelPath));
});

require('./config/passport');
//passportConfig();

app.set('port', process.env.PORT || config.port || 3000);

let whitelist = ['http://localhost:8080', 'http://localhost:3000'];
let corsOptions = {
  origin: function(origin, callback){
    let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
};
app.use(cors(corsOptions));

app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: 'hfieoafjeio', // TODO: get from process env
  store: new mongoStore({
    mongooseConnection: db.connection,
    collection: 'sessions',
    maxAge: 7 * 60 * 60 * 12
  }),
  cookie: {maxAge: 7 * 60 * 60 * 12}
}));
app.use(passport.initialize());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

require('./routes/api_v1')(app);

/**
 * Error Handler.
 */
app.use(function (err, req, res, next) {
  //TODO: error handle
  next();
});

if (process.env.NODE_ENV !== 'production') {
  app.use(errorHandler());
}

app.listen(app.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
