'use strict';

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../config');
const User = require('mongoose').model('User');

module.exports = () => {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.appId,
      clientSecret: config.facebook.secret, //process.env.facebook_app_secret,
      callbackURL: config.facebook.callback,
      profileFields:['id', 'displayName', 'emails']
    }, function(accessToken, refreshToken, profile, done) {
      let user = new User({
        email: profile.emails[0].value,
        name: profile.displayName
      });

      //save new users:
      User.findOne({email: user.email}, function(err, foundUser) {
        if(!foundUser) {
          user.save(function(err, user) {
            if(err) return done(err);
            done(null, user);
          });
        } else {
          console.log(foundUser);
          done(null, foundUser);
        }
      });
    }
  ));
};