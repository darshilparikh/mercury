'use strict';

module.exports = function(app) {
	
	app.post('/supportkit', function (req, res, next) {
		console.log("supportkit");
		console.log(req.body);
		console.log(req.headers);
		res.send();
		//next();
	});
};
