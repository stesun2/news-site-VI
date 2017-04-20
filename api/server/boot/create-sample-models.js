'use strict';

var async = require('async');
module.exports = function(app) {
  //data sources
  var db = app.dataSources.db;
  
  //create all models
  async.parallel({
    articles: async.apply(createArticles)
  }, function(err, results) {
    if (err) throw err;
    createArticles(results.articles, function(err) {
      console.log('> models created sucessfully');
    });
  });
  //create Articles
  function createArticles(cb) {
    db.automigrate('article', function(err) {
      if (err) return cb(err);
      var article = app.models.article;
      article.create(require('./sample-articles.json'), cb);
    });
  }
};
