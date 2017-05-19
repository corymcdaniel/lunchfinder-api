'use strict';
const config = require('../config/config');
const async = require('async');
const _ = require('lodash');

const foodCategoryName = 'food';
let foursquare = require('foursquarevenues')(config.foursquare.clientId, config.foursquare.clientSecret);
let foodCategoryId = null; //cache it for now

exports.getVenues = (coords, address) => {
  return new Promise((resolve, reject) => {
    async.waterfall([
      //category lookup:
      next => {
        if (foodCategoryId) return next(null, foodCategoryId);
        foursquare.getCategories((err, data) => {
          if (err) return next(err);
          let foodCategory = _.find(_.get(data, 'response.categories'), (category => {
            return category.shortName.toLowerCase() === foodCategoryName;
          }));
          if (!foodCategory) return next(new Error('Missing food category'));
          foodCategoryId = foodCategory.id;
          return next(null, foodCategoryId);
        });
      },
      //food search
      (categoryId, next) => {
        let params = {
          categoryId: categoryId,
          radius: 1000,
          intent: 'browse'
        };
        if (coords) {
          params.ll = coords.latitude + ',' + coords.longitude;
        } else {
          params.near = address;
        }
        foursquare.getVenues(params, function (error, data) {
          if (!error) {
            return next(null, data.response.venues);
          }
          return next(error);
        });
      },
      (venues, next) => {
        let locations = _.map(venues, venue => {
          return {
            externalId: venue.id,
            name: venue.name,
            address: formatAddress(venue.location),
            distance: venue.location.distance,
          }
        });
        next(null, locations);
      }
      //finally:
    ], (err, locations) => {
      if (err) return reject(err);
      resolve(locations);
    });

  });
};

exports.getVenue = externalId => {
  return new Promise((resolve, reject) => {
    async.waterfall([
      next => {
        foursquare.getVenue({venue_id: externalId}, (err, data) => {
          if (err) return next(err);
          next(null, _.get(data, 'response.venue', null));
        });
      },
      (venue, next) => {
        if (!venue) return next(new Error('Location not found.'));
        let location = {
          name: venue.name,
          address: formatAddress(venue.location),
          externalId: venue.id,
          url: venue.url,
          menu: _.get(venue, 'menu.url', ''),
          attributes: _.get(venue, 'attributes.groups', [])
        };
        next(null, location);
      }
    ], (err, location) => {
      if (err) return reject(err);
      resolve(location);
    });
  });
};

function formatAddress(location) {
  return `${removeUndefined(location.address)} ${removeUndefined(location.city)}, ${removeUndefined(location.state)} ${removeUndefined(location.postalCode)}`;
}

function removeUndefined(str) {
  if (!str) return '';
  return str;
}