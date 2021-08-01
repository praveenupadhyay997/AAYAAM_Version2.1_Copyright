const mongoose = require('mongoose');

const AayaamSchema = new mongoose.Schema({
    rollNo: {
        type: Number,
        required: true,
    },
    paymentAmount: {
        type: Number,
        required: true,
    },
    submissionDate: {
        type: Date,
        default: Date.now,
    },
    approvedDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        required: true
    }
});

const ChequeDetails = mongoose.model('ChequeDetails', AayaamSchema);

module.exports = ChequeDetails;

module.exports.createChequeDetails = function(chequeDetails, callback) {
    chequeDetails.save(callback);
};

module.exports.getChequeDetailsByRollNo = function(rollNo, callback) {
    const query = { rollNo: rollNo };
    ChequeDetails.find(query, callback);
};