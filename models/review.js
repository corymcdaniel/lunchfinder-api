'use strict';
const mongoose = require('mongoose');

let reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  rating: Number,
}, { timestamps: true });

let Review = mongoose.model('Review', reviewSchema);

module.exports = Review;