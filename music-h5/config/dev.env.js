'use strict'
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEBUG_MODE: true,
  TIME_STAMP: `"${new Date().toString()}"`
});
