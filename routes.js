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
	User.find({
		total_hours: {
			$gt: 0
		}
	}, null, {
		sort: {
			total_hours: -1
		}
	}, (err, docs) => {
		res.json(docs);
	})
});

router.get('/winners', async (req, res) => {
	User.find({
		total_points: {
			$gt: 0
		}
	}, null, {
		sort: {
			total_points: -1
		}
	}, (err, docs) => {
		res.json(docs);
	})
})

router.get('/pwn', async (req, res) => {
	if (req.session.auth) {
		let user = await User.findOne({
			login: req.session.login
		});

		// Compare last_entry to now, preventing user to spam actually set to 6h !

		var last_entry = user.activity[user.activity.length - 1];
		if (last_entry) {
			last_try = Date.now() - last_entry.date.getTime();
			console.log("Last try : ", last_try);
			if (last_try < 21600000) {
				res.render(__dirname + '/views/wait', {
					countDownDate: last_try
				});
			} else {
				var rand = Math.floor(Math.random() * 100);
				if (rand <= 5) {
					var rand2 = Math.floor(Math.random() * 100);
					hours = rand2 <= 10 ? 4 : 2;

					user.total_community_services += 1;
					user.total_hours += hours;
					user.activity.push({
						kind: "TIG",
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
					var points = Math.floor(Math.random() * 100);

					user.total_points += points;
					user.activity.push({
						kind: "coalition_points",
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
			}
		} else {
			// User can play 
			var rand = Math.floor(Math.random() * 100);
			if (rand <= 5) {
				var rand2 = Math.floor(Math.random() * 100);
				hours = rand2 <= 10 ? 4 : 2;

				user.total_community_services += 1;
				user.total_hours += hours;
				user.activity.push({
					kind: "TIG",
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
				var points = Math.floor(Math.random() * 100);

				user.total_points += points;
				user.activity.push({
					kind: "coalition_points",
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
		}
	} else {
		console.log("User not logged in");
		res.redirect('/');
	}
})

module.exports = router;