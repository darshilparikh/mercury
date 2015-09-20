'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Article Schema
 */
var senSchema = new Schema({
	log: {
		item: {
		  time: Date,
		  sentiment: Number,
		  keywords: Array
		}
	}
});

var rawtext = new Schema({
      timestamp: String,
    	text: String
	});

var dataConvo = mongoose.model('dataconvo', senSchema);
var rawText = mongoose.model('rawconvo', rawtext);

module.exports = rawText;


