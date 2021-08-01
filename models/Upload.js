const mongoose = require('mongoose');
const Result = require('./Result');

const AayaamSchema = new mongoose.Schema({
	examName: {
		type: String,
	},
	batch: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Batch',
	},
	examDate: {
		type: Date,
	},
	examFile: {
		type: String,
	},
	originalName: {
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

const Upload = mongoose.model('Upload', AayaamSchema);
AayaamSchema.pre('remove', (err, next) => {
	if (err) {
		throw err;
	} else {
		Result.remove({ upload_details: this._id }).exec();
		next();
	}
});

module.exports = Upload;
