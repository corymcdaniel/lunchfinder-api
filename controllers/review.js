'use strict';
let reviewService = require('../services/reviewService');

exports.get = (req, res, next) => {

};

exports.create = (req, res, next) => {
  // check inputs
  reviewService.add(req.body, req.user)
    .then(review => res.json(review))
    .catch(next);
};