const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const AayaamSchema = new mongoose.Schema({
	role: {
		type: String,
		required: true,
	},

	fullName: {
		type: String,
	},

	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Staff = (module.exports = mongoose.model('Staff', AayaamSchema));

module.exports.getStaffById = function (id, callback) {
	Staff.findById(id, callback);
};

module.exports.getStaffByEmail = function (email, callback) {
	const query = { email: email };
	Staff.findOne(query, callback);
};

// encrypting password (hashing)
module.exports.createStaff = function (newStaff, callback) {
	 bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(newStaff.password, salt, (err, hash) => {
			if (err) {
				throw err;
			} else {
				newStaff.password = hash;
				newStaff.save(callback);
			}			
		});
	});
};

//Update Staff Password
module.exports.updatePass = function (staff, callback) {
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(staff.password, salt, (err, hash) => {
			if (err) throw err;
			staff.password = hash;
			staff.save();
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
