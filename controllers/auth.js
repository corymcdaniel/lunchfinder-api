const passport = require('koa-passport');
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

exports.login = async (ctx, next) => {
  let username = ctx.body.username;
  let password = ctx.body.password;
  let user = await User.findOne({where:{username: username}});
  if (!user) {
    throw new Error('Unknown user or invalid password');
  }
  let isMatch;
  try {
    isMatch = await user.comparePassword(password);
  } catch (err) {
    ctx.status = 500;
    ctx.body = err;
    return;
  }
  if (!isMatch) {
    ctx.status = 400;
    ctx.body = 'Unknown user or invalid password';
    return;
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
  ctx.body = {
    username: user.username,
    id: user.id,
    roles: [], token: `JWT ${token}`
  };
};

exports.register = (ctx, next) => {
  passport.authenticate('local-register', (err, user) => {
    if (err && err.message) {
      console.error(err);
      ctx.status = 400;
      ctx.body = err.message;
    }
    if (err) {
      ctx.status = 500;
      ctx.body = err.message;
      return;
    }
    ctx.body = publicUser(user);
  })(ctx.req, ctx.res, next);
};

exports.loggedIn = (ctx, next) => {
  if (ctx.isAuthenticated()) {
    return next();
  }
  ctx.status = 401;
};

exports.getUser = (ctx) => {
  if (!ctx.state.user) {
    ctx.status = 204;
    return;
  }
  ctx.body = publicUser(ctx.state.user);
};

exports.logout = (ctx) => {
  ctx.logout();
  ctx.status = 201;
};

exports.facebook = (ctx, next) => {
  return passport.authenticate('facebook', {scope: 'email'})(ctx, next);
};

exports.facebookCallback = (ctx, next) => {
  return passport.authenticate('facebook',
    async (err, user) => {
    if (err || !user) {
      console.log('FB Callback Error: ', err);
      return ctx.redirect(`${config.clientUrl}/error`);
    }
    ctx.login(user, (err) => {
      if (err) {
        console.log('FB Callback Login Error: ', err);
        return ctx.redirect(`${config.clientUrl}/error`);
      }

      return ctx.redirect(`${ctx.session.redirectTo || config.clientUrl}`);
    });
  })(ctx, next);
};

exports.facebookSuccess = async (ctx) => {
  return ctx.redirect(`${ctx.session.redirectTo || config.clientUrl}`);
};
