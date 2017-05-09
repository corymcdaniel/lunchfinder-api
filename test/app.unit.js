'use strict';
var request = require('supertest');
var app = require('../app.js');

describe('Basic App Tests', () => {
  describe('GET /random-url', function() {
    it('should return 404', function(done) {
      request(app)
        .get('/reset')
        .expect(404, done);
    });
  });
});
