const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	user_id: {
		type: Number,
		unique: true
	},
	login: {
		type: String
	},
	total_points: {
		type: Number,
		default: 0
	},
	total_gages: {
		type: Number,
		default: 0
	},
	total_hours: {
		type: Number,
		default: 0
	},
	total_community_services: {
		type: Number,
		default: 0
	},
	activity: [{
		kind: String,
		amount: Number,
		mission: String,
		date: {
			type: Date,
			default: Date.now
		}
	}],
	img_url: String,
	url: String,
	creation_date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', UserSchema);