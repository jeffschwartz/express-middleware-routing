/*
 * Blog article on Express route specific middleware
 * and how it can be usedto expose a database to routes.
 * Published on 2012-08-23 to my Ramblings blog on Wordpress
 * @ http://jefftschwartz.wordpress.com.
 */

/**
 * Module dependencies.
 */

var mongo = require("mongodb")
  , express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

// server options
var serverOptions = {
  auto_reconnect: true,
  poolSize: 10
};

// create mongo server
var server = new mongo.Server("localhost", 27017, serverOptions);
// create mongo database
var db = new mongo.Db("dbname", server, {});

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


db.open(function(err, db){
  if(err){
    throw err;
  }

  // route specific middleware - will expose the database to route
  var exposeDb = function(req, resp, next){
    req.mongoDb = db;
    next();
  };

  app.get('/', exposeDb, routes.index);

  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });

});

