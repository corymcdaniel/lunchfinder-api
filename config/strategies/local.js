'use strict';

var config = require('../config');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const User = require('mongoose').model('User');

/****************
 * likely unused initially, and will have to be updated to support JWT
 */

module.exports = () => {
  passport.use('local-register', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, username, password, done) => {
      if (!username || !password) {
        return done({message: 'Missing credentials'});
      }
      var username = req.body.username;
      if (!username) {
        return done({message: 'Username is required'});
      }
      User.findOne({where: {'username': username}}).then((user) => {
        if (user) {
          return done({message: 'That email is already taken.'});
        } else {
          //TODO create user
        }
      })
        .catch((err) => {
          console.log(err);
          return done(err);
        });
    })
  );

  passport.use('local-login',
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
      }, (username, password, done) => {
        User.findOne({where:{username: username}}, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done({message: 'Unknown user or invalid password'});
          }
          user.comparePassword(password, (err, isMatch) => {
            if (!isMatch) {
              return done({message: 'Unknown user or invalid password'});
            }
            return done(null, user);
          });
        });
      }
    ));
};
