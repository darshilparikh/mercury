var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// for processed text
var senSchema = new Schema({
	log: {
		item: {
		  timestamp: String,
		  sentiment: Number,
		  keywords: Array
		}
	}
});

var dataConvo = mongoose.model('dataconvo', senSchema, 'dataconvo');

module.exports = dataConvo;
