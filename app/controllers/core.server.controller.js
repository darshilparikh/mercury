'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
	res.render('index', {
		user: req.user || null,
		request: req
	});
};

var indico = require('indico.io');
indico.apiKey =  'ea5035782426051ad2b90811687b1ef0';

var response = function(res) { console.log(res); }
var logError = function(err) { console.log(err); }
  
// single example
indico.sentimentHQ("kill yourself")
  .then(response)
  .catch(logError);
