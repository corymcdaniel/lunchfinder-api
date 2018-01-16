const _ = require('lodash');
const userService = require('../services/userService');

exports.get = async (ctx, next) => {
  let id = ctx.params.userId;
  if (!id) {
    ctx.status = 400;
    ctx.body = 'Missing id';
    return;
  }

  try {
    ctx.body = await userService.get(id);
  } catch (err) {
    next(err);
  }
};

exports.list = async (ctx, next) => {
  try {
    ctx.body = await userService.list(ctx.query);
  } catch (err) {
    next(err);
  }
};

exports.update = async (ctx, next) => {
  let fields = Object.keys(ctx.body);
  _.remove(fields, (f) => f === 'id');

  if (fields.indexOf('username') > -1) {
    //TODO: Search for the username before allowing an update
  }

  try {
    let updated = await userService.update(ctx.body, fields);
    if (updated[0] > 0) {
      ctx.status = 202;
      ctx.body = updated[1][0].toJSON();
      return;
    }
  } catch (err) {
    return next(err);
  }
  ctx.status = 500;
};

exports.delete = async (ctx, next) => {
  if (!ctx.body.id) {
    ctx.status = 400;
    ctx.body = 'Missing id';
    return;
  }
  try {
    await userService.delete(ctx.body.id);
    ctx.status = 201;
  } catch (err) {
    next(err);
  }
};
