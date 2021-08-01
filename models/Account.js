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
    totalFeeAmountReceived: {
        type: Number,
        required: true,
    },
    modeOfPayment: {
        type: String,
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
        type: String,
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
        type: String,
    },
    installDateTwo: {
        type: Date,
        default: Date.now
    },
    statusTwo: {
        type: Boolean,
    },
    installThree: {
        type: String,
    },
    installDateThree: {
        type: Date,
        default: Date.now
    },
    statusThree: {
        type: Boolean,
    },
    installFour: {
        type: String,
    },
    installDateFour: {
        type: Date,
        default: Date.now
    },
    statusFour: {
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    confirmationFile: {
        type: String,
    },
    originalName: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        required: true,
    },
});

const Account = mongoose.model('Account', AayaamSchema);

module.exports = Account;

module.exports.createAccount = function(account, callback) {
    account.save(callback);
};