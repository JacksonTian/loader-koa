'use strict';

const dev = require('../koa');

const Koa = require('koa');
const app = new Koa();
app.use(dev.less(__dirname));
app.use(dev.stylus(__dirname));
app.use(dev.babel(__dirname));
app.use(dev.coffee(__dirname));

app.listen(1334);
