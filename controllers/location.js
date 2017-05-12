'use strict';
const fsAdapter = require('../adapters/foursquare');

exports.get = (req, res, next) => {
  fsAdapter.getVenues(req.query.coords, req.query.address).then(venues => {
    return res.json(venues);
  }).catch(next);
};

exports.getById = (req, res, next) => {
  if (!req.params || !req.params.externalId) {
    return next(new Error('Location not found'));
  }
  fsAdapter.getVenue(req.params.externalId)
    .then(location => res.json(location))
    .catch(next);
};