const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const locationController = require('../controllers/location');
const reviewController = require('../controllers/review');

module.exports = function(app) {
  app.route('/v1/healthcheck').get((req, res) => {
      return res.status(200).send('All Good.');
  });

  app.route('/v1/locations/:externalId').get(locationController.getById);
  app.route('/v1/locations').get(locationController.get);

  let auth = '/v1/auth';
  app.route(`${auth}/register`).post(authController.register);
  app.route(`${auth}/login`).post(authController.login);
  app.route(`${auth}/facebook`).get(authController.facebook);

  app.route(`${auth}/facebook/callback`)
    .get(authController.facebookCallback);
  app.route(`${auth}/current`).get(authController.getUser);

  /***** ALL AUTHENTICATED ROUTES BELOW ******/
  app.use('/v1/', authController.loggedIn);
  app.route(`${auth}/logout`).get(authController.logout);
  app.route('/v1/reviews').post(reviewController.create);

  app.route('/v1/users/:userId').get(userController.get);
};
