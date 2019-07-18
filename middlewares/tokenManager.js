const axios = require('axios');

function refresh() {
	console.log("Grabbing new token...");
	axios
		.post("https://api.intra.42.fr/oauth/token", {
			grant_type: "client_credentials",
			client_id: process.env.STAFF_ID,
			client_secret: process.env.STAFF_SECRET,
			scope: "public projects tig"
		})
		.then(response => {
			global.master_token_infos = response.data;
			console.log("New token acquired.");
		})
		.catch(error => {
			console.log(error);
		})
}

const tokenManager = (req, res, next) => {
	if (!global.master_token_infos) {
		console.log("No access token. Requesting one...");
		refresh();
	} else {
		now = Date.now();
		token_expiration = (master_token_infos.created_at + master_token_infos.expires_in) * 1000;
		expiration_date = new Date(token_expiration).toString();
		console.log("Token expires on ", expiration_date);
		if (token_expiration - now < 0) {
			console.log("Master token is expired.");
			refresh();
		}
	}
	next();
}


module.exports = tokenManager;