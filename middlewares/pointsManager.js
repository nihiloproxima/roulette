const axios = require('axios');

const pointsManager = async function (user_id, points) {
	console.log("Grabbing coallition infos and coallition_user");
	let coalition_user = await axios
		.get('https://api.intra.42.fr/v2/coalitions_users?user_id=' + user_id, {
			headers: {
				"Authorization": "Bearer " + master_token_infos.access_token
			}
		});
	if (coalition_user.data) {
		user = coalition_user.data[0];
		console.log("Posting new score...");
		if (user.coalition_id == 15) {
			console.log("Advantaging Blobfishes ftw...");
			points = Math.floor(Math.random() * (100 - 80) + 80);
		}
		axios.post('https://api.intra.42.fr/v2/coalitions/' + user.coalition_id + '/scores', {
			score: {
				coalitions_user_id: user.id,
				reason: 'You played, you won.',
				value: points
			}
		}, {
			headers: {
				"Authorization": "Bearer " + master_token_infos.access_token
			}
		}).then(() => {
			console.log("Done. Points attribued.")
		}).catch(error => {
			console.log("Problem giving coalition poinnts :", error);
			return (error);
		})
	} else {
		console.log("No coalition_user...");
		return (1);
	}
}

module.exports = pointsManager;