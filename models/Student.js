const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const AayaamSchema = new mongoose.Schema({
	role: {
		type: String,
		default: 'Student',
	},
	referenceId: {
		type: String,
	},
	rollNo: {
		type: Number,
		required: true,
	},
	fullName: {
		type: String,
		required: true,
	},
	fatherName: {
		type: String,
		required: true,
	},
	motherName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	fathersOccupation: {
		type: String,
		required: true,
	},
	mothersOccupation: {
		type: String,
		required: true,
	},
	studentContact: {
		type: Number,
		required: true,
	},
	fatherContact: {
		type: Number,
	},
	motherContact: {
		type: Number,
	},
	localGuardNo: {
		type: Number,
	},
	dob: {
		type: Date,
		required: true,
	},
	aadhaarNo: {
		type: Number,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	pwd: {
		type: String,
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
	localAddress: {
		type: String,
		required: true,
	},
	localGuardAdd: {
		type: String,
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
	passYearX: {
		type: Number,
	},
	passYearXI: {
		type: Number,
	},
	passYearXII: {
		type: Number,
	},
	pastNeetMarks: {
		type: Number,
	},
	gradeInX: {
		type: Number,
	},
	gradeInXI: {
		type: Number,
	},
	gradeInXII: {
		type: Number,
	},
	pastNeetAir: {
		type: Number,
	},
	schoolNameX: {
		type: String,
	},
	schoolNameXI: {
		type: String,
	},
	schoolNameXII: {
		type: String,
	},
	noOfAttemptsNeet: {
		type: Number,
	},
	schoolAddressX: {
		type: String,
	},
	schoolAddressXI: {
		type: String,
	},
	schoolAddressXII: {
		type: String,
	},
	pastNeetRemarks: {
		type: String,
	},
	acadYear: {
		type: Number,
		required: true,
	},
	batch: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Batch',
	},
	bag: {
		type: String,
	},
	moduleCard: {
		type: String,
	},
	profilePic: {
		type: String,
	},
	profileOriginalName: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	isDeleted: {
		type: Boolean,
		required: true,
	},
});

const Student = (module.exports = mongoose.model('Student', AayaamSchema));

module.exports.getStudentById = function (id, callback) {
	Student.findById(id, callback);
};

module.exports.getStudentByRollNo = function (rollNo, callback) {
	const query = { rollNo: rollNo };
	Student.findOne(query, callback);
};

// encrypting password (hashing)
module.exports.createStudent = function (newStudent, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newStudent.password, salt, (err, hash) => {
			if (err) throw err;
			newStudent.password = hash;
			newStudent.save(callback);
		});
	});
};

//Update Password
module.exports.updatePass = function (student, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(student.password, salt, (err, hash) => {
			if (err) throw err;
			student.password = hash;
			student.save(callback);
		});
	});
};

// Decrypting Password
module.exports.comparePassword = function (candidatePassword, hash, callback) {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		if (err) throw err;
		callback(null, isMatch);
	});
};
