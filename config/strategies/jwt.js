var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var passport = require('passport');
// load up the user model
var User = require('../../models').users;
var config = require('../config'); // get db config file

module.exports = () => {
  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.jwtSecret
  };
  passport.use('jwt', new JwtStrategy(opts, function(jwt_payload, done) {
    User.find({where: {id: jwt_payload.id}}).then((user) => {
      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    })
      .catch((err) => done(err));
  }));
};