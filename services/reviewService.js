const Review = require('mongoose').model('Review');
const Location = require('mongoose').model('Location');

exports.add = async (review, user) => {
  let location = await Location.findOne({ foursquareId: review.locationId });
  if (!location) {
    location = new Location({ foursquareId: review.locationId });
    await location.save()
  }

  let newReview = new Review({
    comment: review.comment,
    rating: review.rating,
    user: user._id
  });

  await newReview.save();
  location.reviews.push(newReview);
  await location.save();
  return Review.findOne(newReview).populate('user');
};

exports.get = (locationId) => {
  return Location.findOne({foursquareId: locationId})
    .populate({
      path:'reviews',
      populate: {
        path: 'user'
      }
    });
};