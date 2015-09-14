var dev = require('../koa');

var koa = require('koa');
var app = koa();
app.use(dev.less(__dirname));
app.use(dev.stylus(__dirname));
app.use(dev.babel(__dirname));
app.use(dev.coffee(__dirname));

var server = app.listen(1334);
