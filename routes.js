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
		if (req.session.auth) {
			// User is logged in
			res.render(__dirname + '/views/index', {
				message: 'error'
			});
		} else {
			console.log("pas powned");
			res.redirect(process.env.AUTHORIZE);
		}
	})
	// .get('/tig', (req, res) => {
	// 	console.log(req.session)
	// 	if (req.session.pwned) {
	// 		console.log("oui powned")
	// 		res.render(__dirname + '/views/tig', {nb: '2'});
	// 	} else {
	// 		console.log("pas powned");
	// 		res.redirect(process.env.AUTHORIZE);
	// 	}
	// })
	// .get('/coa', (req, res) => {
	// 	console.log(req.session)
	// 	if (req.session.pwned) {
	// 		console.log("oui powned")
	// 		res.render(__dirname + '/views/coa', {nb: '25'});
	// 	} else {
	// 		console.log("pas powned");
	// 		res.redirect(process.env.AUTHORIZE);
	// 	}
	// })
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
										url: response.data.url,
										total_points: 0,
										total_tig: 0,
										total_tig: hours,
										play_entries: []
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
			console.log("Rand :", rand)
			if (rand <= 50) {
				var hours = ['2', '4', '8'];
				hours = hours[Math.floor(Math.random() * hours.length)];
				user = db.get('users').find({
					login: req.session.login
				}).value();
				db.get('users').find({
					login: req.session.login
				}).assign({
					total_tig_hours: user.total_tig_hours + hours,
					total_tig: user.total_tig + 1
				}).get('play_entries').push({
					date: Date.now(),
					type: 'TIG',
					value: hours
				}).write();
				res.render(__dirname + '/views/tig', {
					nb: hours
				});
			} else {
				var points = Math.floor(Math.random() * 50);
				user = db.get('users').find({
					login: req.session.login
				}).value();
				db.get('users').find({
					login: req.session.login
				}).assign({
					total_points: user.total_points + points
				}).get('play_entries').push({
					date: Date.now(),
					type: 'Win',
					value: points
				}).write();
				console.log(req.session.login, " won " + points + ' points');
				res.render(__dirname + '/views/win', {
					nb: points
				});
			}
		}
	})

module.exports = router;