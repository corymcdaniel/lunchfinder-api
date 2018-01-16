const Router = require('koa-router');
const secured = new Router();
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const reviewController = require('../controllers/review');

secured.use('/', authController.loggedIn);
secured.get(`/auth/logout`, authController.logout);
secured.post('/reviews', reviewController.create);

secured.get('/users/:userId', userController.get);

module.exports = secured.routes();