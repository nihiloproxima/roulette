const mongoose = require('mongoose');

const closeSchema = mongoose.Schema({
	login: String,
	creation_date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Close', closeSchema);