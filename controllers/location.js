'use strict';
const fsAdapter = require('../adapters/foursquare');
const reviewService = require('../services/reviewService');
const async = require('async');

exports.get = (req, res, next) => {
  let coords = req.query.lat ? {
    latitude: req.query.lat,
    longitude: req.query.lon
  } : null;

  fsAdapter.getVenues(coords, req.query.address).then(venues => {
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
    let reviewResults = results[1] && results[1].toJSON() || null;
    let reviewModel = reviewResults || {reviews: []};
    let location = results[0];
    location.reviews = reviewModel.reviews;
    return res.json(location)
  }).catch(next);
};