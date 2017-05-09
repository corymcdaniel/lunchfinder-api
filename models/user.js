const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  tokens: Array,
}, { timestamps: true });

userSchema.pre('save', function(next) {
  let user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    cb(err, isMatch);
  });
};


let User = mongoose.model('User', userSchema);

module.exports = User;
