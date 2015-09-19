'use strict';

/**
 * Module dependencies.
 */
var cookieSession = require('cookie-session')
module.exports = function(app) {
	// User Routes
	var users = require('../../app/controllers/anonymous-users.server.controller');

	app.post('/anonymous-users', function (req, res, next) {
		console.log("anonymous users call");
		next();
	});	};