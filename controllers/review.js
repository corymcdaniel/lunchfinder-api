'use strict';
let reviewService = require('../services/reviewService');

exports.get = (req, res, next) => {

};

exports.create = (req, res, next) => {
  // check inputs
  if (!req.body.rating || !req.user) return res.sendStatus(400);
  reviewService.add(req.body, req.user)
    .then(review => {
      res.json(review)
    })
    .catch(next);
};