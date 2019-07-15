const express = require('express');
const router = express.Router();
const axios = require('axios');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)


function extend(dest, src) {
	for (var key in src) {
		dest[key] = src[key];
	}
	return dest;
}

router
	.get('/', (req, res) => {
		console.log(req.session)
		if (req.session.auth == true) {
			res.sendFile(__dirname + '/views/index.html');
		} else {
			console.log("pas powned");
			res.redirect(process.env.AUTHORIZE);
		}
	})
	.get('/redirect', (req, res) => {
		// Set some defaults (required if your JSON file is empty)
		db.defaults({
				users: [],
				count: 0
			})
			.write()
		if (req.query.state == "pwned") {
			console.log("CODE : ", req.query.code)
			axios.post("https://api.intra.42.fr/oauth/token", {
					grant_type: "authorization_code",
					client_id: process.env.CLIENT_ID,
					client_secret: process.env.CLIENT_SECRET,
					code: req.query.code,
					redirect_uri: process.env.REDIRECT_URI
				})
				.then(response => {
					var token = response.data.access_token;

					axios
						.get("https://api.intra.42.fr/v2/me?access_token=" + token)
						.then(response => {
							user_exists = db.get('users').find({
								id: response.data.id
							}).value();
							console.log(user_exists);
							if (!user_exists) {
								db.get('users')
									.push({
										id: response.data.id,
										login: response.data.login,
										img_url: response.data.img_url,
										url: response.data.url
									}).write();
								db.update('count', n => n + 1).write();
							}

							req.session.login = response.data.login;
							req.session.auth = true;
							req.session.token = token;
							res.redirect('/');
						});
				})
				.catch(error => {
					console.log(error);
				})
		}
	})
	.get('/tiged', (req, res) => {
		res.sendFile(__dirname + '/db.json');
	})
	.get('/pwn', (req, res) => {
		if (req.session.auth) {
			var rand = Math.floor(Math.random() * 100);
			if (rand <= 10) {
				console.log("powned");
				res.sendFile(__dirname + '/views/tig');
			} else {
				console.log("winner");
				res.sendFile(__dirname + '/views/win');
			}
		}
	})

module.exports = router;