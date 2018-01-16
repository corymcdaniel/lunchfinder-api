const fsAdapter = require('../adapters/foursquare');
const reviewService = require('../services/reviewService');

exports.get = async (ctx, next) => {
  let coords = ctx.query.lat ? {
    latitude: ctx.query.lat || null,
    longitude: ctx.query.lon || null
  } : null;

  try {
    let venues = await fsAdapter.getVenues(coords, ctx.query.address);
    ctx.body = venues;
  } catch (err) {
    next(err);
  }
};

exports.getById = async (ctx, next) => {
  if (!ctx.params || !ctx.params.externalId) {
    return next(new Error('Location not found'));
  }

  let results;
  try {
    results = await Promise.all([
      fsAdapter.getVenue(ctx.params.externalId),
      reviewService.get(ctx.params.externalId)
    ]);
  } catch (err) {
    return next(err);
  }

  let reviewResults = results[1] && results[1].toJSON() || null;
  let reviewModel = reviewResults || {reviews: []};
  let location = results[0];
  location.reviews = reviewModel.reviews;

  ctx.body = location;
};
