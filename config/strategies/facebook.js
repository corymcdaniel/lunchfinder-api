const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../config');
const User = require('mongoose').model('User');

module.exports = async () => {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.appId,
      clientSecret: config.facebook.secret, //process.env.facebook_app_secret,
      callbackURL: config.facebook.callback,
      profileFields:['id', 'displayName', 'emails']
    }, async (accessToken, refreshToken, profile, done) => {
      let user = new User({
        email: profile.emails[0].value,
        name: profile.displayName
      });

      //save new users:
      try {
        let foundUser = await User.findOne({email: user.email});
        if (!foundUser) {
          let user = await user.save;
          return done(null, user);
        }
        return done(null, foundUser);
      } catch (err) {
        return done(err);
      }
    }
  ));
};