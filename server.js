'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	chalk = require('chalk');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
console.log('hi');
// Bootstrap db connection
var mongooseIn = mongoose.connect(config.db, function(err) {
	console.log(config.db);
	console.log('connected to DB!!!');
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

var db = mongoose.connection;

db.on('error', function(msg){
		console.log('db connection failed');
	});

db.once('open',function(){
  console.log('db connection is successful');
})


// Init the express application
var app = require('./config/express')(mongooseIn);

app.get('/test123', function(req,res,next){
	console.log('got 123')
  rawText.find({}).exec( function(err, results){
    
    if(err){ console.log(err)};
    console.log(results)
  } );
});


// Bootstrap passport config
//require('./config/passport')();

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
console.log('MEAN.JS application started on port ' + config.port);

