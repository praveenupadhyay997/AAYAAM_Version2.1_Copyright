const mongoose = require('mongoose');

const AayaamSchema = new mongoose.Schema({
	counter: {
		type: Number,
        required: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Counter = mongoose.model('Counter', AayaamSchema);

module.exports = Counter;
module.exports.createCounter = function (count, callback) {
	count.save(callback);
};

