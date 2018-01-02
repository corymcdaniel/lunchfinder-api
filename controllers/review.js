const reviewService = require('../services/reviewService');

exports.get = (req, res, next) => {

};

exports.create = async (req, res, next) => {
  // check inputs
  if (!validateCreation(req)) return res.sendStatus(400);
  try {
    let review = reviewService.add(req.body, req.user);
    return res.json(review);
  } catch (err) {
    next(err);
  }
};

function validateCreation(req) {
  return req.body && req.user && req.body.locationId && req.body.rating;
}