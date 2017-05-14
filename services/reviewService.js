'use strict';
const async = require('async');
const Review = require('mongoose').model('Review');
const Location = require('mongoose').model('Location');

exports.add = (review, user) => {
  return new Promise((resolve, reject) => {
    async.waterfall([
      //get location
      next => {
        Location.findOne({
          foursquareId: review.locationId
        })
          .then(location => {
            if (location) {
              return next(null, location);
            }
            location = new Location({
              foursquareId: review.locationId
            });
            location.save((err, saved) => {
              if (err) return next(err);
              next(null, saved);
            });
          });
      },
      //save review
      (location, next) => {
        let newReview = new Review({
          comment: review.comment,
          rating: review.rating,
          user: user._id
        });
        newReview.save((err, savedReview) => {
          return next(err, savedReview, location);
        });
      },
      //update location
      (savedReview, location, next) => {
        location.reviews.push(savedReview);
        location.save((err, updatedLocation) => {
          next(err, savedReview);
        });
      },
      (savedReview, next) => {
        Review.findOne(savedReview)
          .populate('user').then(review => {
          next(null, review);
        }).catch(next);
      }
      //return comment
    ], (err, savedReview) => {
      if (err) return reject(err);
      resolve(savedReview);
    });
  });
};

exports.get = (locationId) => {
  return Location.findOne({foursquareId: locationId})
    .populate({
      path:'reviews',
      populate: {
        path: 'user'
      }
    })
    .then(location => location.toObject());
};