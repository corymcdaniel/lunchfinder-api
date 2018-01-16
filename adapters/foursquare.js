const config = require('../config/config');
const _ = require('lodash');

const foodCategoryName = 'food';
let foursquare = require('foursquarevenues')(config.foursquare.clientId, config.foursquare.clientSecret);
let foodCategoryId = null; //cache it for now

exports.getVenues = async (coords, address) => {
  let categoryId = await getFoodCategory();
  let params = {
    categoryId: categoryId,
    radius: 1000,
    intent: 'browse'
  };

  if (coords && coords.latitude && coords.latitude) {
    params.ll = coords.latitude + ',' + coords.longitude;
  } else {
    params.near = address;
  }

  let venues = await getVenues(params);

  return _.map(venues, venue => {
    return {
      externalId: venue.id,
      name: venue.name,
      address: formatAddress(venue.location),
      distance: venue.location.distance,
    }
  });
};

async function getFoodCategory() {
  if (foodCategoryId) return foodCategoryId;
  let categoriesResponse = await getCategories();
  let foodCategory = _.find(_.get(categoriesResponse, 'response.categories'), (category => {
    return category.shortName.toLowerCase() === foodCategoryName;
  }));
  if (!foodCategory) {
    throw new Error(`Could not retrieve foursquare food category`);
  }
  foodCategoryId = foodCategory.id;
  return foodCategoryId;
}

exports.getVenue = async (externalId) => {
  let venue;
  try {
    venue = await getVenue({venue_id: externalId});
  } catch (err) {
    console.log(err);
    return null;
  }
  if (!venue) return null;
  return {
    name: venue.name,
    address: formatAddress(venue.location),
    externalId: venue.id,
    url: venue.url,
    menu: _.get(venue, 'menu.url', ''),
    attributes: _.get(venue, 'attributes.groups', [])
  };
};

function formatAddress(location) {
  return `${removeUndefined(location.address)} ${removeUndefined(location.city)}, ${removeUndefined(location.state)} ${removeUndefined(location.postalCode)}`;
}

function removeUndefined(str) {
  if (!str) return '';
  return str;
}

/*
  util.promisify(foursquare.getVenues) etc causes a loss of this._baseURL in
  the returned object from the package, thus failing calls.  manually promisifying:
 */
function getVenue(params) {
  return new Promise((resolve, reject) => {
    foursquare.getVenue(params, (err, data) => {
      if (err) return reject(err);
      resolve(_.get(data, 'response.venue', null));
    })
  });
}

function getVenues(params) {
  return new Promise((resolve, reject) => {
    foursquare.getVenues(params, (err, data) => {
      if (err) return reject(err);
      resolve(data.response.venues);
    });
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    foursquare.getCategories((err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
}
