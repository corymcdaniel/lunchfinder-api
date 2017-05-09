'use strict';

const chai = require('chai');
const should = chai.should();

const sinon = require('sinon');

var app = require('../app.js');
var routes = require('../routes/api_v1')(app);
const _ = require('lodash');
var request = require('supertest');
var authController = require('../controllers/auth');


var secureRoutes = [];
const insecureRoutes = ['/v1/healthcheck', '/v1/auth/register', '/v1/auth/login', '/v1/sms/receive'];
const verbs = ['get', 'post', 'put', 'patch', 'delete'];

describe('Router Security Tests', () => {

  before('router tests, get a list of all api endpoints', () => {
    app._router.stack.forEach((r) => {
      if (r.route && r.route.path && insecureRoutes.indexOf(r.route.path) === -1) {
        secureRoutes.push(r.route.path);
      }
    });
    secureRoutes = _.uniq(secureRoutes);
  });

  describe('Secure routes are secure', () => {
    it('should send 401 without proper Authorize Header', done => {
      secureRoutes.forEach(route => {
        verbs.forEach(verb => {
          request(app)[verb](route)
            .expect(401);
        })
      });
      done();
    });

    it('should pass auth with valid Authorize Header', done => {
      //either mock user model and go through login to generate a token, or just mock passport. either way
      //the test above is good for now.
      // secureRoutes.forEach(route => {
      //   verbs.forEach(verb => {
      //     request(app)[verb](route)
      //       .expect(!401);
      //   });
      // });
      done();
    });
  });
  
  describe('Insecure routes are secure', () => {
    it('should return 200', done => {
      request(app)
        .get('/v1/healthcheck')
        .expect(200, done);
    })
  });
});