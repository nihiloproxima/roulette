const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require("./schemas/User");

router.get('/', (req, res) => {
	if (req.session.auth) {
		// User is logged in
		res.render(__dirname + '/views/index', {
			message: 'error'
		});
	} else {
		console.log("pas powned");
		res.redirect(process.env.AUTHORIZE);
	}
});

router.get('/redirect', async (req, res) => {
			if (req.query.state == "pwned") {
				console.log("CODE : ", req.query.code)
				axios.post("https://api.intra.42.fr/oauth/token", {
						grant_type: "authorization_code",
						client_id: process.env.CLIENT_ID,
						client_secret: process.env.CLIENT_SECRET,
						code: req.query.code,
						redirect_uri: process.env.REDIRECT_URI
					})
					.then(async response => {
								var token = response.data.access_token;

								axios
									.get("https://api.intra.42.fr/v2/me?access_token=" + token)
									.then(async response => {
											console.log("User datas : ", response.data);
											console.log("Creating user");
											user_exists = await User.findOne({
												login: response.data.login
											});
											console.log('User exists ? ', user_exists);
											if (!user_exists) {
												user = new User({
													user_id: response.data.id,
													login: response.data.login,
													img_url: response.data.img_url,
													url: response.data.url,
												});
												user.save()
													.then((data) => {
														res.json(data);
														console.log("User saved");
													})
													.catch((err) => {
														res.json({
															message: err
														});
														console.log("message : ", error);
													})
												};
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
			});

		router.get('/tiged', (req, res) => {
			User.find({}, (err, docs) => {
				res.json(docs);
			})
		});

		router.get('/pwn', async (req, res) => {
			console.log(req.session)
			if (req.session.auth) {
				let user = await User.findOne({
					login: req.session.login
				});

				// Generate Random Int
				var rand = Math.floor(Math.random() * 100);
				if (rand <= 50) {
					var hours = [2, 4, 8];
					hours = hours[Math.floor(Math.random() * hours.length)];

					user.total_community_services += 1;
					user.total_hours += hours;
					user.activity.push({
						type: "TIG",
						amount: hours
					});
					user.save(error => {
						console.log(error);
					})
					console.log(req.session.login, " got " + hours + ' TIG hours.');
					res.render(__dirname + '/views/tig', {
						nb: hours
					});
				} else {
					var points = Math.floor(Math.random() * 50);

					user.total_points += points;
					user.activity.push({
						type: "coalition_points",
						amount: points
					});
					user.save(error => {
						console.log(error);
					})
					console.log(req.session.login, " won " + points + ' points.');
					res.render(__dirname + '/views/win', {
						nb: points
					});
				}
			} else {
				console.log("User not logged in");
			}
		})

		module.exports = router;