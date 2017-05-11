'use strict';
const fsAdapter = require('../adapters/foursquare');

exports.searchNearby = (req, res, next) => {
  fsAdapter.getVenues(req.query.coords, req.query.address).then(venues => {
    return res.json(venues);
  }).catch(next);
};