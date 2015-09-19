'use strict';
var fs = require('fs');
var mongoose = require('mongoose');

var dataConvo = require('../models/convo.server.model.js');
var rawText = require('../models/convo.server.model.js');
console.log('running');

module.exports = function(app) {
	
	/*Indico API*/
	var indico = require('indico.io');
	indico.apiKey =  'ea5035782426051ad2b90811687b1ef0';
	
	var response = function(res) { console.log(res); }
	var logError = function(err) { console.log(err); }
	var db = mongoose.connection;

	//console.log(db);

	db.on('error', function(msg){
		console.log('db connection failed');
	});

	db.once('open',function(){
    console.log('db connection is successful');
	})
  


	/* single example
	indico.sentimentHQ("kill yourself")
	.then(response)
	.catch(logError);
	*/

	app.post('/indico', function (req, res, next) {
		console.log("indico call");
		next();
	});
  
  app.post('/#', function(req,res,next){
    

  })


	fs.readFile('./sample-text.json', 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  //console.log(data);
	  calcSentiment(data);
  });

	var calcSentiment = function(array){
		array = JSON.parse(array);
		//console.log('in calc sentiment');
		//console.log(array[0]);
		for(var i=0; i<array.length; i++){
			//console.log(i)
			//console.log(array[i]);
			indico.sentimentHQ(array[i].text).then(response).catch(logError)
		}
	}	

};
