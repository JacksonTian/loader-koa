var request = require('supertest');
var server = require('./common');

describe('less', function () {
  it('should 200', function (done) {
    request(server)
    .get('/assets/home.less')
    .expect(200)
    .expect('.class {\n  width: 2;\n}\n', done);
  });

  it('should 404', function (done) {
    request(server)
    .post('/assets/home.less')
    .expect(404, done);
  });

  it('should 404 with css', function (done) {
    request(server)
    .get('/assets/home.css')
    .expect(404, done);
  });

  it('should 404 with less', function (done) {
    request(server)
    .get('/assets/inexsit.less')
    .expect(404, done);
  });

  it('should 404 with head & less', function (done) {
    request(server)
    .head('/assets/inexsit.less')
    .expect(404, done);
  });

  it('should 500 with invalid less', function (done) {
    request(server)
    .head('/assets/invalid.less')
    .expect(500, done);
  });
});

