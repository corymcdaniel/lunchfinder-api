'use strict';
const fsAdapter = require('../adapters/foursquare');
const reviewService = require('../services/reviewService');
const async = require('async');

exports.get = (req, res, next) => {
  fsAdapter.getVenues(req.query.coords, req.query.address).then(venues => {
    return res.json(venues);
  }).catch(next);
};

exports.getById = (req, res, next) => {
  if (!req.params || !req.params.externalId) {
    return next(new Error('Location not found'));
  }
  Promise.all([
    fsAdapter.getVenue(req.params.externalId),
    reviewService.get(req.params.externalId)
  ]).then(results => {
    let reviews = results[1] || [];
    let location = Object.assign({}, results[0], reviews);
    return res.json(location)
  }).catch(next);
};