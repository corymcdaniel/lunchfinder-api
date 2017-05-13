'use strict';
const passport = require('passport');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const locationController = require('../controllers/location');

module.exports = function(app) {
  app.route('/v1/healthcheck').get((req, res) => {
      return res.status(200).send('All Good.');
  });

  app.route('/v1/locations/:externalId').get(locationController.getById);
  app.route('/v1/locations').get(locationController.get);

  let auth = '/v1/auth';
  app.route(`${auth}/register`).post(authController.register);
  app.route(`${auth}/login`).post(authController.login);
  app.route(`${auth}/facebook`).get((req, res, next) => {
    passport.authenticate('facebook', {scope: 'email'})(req, res, next);
  });

  app.route(`${auth}/facebook/callback`)
    .get((req, res, next) => {
      passport.authenticate('facebook', function(err, user) {
        if (err || !user) {
          return res.redirect('http://localhost:3000/error');
        }
        req.login(user, function(err) {
          if (err) {
            return res.redirect('http://localhost:3000/error');
          }

          return res.redirect('http://localhost:3000/about');
        });
      })(req, res, next);
    });
  app.route(`${auth}/loggedin`).get(authController.loggedIn);
  // app.route(`${auth}/logout`).get(authController.logout)

  /***** ALL AUTHENTICATED ROUTES BELOW ******/
  app.use('/v1/', authController.loggedIn);
  app.route('/v1/users/:userId').get(userController.get);
};
