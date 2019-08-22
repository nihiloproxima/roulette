const axios = require('axios');
const User = require("../schemas/User");

const correctionManager = async function (login) {
	console.log("Giving a correction point to ", login);
	axios.post('https://api.intra.42.fr/v2/users/' + login + '/correction_points/add?reason="Enigma"', {
		headers: {
			"Authorization": "Bearer " + master_token_infos.access_token
		}
	}).then(res => {
		console.log("ok");
	}).catch(error => {
		console.log(error);
	})
	console.log(call);
}

module.exports = correctionManager;