const mongoose = require('mongoose');

const AayaamSchema = new mongoose.Schema({
    class: {
        type: String,
    },
    medium: {
        type: String,
    },
    batch: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Batch = mongoose.model('Batch', AayaamSchema);

module.exports.createBatch = function(batch, callback) {
    batch.save(callback);
};

module.exports.getBatchById = function(id, callback) {
    Batch.findById(id, callback);
};

module.exports = Batch;