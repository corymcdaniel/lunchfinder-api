const fsAdapter = require('../adapters/foursquare');
const reviewService = require('../services/reviewService');

exports.get = async (req, res, next) => {
  let coords = req.query.lat ? {
    latitude: req.query.lat || null,
    longitude: req.query.lon || null
  } : null;

  try {
    let venues = await fsAdapter.getVenues(coords, req.query.address);
    return res.json(venues);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  if (!req.params || !req.params.externalId) {
    return next(new Error('Location not found'));
  }

  let results;
  try {
    results = await Promise.all([
      fsAdapter.getVenue(req.params.externalId),
      reviewService.get(req.params.externalId)
    ]);
  } catch (err) {
    return next(err);
  }

  let reviewResults = results[1] && results[1].toJSON() || null;
  let reviewModel = reviewResults || {reviews: []};
  let location = results[0];
  location.reviews = reviewModel.reviews;

  return res.json(location)
};
