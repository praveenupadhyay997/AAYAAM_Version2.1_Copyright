const mongoose = require('mongoose');

const AayaamSchema = new mongoose.Schema({
	student: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Student',
	},
	rollNo: {
		type: Number,
		required: true,
	},
	totalFeeAmount: {
		type: Number,
		required: true,
	},
	modeOfPayment: {
		type: String,
		required: true,
	},
	board: {
		type: String,
		required: true,
	},
	noOfInstallment: {
		type: Number,
		required: true,
	},
	remarks: {
		type: String,
		required: true,
	},
	installOne: {
		type: Number,
		required: true,
	},
	installDateOne: {
		type: Date,
		required: true,
	},
	statusOne: {
		type: Boolean,
		required: true,
	},
	installTwo: {
		type: Number,
	},
	installDateTwo: {
		type: Date,
	},
	statusTwo: {
		type: Boolean,
	},
	installThree: {
		type: Number,
	},
	installDateThree: {
		type: Date,
	},
	statusThree: {
		type: Boolean,
	},
	installFour: {
		type: Number,
	},
	installDateFour: {
		type: Date,
	},
	statusFour: {
		type: Boolean,
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

const Account = mongoose.model('Account', AayaamSchema);

module.exports = Account;

module.exports.createAccount = function (account, callback) {
	account.save(callback);
};
