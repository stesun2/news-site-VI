// Copyright IBM Corp. 2015,2016. All Rights Reserved.
// Node module: loopback-example-access-control
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

var bodyParser = require('body-parser');
var boot = require('loopback-boot');
var loopback = require('loopback');
var path = require('path');

var app = module.exports = loopback();

app.middleware('initial', bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // LoopBack comes with EJS out-of-box
app.set('json spaces', 2); // format json responses for easier viewing

// must be set to serve views properly when starting the app via `slc run` from
// the project root
app.set('views', path.resolve(__dirname, 'views'));
// app.use(loopback.token());
// app.use(function(req, res, next) {
//   var token = req.accessToken;
//   if (!token) {
//       return next();
//   }
//   var now = new Date();
//   if ( now.getTime() - token.created.getTime() < 1000 ) {
//       return next();
//   }
//   req.accessToken.created = now;
//   req.accessToken.ttl     = 604800; //one week
//   req.accessToken.save(next);
// });

app.start = function() {
  // retrieve port from config.json
  const port = app.get('port');
  // start the web server
  return app.listen(port, function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
