const mongoose = require('mongoose');

const AayaamSchema = new mongoose.Schema({
	upload_details: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Upload',
	},
	rollno: {
		type: String,
	},
	test_code: {
		type: String,
	},
	answers: {
		type: String,
	},
	answersEdited: {
		type: String,
	},
	answerConfidence: {
		type: String,
	},
	sheetConfidence: {
		type: String,
	},
	rectangleCount1: {
		type: String,
	},
	resolutionIssue: {
		type: String,
	},
	rectangleFault: {
		type: String,
	},
	flippedImage: {
		type: String,
	},
	side1BW: {
		type: String,
	},
	medium: {
		type: String,
	},
	score: {
		type: String,
	},
	right: {
		type: String,
	},
	wrong: {
		type: String,
	},
	blank: {
		type: String,
	},
	rank: {
		type: String,
	},
	physics: {
		type: Number,
	},
	physicsCorrect: {
		type: String,
	},
	physicsIncorrect: {
		type: String,
	},
	physicsBlank: {
		type: String,
	},
	physicsPer: {
		type: String,
	},
	chemistry: {
		type: Number,
	},
	chemistryCorrect: {
		type: String,
	},
	chemistryIncorrect: {
		type: String,
	},
	chemistryBlank: {
		type: String,
	},
	chemistryPer: {
		type: String,
	},
	botany: {
		type: Number,
	},
	botanyCorrect: {
		type: String,
	},
	botanyIncorrect: {
		type: String,
	},
	botanyBlank: {
		type: String,
	},
	botanyPer: {
		type: String,
	},
	zoology: {
		type: Number,
	},
	zoologyCorrect: {
		type: String,
	},
	zoologyIncorrect: {
		type: String,
	},
	zoologyBlank: {
		type: String,
	},
	zoologyPer: {
		type: String,
	},
});

const Result = mongoose.model('Result', AayaamSchema);

module.exports = Result;
