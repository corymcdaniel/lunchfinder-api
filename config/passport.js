const passport = require('passport');
const config = require('./config');
const path = require('path');
const User = require('mongoose').model('User');

module.exports = function() {
  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function(id, done) {
    User.findOne({
      where: {
        id: id
      },
      attributes: {
        exclude: ['password', 'salt']
      }
    })
      .then((user) => {
        return done(null, user);
      })
      .catch((error) => {
        return done(error);
      });
  });

  // Initialize strategies
  config.getGlobbedFiles('./config/strategies/**/*.js')
    .forEach(function(strategy) {
      require(path.resolve(strategy))();
    });
};