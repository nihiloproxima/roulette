const mongoose = require('mongoose');

const secretSchema = mongoose.Schema({
	finish: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model('Secret', secretSchema);