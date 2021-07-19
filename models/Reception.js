const mongoose = require('mongoose');

const AayaamSchema = new mongoose.Schema({
	referenceId: {
		type: String,
		required: true,
		unique: true,
	},
	fullName: {
		type: String,
		required: true,
	},
	fatherName: {
		type: String,
		required: true,
	},
	studentContact: {
		type: Number,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	state: {
		type: String,
		required: true,
	},
	district: {
		type: String,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	referenceMedium: {
		type: String,
		required: true,
	},
	class: {
		type: String,
		required: true,
	},
	medium: {
		type: String,
		required: true,
	},
	counsellorName: {
		type: String,
		required: true,
	},
	counsellorCabin: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const DemoStudent = (module.exports = mongoose.model(
	'DemoStudent',
	AayaamSchema,
));

module.exports.getDemoStudentById = function (id, callback) {
	DemoStudent.findById(id, callback);
};

module.exports.createDemoStudent = function (demoStudent, callback) {
	demoStudent.save(callback);
};

module.exports.getDemoStudentByRefId = function (referenceId, callback) {
	const query = { referenceId: referenceId };
	DemoStudent.findOne(query, callback);
};
