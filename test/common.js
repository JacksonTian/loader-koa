'use strict';

const http = require('http');

const Koa = require('koa');

const dev = require('../koa');

const app = new Koa();

app.use(dev.less(__dirname));
app.use(dev.stylus(__dirname));
app.use(dev.babel(__dirname));
app.use(dev.coffee(__dirname));

module.exports = http.createServer(app.callback());
