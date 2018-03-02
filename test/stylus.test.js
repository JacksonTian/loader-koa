'use strict';

var request = require('supertest');
var server = require('./common');

describe('stylus', function () {
  before((done) => {
    server.listen(done);
  });

  after((done) => {
    server.close(done);
  });

  it('should 200', function (done) {
    request(server)
    .get('/assets/home.styl')
    .expect(200)
    .expect('.class {\n  width: 2;\n}\n', done);
  });

  it('should 404', function (done) {
    request(server)
    .post('/assets/home.styl')
    .expect(404, done);
  });

  it('should 404 with css', function (done) {
    request(server)
    .get('/assets/home.css')
    .expect(404, done);
  });

  it('should 404 with styl', function (done) {
    request(server)
    .get('/assets/inexsit.styl')
    .expect(404, done);
  });

  it('should 404 with head & styl', function (done) {
    request(server)
    .head('/assets/inexsit.styl')
    .expect(404, done);
  });

  it('should 500 with invalid styl', function (done) {
    request(server)
    .head('/assets/invalid.styl')
    .expect(500, done);
  });
});

