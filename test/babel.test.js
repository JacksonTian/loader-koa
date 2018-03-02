'use strict';

var request = require('supertest');
var server = require('./common');

describe('babel', function () {
  before((done) => {
    server.listen(done);
  });

  after((done) => {
    server.close(done);
  });

  it('should 200', function (done) {
    request(server)
    .get('/assets/babel.es')
    .expect(200)
    .expect('"use strict";\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }\n\nvar Test = function Test() {\n  _classCallCheck(this, Test);\n};', done);
  });

  it('should 404', function (done) {
    request(server)
    .post('/assets/home.js')
    .expect(404, done);
  });

  it('should 404 with js', function (done) {
    request(server)
    .get('/assets/home.js')
    .expect(404, done);
  });

  it('should 404 with babel', function (done) {
    request(server)
    .get('/assets/inexsit.es')
    .expect(404, done);
  });

  it('should 404 with head & babel', function (done) {
    request(server)
    .head('/assets/inexsit.es')
    .expect(404, done);
  });

  it('should 500 with invalid es', function (done) {
    request(server)
    .head('/assets/invalid.es')
    .expect(500, done);
  });
});

