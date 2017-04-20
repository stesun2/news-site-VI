'use strict';

const RemoteRouting = require('loopback-remote-routing');

module.exports = function(Article) {
  RemoteRouting(Article, {only: [
      '@find',
      '@findById',
      '@create'
  ]})

};
