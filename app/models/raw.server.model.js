'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
// for raw message text
var senSchema = new Schema({
	log: {
		item: {
		  timestamp: String,
		  sentiment: Number,
		  keywords: Array
		}
	}
});

var rawtext = new Schema({
  timestamp: String,
	text: String
});

var rawText = mongoose.model('rawconvo', rawtext,'rawconvo');

module.exports = rawText;



