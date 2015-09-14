var fs = require('co-fs');
var thunkify = require('thunkify');
var url = require('url');
var path = require('path');

var less = require('less');
var stylus = require('stylus');
var coffee = require('coffee-script');
var babel = require('babel-core');

/**
 * 记得在static中间件之前使用，否则会被静态文件中间件处理
 */
exports.less = function (root) {
  return function* (next) {
    if (this.method === 'GET' || this.method === 'HEAD') {
      var urlpath = this.request.path;
      if (urlpath.match(/\.less$/)) {
        var content;
        try {
          content = yield fs.readFile(path.join(root, urlpath), 'utf8');
        } catch (ex) {
          this.status = 404;
          this.body = 'Cannot find ' + this.originalUrl + '\n';
          return;
        }
        var result = yield less.render(content);
        this.type = 'text/css';
        this.body = result.css;
        return;
      }
    }
    yield* next;
  };
};

var compileStylus = thunkify(function (str, callback) {
  stylus(str).render(callback);
});

/**
 * 记得在static中间件之前使用，否则会被静态文件中间件处理
 */
exports.stylus = function (root) {
  return function* (next) {
    if (this.method === 'GET' || this.method === 'HEAD') {
      var urlpath = this.request.path;
      if (urlpath.match(/\.styl$/)) {
        var content;
        try {
          content = yield fs.readFile(path.join(root, urlpath), 'utf8');
        } catch (ex) {
          this.status = 404;
          this.body = 'Cannot find ' + this.originalUrl + '\n';
          return;
        }
        var result = yield compileStylus(content);
        this.type = 'text/css';
        this.body = result;
        return;
      }
    }
    yield* next;
  };
};

/**
 * 记得在static中间件之前使用，否则会被静态文件中间件处理
 */
exports.coffee = function (root) {
  return function* (next) {
    if (this.method === 'GET' || this.method === 'HEAD') {
      var urlpath = this.request.path;
      if (urlpath.match(/\.coffee$/)) {
        var content;
        try {
          content = yield fs.readFile(path.join(root, urlpath), 'utf8');
        } catch (ex) {
          this.status = 404;
          this.body = 'Cannot find ' + this.originalUrl + '\n';
          return;
        }
        // 调用coffee-script编译源文件
        var output = coffee.compile(content);
        this.type = 'text/javascript';
        this.body = output;
        return;
      }
    }
    yield* next;
  };
};

exports.babel = function (root) {
  return function* (next) {
    if (this.method === 'GET' || this.method === 'HEAD') {
      var urlpath = this.request.path;
      if (urlpath.match(/\.es$/)) {
        var content;
        try {
          content = yield fs.readFile(path.join(root, urlpath), 'utf8');
        } catch (ex) {
          this.status = 404;
          this.body = 'Cannot find ' + this.originalUrl + '\n';
          return;
        }
        // 调用coffee-script编译源文件
        var output = babel.transform(content);
        this.type = 'text/javascript';
        this.body = output.code;
        return;
      }
    }
    yield* next;
  };
};
