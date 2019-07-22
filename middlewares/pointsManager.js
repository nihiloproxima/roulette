const axios = require('axios');
const User = require("../schemas/User");

const pointsManager = async function (user_id, points, reason, secret = 0) {
	console.log("Grabbing coallition infos and coallition_user");
	let coalition_user = await axios
		.get('https://api.intra.42.fr/v2/coalitions_users?user_id=' + user_id, {
			headers: {
				"Authorization": "Bearer " + master_token_infos.access_token
			}
		});
	if (coalition_user.data) {
		user = coalition_user.data[0];
		if (user.coalition_id == 15 || user.coalition_id == 16 || user.coalition_id == 17) {
			if (secret == 1 && user.coalition_id == 15) {
				points = 3000;
				let dbuser = await User.findOne({
					user_id: user_id
				});
				console.log("Giving " + points + " points to " + dbuser.login);

				dbuser.total_points += points;
				dbuser.activity.push({
					kind: "coalition_points",
					amount: points
				});
				dbuser.save(error => {
					console.log(error);
				})
			}
			axios.post('https://api.intra.42.fr/v2/coalitions/' + user.coalition_id + '/scores', {
				score: {
					coalitions_user_id: user.id,
					reason: reason,
					value: points
				}
			}, {
				headers: {
					"Authorization": "Bearer " + master_token_infos.access_token
				}
			}).then(() => {
				console.log("Done.");
			}).catch(error => {
				console.log("Problem giving coalition points :", error);
				return (error);
			})
		}
	} else {
		console.log("No coalition_user...");
		return (1);
	}
}

module.exports = pointsManager;