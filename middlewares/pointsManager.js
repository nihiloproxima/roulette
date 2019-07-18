const axios = require('axios');

const pointsManager = function (user_id, points) {
	console.log("Grabbing access token...");
	axios
		.post("https://api.intra.42.fr/oauth/token", {
			grant_type: "client_credentials",
			client_id: process.env.STAFF_ID,
			client_secret: process.env.STAFF_SECRET,
			scope: "public projects tig"
		})
		.then(response => {
			const access_token = response.data.access_token;
			console.log("Access granted, code : ", access_token);
			console.log("Grabbing coallition infos and coallition_user");
			axios
				.get('https://api.intra.42.fr/v2/coalitions_users?user_id=' + user_id)
				.then(results => {
					console.log("Done.");
					coalition_user = results.data[0];
					axios.post('https://api.intra.42.fr/v2/coalitions/' + coalition_user.coalition_id + '/scores', {
						score: {
							coalition_user_id: coalition_user.user_id,
							reason: 'You played, you won.',
							value: points
						}
					}, {
						headers: {
							"Authorization": "Bearer " + access_token
						}
					}).then(call => {
						console.log("Points attribued.")
						return (0);
					}).catch(error => {
						console.log("Can't close :", error);
						return (error);
					})
				})
				.catch(error => {
					return (error);
				})
		})
		.catch(error => {
			console.log(error);
		})
}

module.exports = pointsManager;