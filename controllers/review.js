const reviewService = require('../services/reviewService');

exports.get = (ctx, next) => {

};

exports.create = async (ctx, next) => {
  // check inputs
  if (!validateCreation(ctx)) {
    ctx.status = 400;
    return;
  }
  try {
    let review = reviewService.add(ctx.body, ctx.req.user);
    ctx.body = review;
  } catch (err) {
    next(err);
  }
};

function validateCreation(ctx) {
  return ctx.body && ctx.req.user && ctx.req.body.locationId && ctx.req.body.rating;
}