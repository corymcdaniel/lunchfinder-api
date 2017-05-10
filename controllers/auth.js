'use strict';
const passport = require('passport');
const User = require('mongoose').model('User');
const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function publicUser(user) {
  user = user.toJSON();
  delete user.password;
  delete user.salt;
  delete user.last_login;
  delete user.created_at;
  delete user.updated_at;
  return user;
}

exports.authenticate = (req, res, next) => {
  passport.authenticate('facebook', (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send('Unauthorized');
    }
    next();
  })(req, res, next);
};

exports.login = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({where:{username: username}}).then((user) => {
    if (!user) {
      throw new Error('Unknown user or invalid password');
    }
    user.comparePassword(password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(400).send('Unknown user or invalid password');
      }
      let tokenOptions = {
        expiresIn: '1d'
      };
      let userJSON = publicUser(user);
      jwt.sign(userJSON, config.jwtSecret, tokenOptions, (err, token) => {
        if (err) {
          return next(err);
        }
        userService.update({id: user.id, last_login: Date.now()}, ['last_login']);
        return res.json({username: user.username, id: user.id, roles: [], token: `JWT ${token}`});
      });
    });
  })
  .catch((err) => {
    res.status(500).send(err);
  });
};

exports.register = (req, res, next) => {
  passport.authenticate('local-register', function(err, user, info) {
    if (err && err.message) {
      console.error(err);
      return res.status(400).send(err.message);
    }
    if (err) {
      return res.status(500).send();
    }
    return res.json(publicUser(user));
  })(req, res, next);
};
