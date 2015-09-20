'use strict';
var fs = require('fs');
var mongoose = require('mongoose');

var dataConvo = require('../models/sen.server.model.js');
var rawText = require('../models/raw.server.model.js');
//console.log(dataConvo);

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
  app.get('/test123', function(req,res,next){
  	console.log('got 123')
    rawText.find({}).lean().exec( function(err, results){
      console.log(results)
    } );
 
  })

	fs.readFile('./sample-text.json', 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	  //console.log(data);
	  //insertRawToDB(data);
	  //insertSenToDB(data);
	  console.log('about to go to extractKeywords!');
	  insertSenToDB(data, extractKeywords);
  });

	/* 
	** Goes through an array of objects and inserts them into the 
	** database
	*/
	var insertRawToDB = function(array){
		array = JSON.parse(array);	
		for(var i=0; i<array.length; i++){
			var newObject = new rawText({timestamp: array[i].timestamp, text: array[i].text});
			newObject.save(function(err) {
		    if (err) throw err;;
			});
		};
	};

	/* 
	** Goes through an array of objects, analyzes them using
	** Indico's API and inserts these objects into the database.
	*/
	var insertSenToDB = function(array, callback){
		array = JSON.parse(array);	
		for(var i=0; i<array.length; i++){
			// run sentiment analyses on the chunk of text
			//var keywords = extractKeywords(array[i].text);
			extractKeywords(array[i].text, array[i].timestamp, createObject);
			//console.log(array[i])
			//var sentiment = 
			//var newObject = new dataConvo({timestamp: array[i].timestamp, sentiment: sentiment, keywords: extractKeywords(array[i].text)});
			/*newObject.save(function(err) {
		    if (err) throw err;;
			});*/
		};
	};

	/*
	** Extracts the keywords from the text using Indico API
	** and returns an array with those words
	*/
	var extractKeywords = function(text, timestamp, callback){
		var array=[];
		
		indico.keywords(text).then( function(res){ 
			// use loop to add values from the response object to the array
			loop(array, res);
			var sentiment = indico.sentimentHQ(text).then(function(response){
				console.log(response);
				callback(timestamp, array,response);

			}).catch(logError);
			//var newObject = new dataConvo({timestamp: array[i].timestamp, sentiment: sentiment, keywords: array});
			
			//callback(newObject); 

		}).catch( function(err){ console.warn(err); });
	};

var loop = function(array,res){
	//console.log(res);
	for(var key in res){
		array.push(key);
	}
	//console.log(array);
}

  var createObject = function(timestamp, array, response){
  	/*
  	console.log(typeof timestamp);
  	console.log('array is ');
  	console.log(array);
		*/
   	var newObject = new dataConvo( {
   		log: {
				item: {
				  timestamp: timestamp,
				  sentiment: response,
				  keywords: array
				}
			} 
		});
		//console.log(newObject);
		newObject.save(function(err) {
      if (err && (11000 === err.code || 11001 === err.code)){
      	console.log('Item is already in the database.');
      }
		});
 	};

// end of module.exports
}
