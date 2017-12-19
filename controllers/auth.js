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

exports.login = async (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  let user = await User.findOne({where:{username: username}});
  if (!user) {
    throw new Error('Unknown user or invalid password');
  }
  let isMatch;
  try {
    isMatch = await user.comparePassword(password);
  } catch (err) {
    return res.status(500).send(err);
  }
  if (!isMatch) {
    return res.status(400).send('Unknown user or invalid password');
  }
  let tokenOptions = { expiresIn: '1d' };
  let userJSON = publicUser(user);
  let token;

  try {
    token = await jwt.sign(userJSON, config.jwtSecret, tokenOptions);
  } catch (err) {
    return next(err);
  }

  userService.update({id: user.id, last_login: Date.now()}, ['last_login']);
  return res.json({username: user.username, id: user.id, roles: [], token: `JWT ${token}`});
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

exports.loggedIn = (req, res, next) => {
  if (req.user) {
    return next();
  }
  return res.sendStatus(401);
};

exports.getUser = (req, res) => {
  if (!req.user) {
    return res.sendStatus(204);
  }
  return res.json(publicUser(req.user));
};

exports.logout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.sendStatus(201);
};

exports.facebook = (req, res, next) => {
  req.session.redirectTo = req.query.redirectTo;
  passport.authenticate('facebook', {scope: 'email'})(req, res, next);
};

exports.facebookCallback = (req, res, next) => {
  passport.authenticate('facebook', function(err, user) {
    if (err || !user) {
      console.log('FB Callback Error: ', err);
      return res.redirect(`${config.clientUrl}/error`);
    }
    req.login(user, function (err) {
      if (err) {
        console.log('FB Callback Login Error: ', err);
        return res.redirect(`${config.clientUrl}/error`);
      }

      return res.redirect(`${req.session.redirectTo || config.clientUrl}`);
    });
  })(req, res, next);
};
