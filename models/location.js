'use strict';
const mongoose = require('mongoose');

let locationSchema = new mongoose.Schema({
  googleId: { type: String },
  comments: [
    {
      rating: Number,
      comment: String,
    }
  ]
});

let Location = mongoose.model('Location', locationSchema);

module.exports = Location;