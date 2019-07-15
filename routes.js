const express = require('express');
const router = express.Router();
const axios = require('axios');

function extend(dest, src) {
	for (var key in src) {
		dest[key] = src[key];
	}
	return dest;
}

router
	.get('/', (req, res) => {
		console.log(req.session)
		if (req.session.pwned) {
			console.log("oui powned")
			res.sendFile(__dirname + '/views/index.html');
		} else {
			console.log("pas powned");
			res.redirect("https://api.intra.42.fr/oauth/authorize?client_id=0ff7e0be9363c0bd6079bfb265041fb18196a70364a0860730ee970d1d46ff02&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fredirect&response_type=code&state=pwned");
		}
	})
	.get('/redirect', (req, res) => {
		if (req.query.state == "pwned") {
			console.log("CODE : ", req.query.code)
			axios.post("https://api.intra.42.fr/oauth/token", {
					grant_type: "authorization_code",
					client_id: process.env.CLIENT_ID,
					client_secret: process.env.CLIENT_SECRET,
					code: req.query.code,
					redirect_uri: "http://localhost:3000/redirect"
				})
				.then(response => {
					var token = response.data.access_token;

					axios
						.get("https://api.intra.42.fr/v2/me?access_token=" + token)
						.then(response => {
							console.log(response);
							req.session.login = response.data.login;
							req.session.pwned = true;
							req.session.token = token;
							res.redirect('/');
						});
				})
				.catch(error => {
					console.log(error);
				})
		}
	});

module.exports = router;