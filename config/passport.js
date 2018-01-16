const passport = require('koa-passport');
const config = require('./config');
const path = require('path');
const User = require('mongoose').model('User');

module.exports = function() {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await User.findOne({
        _id: id
      }, '-salt -password');
      return done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Initialize strategies
  config.getGlobbedFiles('./config/strategies/**/*.js')
    .forEach(function(strategy) {
      require(path.resolve(strategy))();
    });
};