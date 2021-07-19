const mongoose = require('mongoose');

const AayaamSchema = new mongoose.Schema({
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    rollNo: {
        type: Number,
        required: true,
    },
    studentFullName: {
        type: String,
        required: true,
    },
    studentFatherName: {
        type: String,
        required: true,
    },
    batch: {
        type: String,
        required: true,
    },
    paymentAmount: {
        type: Number,
        required: true,
    },
    modeOfPayment: {
        type: String,
        required: true
    }
});

const AccountantLogs = mongoose.model('AccountantLogs', AayaamSchema);

module.exports = AccountantLogs;

module.exports.createAccountantLogs = function(logs, callback) {
    logs.save(callback);
};

module.exports.getLogsByRollNo = function(rollNo, callback) {
    const query = { rollNo: rollNo };
    AccountantLogs.findOne(query, callback);
};

module.exports.getLogsByBatch = function(batch, callback) {
    const query = { batch: batch };
    AccountantLogs.findOne(query, callback);
};