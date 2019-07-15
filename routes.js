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
		if (req.session.allowed == "powned") {
			console.log("oui powned")
			res.send(__dirname + '/views/index.html');
		}
		else {
			console.log("pas powned");
			res.redirect("https://api.intra.42.fr/oauth/authorize?client_id=0ff7e0be9363c0bd6079bfb265041fb18196a70364a0860730ee970d1d46ff02&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fredirect&response_type=code");
		}
	})
	.get('/redirect', (req, res) => {
		req.session.allowed = "powned";
		console.log(req.session);
		res.redirect('/');
	});

module.exports = router;