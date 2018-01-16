const Router = require('koa-router');
const open = new Router();
const authController = require('../controllers/auth');
const locationController = require('../controllers/location');

open.get('/healthcheck', (ctx) => {
  ctx.status = 200;
  ctx.body = 'All good';
});

open.get('/locations/:externalId', locationController.getById);
open.get('/locations', locationController.get);

let auth = '/auth';
open.post(`${auth}/register`, authController.register);
open.post(`${auth}/login`, authController.login);
open.get(`${auth}/facebook`, authController.facebook);

open.get(`${auth}/facebook/callback`, authController.facebookCallback);
open.get(`${auth}/current`, authController.getUser);

module.exports = open.routes();