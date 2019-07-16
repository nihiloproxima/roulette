const axios = require('axios');

const tigManager = function (user_id, hours) {
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
			console.log("Creating new close...");
			axios
				.post('https://api.intra.42.fr/v2/users/' + user_id + '/closes', {
					"close": {
						"closer_id": 58278,
						"kind": "other",
						"reason": "You played, you lost.",
						"state": "close",
						"user_id": user_id
					}
				}, {
					headers: {
						"Authorization": "Bearer " + access_token
					}
				}).then(results => {
					console.log("Close created : ", results.data);
					console.log("Assign community service...");
					axios.post('https://api.intra.42.fr/v2/community_services', {
							"community_service": {
								"close_id": results.data.id,
								"duration": hours * 60 * 60,
								"occupation": "Regarder Shrek, en entier, avec Mathieu Trentin",
								"tiger_id": 58278
							},
						}, {
							headers: {
								"Authorization": "Bearer " + access_token
							}
						}).then(new_response => {
							console.log("Successfully Tiged :", new_response.data);
							res.send(new_response.data)
						})
						.catch(error => {
							console.log(error);
							return (error);
						})
				}).catch(error => {
					console.log("Can't close :", error);
					return (error);
				})
		})
		.catch(error => {
			return (error);
		})
}

module.exports = tigManager;