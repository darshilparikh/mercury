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
	text: String,
	timestamp: { type: Date, default: Date.now }
});

var dataConvo = mongoose.model('dataconvo', senSchema);
var rawText = mongoose.model('rawconvo', rawtext);

module.exports = dataConvo;
module.exports = rawText;


