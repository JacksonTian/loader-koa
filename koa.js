'use strict';

const util = require('util');
const fs = require('fs');
const path = require('path');

const less = require('less');
const stylus = require('stylus');
const coffee = require('coffeescript');
const babel = require('babel-core');

const readFile = util.promisify(fs.readFile);

/**
 * 记得在static中间件之前使用，否则会被静态文件中间件处理
 */
exports.less = function (root) {
  return async function (ctx, next) {
    if (ctx.method === 'GET' || ctx.method === 'HEAD') {
      var urlpath = ctx.request.path;
      if (urlpath.endsWith('.less')) {
        var content;
        try {
          content = await readFile(path.join(root, urlpath), 'utf8');
        } catch (ex) {
          ctx.status = 404;
          ctx.body = 'Cannot find ' + ctx.originalUrl + '\n';
          return;
        }
        var result = await less.render(content);
        ctx.type = 'text/css';
        ctx.body = result.css;
        return;
      }
    }
    await next();
  };
};

var compileStylus = function (str) {
  return new Promise((resolve, reject) => {
    stylus(str).render((err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

/**
 * 记得在static中间件之前使用，否则会被静态文件中间件处理
 */
exports.stylus = function (root) {
  return async function (ctx, next) {
    if (ctx.method === 'GET' || ctx.method === 'HEAD') {
      var urlpath = ctx.request.path;
      if (urlpath.match(/\.styl$/)) {
        var content;
        try {
          content = await readFile(path.join(root, urlpath), 'utf8');
        } catch (ex) {
          ctx.status = 404;
          ctx.body = 'Cannot find ' + ctx.originalUrl + '\n';
          return;
        }
        var result = await compileStylus(content);
        ctx.type = 'text/css';
        ctx.body = result;
        return;
      }
    }
    await next();
  };
};

/**
 * 记得在static中间件之前使用，否则会被静态文件中间件处理
 */
exports.coffee = function (root) {
  return async function (ctx, next) {
    if (ctx.method === 'GET' || ctx.method === 'HEAD') {
      var urlpath = ctx.request.path;
      if (urlpath.match(/\.coffee$/)) {
        var content;
        try {
          content = await readFile(path.join(root, urlpath), 'utf8');
        } catch (ex) {
          ctx.status = 404;
          ctx.body = 'Cannot find ' + ctx.originalUrl + '\n';
          return;
        }
        // 调用coffee-script编译源文件
        var output = coffee.compile(content);
        ctx.type = 'text/javascript';
        ctx.body = output;
        return;
      }
    }
    await next();
  };
};

exports.babel = function (root) {
  return async function (ctx, next) {
    if (ctx.method === 'GET' || ctx.method === 'HEAD') {
      var urlpath = ctx.request.path;
      if (urlpath.match(/\.es$/)) {
        var content;
        try {
          content = await readFile(path.join(root, urlpath), 'utf8');
        } catch (ex) {
          ctx.status = 404;
          ctx.body = 'Cannot find ' + ctx.originalUrl + '\n';
          return;
        }
        // 调用coffee-script编译源文件
        var output = babel.transform(content, {presets: ['es2015']});
        ctx.type = 'text/javascript';
        ctx.body = output.code;
        return;
      }
    }
    await next();
  };
};
