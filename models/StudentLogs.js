const mongoose = require('mongoose');

const AayaamSchema = new mongoose.Schema({
    timeStamp: {
        type: Date,
        default: Date.now,
    },
    rollNo: {
        type: String,
        required: true,
    },
    logText: {
        type: String,
        required: true,
    }
});

const StudentLogs = mongoose.model('StudentLogs', AayaamSchema);

module.exports = StudentLogs;

module.exports.createStudentLogs = function(logs, callback) {
    logs.save(callback);
};

module.exports.getLogsByRollNo = function(rollNo, callback) {
    const query = { rollNo: rollNo };
    StudentLogs.findOne(query, callback);
};