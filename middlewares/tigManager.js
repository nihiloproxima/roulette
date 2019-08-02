const axios = require('axios');
const Close = require('../schemas/Close');

function checkCloseCount() {
	closes = await Close.find();
	for (i in closes) {

	}
}

const tigManager = function (user_id, hours) {
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
				"Authorization": "Bearer " + master_token_infos.access_token
			}
		}).then(results => {
			console.log("Close created : ", results.data);
			console.log("Assign community service...");
			axios.post('https://api.intra.42.fr/v2/community_services', {
					"community_service": {
						"close_id": results.data.id,
						"duration": hours * 60 * 60,
						"occupation": "",
						"tiger_id": 58278
					},
				}, {
					headers: {
						"Authorization": "Bearer " + master_token_infos.access_token
					}
				}).then(new_response => {
					console.log("Successfully Tiged :", new_response.data);
					return (new_response.data);
				})
				.catch(error => {
					console.log(error);
					return (error);
				})
		}).catch(error => {
			console.log("Can't close :", error);
			return (error);
		})
}

module.exports = tigManager;