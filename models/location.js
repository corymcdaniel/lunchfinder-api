'use strict';
const mongoose = require('mongoose');

let locationSchema = new mongoose.Schema({
  foursquareId: { type: String },
  reviews: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
  ]
});

let Location = mongoose.model('Location', locationSchema);

module.exports = Location;