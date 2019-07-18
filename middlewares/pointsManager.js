const axios = require('axios');

const pointsManager = async function (user_id, points) {
	console.log("Grabbing access token...");
	const request_token = await axios
		.post("https://api.intra.42.fr/oauth/token", {
			grant_type: "client_credentials",
			client_id: process.env.STAFF_ID,
			client_secret: process.env.STAFF_SECRET,
			scope: "public projects tig"
		});
	const access_token = request_token.data.access_token;
	console.log("Access token granted : ", access_token);
	if (access_token) {
		console.log("Grabbing coallition infos and coallition_user");
		let coalition_user = await axios
			.get('https://api.intra.42.fr/v2/coalitions_users?user_id=' + user_id, {
				headers: {
					"Authorization": "Bearer " + access_token
				}
			});
		if (coalition_user.data) {
			user = coalition_user.data[0];
			console.log("Coalition_user : ", user);
			console.log("Posting new score...");
			axios.post('https://api.intra.42.fr/v2/coalitions/' + user.coalition_id + '/scores', {
				score: {
					coalitions_user_id: user.id,
					reason: 'You played, you won.',
					value: points
				}
			}, {
				headers: {
					"Authorization": "Bearer " + access_token
				}
			}).then(response => {
				console.log("Done. Points attribued.")
				return (0);
			}).catch(error => {
				console.log("Problem giving coalition poinnts :", error);
				return (error);
			})
		} else {
			console.log("No coalition_user...");
			return (1);
		}
	} else {
		console.log("No access token...");
		return (1);
	}
}

module.exports = pointsManager;