
'use strict';

/**
 * Module dependencies.
 */
 var fs = require('fs'),
 http = require('http'),
 https = require('https'),
 express = require('express'),
 http = require('http'),
 socketio = require('socket.io'),
 morgan = require('morgan'),
 bodyParser = require('body-parser'),
 session = require('express-session'),
 compress = require('compression'),
 methodOverride = require('method-override'),
 cookieParser = require('cookie-parser'),
 helmet = require('helmet'),
 passport = require('passport'),
 mongoStore = require('connect-mongo')({
 	session: session
 }),
 flash = require('connect-flash'),
 config = require('./config'),
 consolidate = require('consolidate'),
 path = require('path'),
 request = require('request');

 module.exports = function(db) {
	// Initialize express app
	var app = express();
	
	// Globbing model files
	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;
	app.locals.facebookAppId = config.facebook.clientID;
	app.locals.jsFiles = config.getJavaScriptAssets();
	app.locals.cssFiles = config.getCSSAssets();

	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});

	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Showing stack errors
	app.set('showStackError', true);

	// Set swig as the template engine
	app.engine('server.view.html', consolidate[config.templateEngine]);

	// Set views path and view engine
	app.set('view engine', 'server.view.html');
	app.set('views', './app/views');

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Enable logger (morgan)
		app.use(morgan('dev'));

		// Disable views cache
		app.set('view cache', false);
	} else if (process.env.NODE_ENV === 'production') {
		app.locals.cache = 'memory';
	}

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// CookieParser should be above session
	app.use(cookieParser());

	// Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new mongoStore({
			db: db.connection.db,
			collection: config.sessionCollection
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// connect flash for flash messages
	app.use(flash());

	// Use helmet to secure Express headers
	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.disable('x-powered-by');

	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public')));

	// Globbing routing files
	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});

	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).render('500', {
			error: err.stack
		});
	});


	// use this if the env is not defined or separated for testing purposes

	/* app.set('trust proxy' 1) // trust the first proxy
	app.use(session({
		secret: "anonymous-id";
		resave: "false", 
		saveUninitialized: true, 
		cookie: { secure = true}
	})) */

var sess = {
	secret: "anonymous-id", 
	cookie: { maxAge : 6000000}
}

if (app.get('env' === 'production')) {
		app.set('trust proxy', 1) // trust first proxy
		sess.cookie.secure = true // serve secure cookies
	}

	app.use(session(sess));

	app.use(function(req, res, next) {
		var sess = req.session
		if (sess.views) {
			res.setHeader('Content-Type', 'text-html')
			res.write(sess.views)
			// write in appropriate data
			res.end() 
		} else {
			sess.views = 1
			res.end('demo. refresh')
		}
	})

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).render('404', {
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

	if (process.env.NODE_ENV === 'secure') {
		// Log SSL usage
		console.log('Securely using https protocol');

		// Load SSL key and certificate
		var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
		var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

		// Create HTTPS Server
		var httpsServer = https.createServer({
			key: privateKey,
			cert: certificate
		}, app);

		// Return HTTPS server instance
		return httpsServer;
	}

	var server = http.createServer(app);
	var io = socketio.listen(server);
	global.io = io;
	app.set('socketio', io);
	app.set('server', server);
	
	
	io.on('connection', function (socket) {
		console.log ("RECOGNIZED CLIENT!");
		socket.on('mentorinit', function(data) {
			console.log(data);
			


		request.post(
			'http://localhost:3000/supportkit/mentor/init',
			{ form: { name: data.data.name } },
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					console.log(body)
				}
			}
		);

		
		socket.on('error', function (err) { console.error(err.stack); // TODO, cleanup })
	});
	});
	io.on( 'error', function(err) {
		console.log("err");
		console.log(err);
	});
	});


	// Return Express server instance
	return app;
};
