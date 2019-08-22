const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require("../schemas/User");
const Secret = require("../schemas/Secret");
const tigManager = require("../middlewares/tigManager.js");
const pointsManager = require('../middlewares/pointsManager.js');
const correctionManager = require('../middlewares/correctionManager');

router.get('/', (req, res) => {
	if (req.session.auth) {
		// User is logged in
		res.render(__dirname + '/../views/index');
	} else {
		res.redirect(process.env.AUTHORIZE);
	}
});

router.get('/redirect', async (req, res) => {
	if (req.query.state == "pwned") {
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
						console.log("Requesting user");
						user_exists = await User.findOne({
							login: response.data.login
						});
						if (!user_exists) {
							console.log("Creating new user :", user_exists == undefined);
							user = new User({
								user_id: response.data.id,
								login: response.data.login,
								img_url: response.data.img_url,
								url: response.data.url,
							});
							user.save()
								.then((data) => {
									console.log("New user saved");
								})
								.catch((err) => {
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

router.get('/fakeauth', (req, res) => {
	req.session.login = "nihilo";
	req.session.auth = true;
	res.redirect('/');
})

router.get('/h4xx', async (req, res) => {
	if (req.session.auth) {
		res.render(__dirname + '/../views/gatekeeper');
	} else {
		res.redirect('/');
	}
})

router.post('/h4xx', async (req, res) => {
	if (req.body['g-recaptcha-response']) {
		var path = require('path');
		res.sendFile(path.resolve('public/autobot.png'));
	} else {
		res.render(__dirname + '/../views/gatekeeper', {
			error: "You can't beat that! Right ?"
		});
	}
})

router.get('/pwn', async (req, res) => {
	if (req.session.auth) {
		let user = await User.findOne({
			login: req.session.login
		});

		// Compare last_entry to now, preventing user to spam actually set to 2h !
		var last_entry = user.activity[user.activity.length - 1];
		if (last_entry) {
			last_try = Date.now() - last_entry.date.getTime();
			if (last_try < 3600000 * 2) {
				if (user.secret_complete == 1) {
					res.render(__dirname + '/../views/wait', {
						countDownDate: last_entry.date.getTime()
					});
					return (0);
				} else {
					res.redirect('/h4xx');
					return (0);
				}
			}
		}
		// var rand = Math.floor(Math.random() * 100);
		// if (rand <= 10) {
		// 	var rand2 = Math.floor(Math.random() * 100);
		// TIG RNG
		// imumunised = ['naplouvi', 'fleonard', 'ftourret', 'nihilo', 'rcodazzi', 'conrodri', 'vicaster'];
		// if (rand2 <= 10 && !immunised.includes(req.session.login) && user.total_hours <= 0) {
		// 	hours = 2;
		// 	user.total_community_services += 1;
		// 	user.total_hours += hours;

		// 	user.activity.push({
		// 		kind: "TIG",
		// 		amount: hours
		// 	});
		// 	user.save(error => {
		// 		console.log(error);
		// 	})
		// 	console.log(req.session.login, " got " + hours + ' TIG hours.');
		// 	res.render(__dirname + '/../views/tig', {
		// 		nb: hours
		// 	});
		// 	tigManager(user.user_id, hours);
		if (user.secret_complete == 0) {
			var points = -42;

			user.total_points += points;
			user.activity.push({
				kind: "coalition_points",
				amount: points
			});
			user.save(error => {
				console.log(error);
			})
			console.log(req.session.login, " lost " + points + ' points.');
			res.render(__dirname + '/../views/lost', {
				nb: points
			});
			pointsManager(user.user_id, points, "Anti-decepticons protection.");
		} else {
			// You won some coallition points
			var points = 101;
			user.total_points += points;
			user.activity.push({
				kind: "coalition_points",
				amount: points
			});
			user.save(error => {
				console.log(error);
			})
			console.log(req.session.login, " won " + points + ' points.');
			res.render(__dirname + '/../views/win', {
				nb: points
			});
			pointsManager(user.user_id, points, "Exploiting Autobots backdoor.");
		}
	} else {
		res.redirect('/');
	}
})

router.get('/optimusprime', async (req, res) => {
	// if (req.session.auth) {
	let question = "";
	if (!req.session.state) {
		req.session.start = Date.now();
		req.session.state = "1";
		console.log(req.session.login, " is starting the quest.");
	}
	if (req.session.state == 1) {
		image = "https://image.noelshack.com/fichiers/2019/29/6/1563628453-deepthought.jpg";
		question = "Cette question est facile, la réponse également.";
	} else if (req.session.state == 2) {
		image = "";
		question = "Permission denied (gssapi-with-mic).\
		fatal: Could not read from remote repository.\
		Please make sure you have the correct access rights\
		and the repository exists.";
	} else if (req.session.state == 3) {
		image = "https://image.noelshack.com/fichiers/2019/29/7/1563744656-138879-full.png"
		question = "";
	} else if (req.session.state == 4) {
		image = "";
		question = "S SAPTO NLLA HSUOY";
	} else if (req.session.state == 5) {
		image = "https://image.noelshack.com/fichiers/2019/34/4/1566435512-ohoh.jpg";
		question = "";
	} else if (req.session.state == 6) {
		user = await User.findOne({
			"login": req.session.login
		});
		if (user && user.secret_complete == 0) {
			console.log(req.session.login + " finished the quest.");
			message = "Félicitations, tu as gagné 500 points !"
			user.secret_complete = 1;
			user.total_points += 500;
			user.activity.push({
				kind: "coalition_points",
				amount: 500
			});
			user.save(error => {
				console.log(error);
			})
			if (req.session.login != "nihilo") {
				pointsManager(user.user_id, 500, "You completed", 1);
			}
		} else {
			message = "Tu as déjà eu tes points. Abuse pas";
		}
		var time = msToHMS(Date.now() - req.session.start);
		res.render(__dirname + "/../views/success", {
			time: time,
			message: message
		});

		return;
	}

	res.render(__dirname + "/../views/secret", {
		state: req.session.state,
		error: req.session.error,
		question: question,
		image: image
	});
	// secret = await Secret.findById("5d3321887c213e5998eee82d");
	// if (secret.finish == 0) {
	// 	res.render(__dirname + '/../views/secret');
	// 	console.log(req.session.login, " found the secret path");
	// 	return
	// } else {
	// 	console.log(req.session.login, " found the secret path but too late.")
	// 	res.render(__dirname + '/../views/toolate', {
	// 		text: "Too late, " + secret.winner + " a trouvé la réponse ¯\\_(ツ)_/¯"
	// 	});
	// }
	// } else {
	// 	console.log("User not logged in");
	// 	res.redirect('/');
	// }
});

router.post('/optimusprime', async (req, res) => {
	console.log(req.session.login, " - state : ", req.session.state, " - answer attempt :", req.body.answer);
	var errors = ["Allez un petit effort...", "T'es sûr(e) que tu sais lire ?", "How can you talk without a brain?", "Si on envoyait les cons sur orbite t'aurais pas fini de tourner...", "Ce que tu dis n'a aucun sens...", "Nope.", "Demande à ta mère", "Mhhhhhhhh c po ca", "Hein ??!", "Ché po trop mais à mon avis c'est pas ça", "Demande à Google au lieu de me faire perdre mon temps", "Bravo ! Nan je dec, c'est pas ça."];
	var message = errors[Math.floor(Math.random() * errors.length)];
	if (req.body.answer) {
		if (req.session.state == 1 && req.body.answer == "également") {
			req.session.state = 2;
			req.session.error = "";
		} else if (req.session.state == 2 && req.body.answer.toLowerCase() == "kinit " + req.session.login) {
			req.session.state = 3;
			req.session.error = "";
		} else if (req.session.state == 3 && req.body.answer.toLowerCase() == "brainfuck") {
			req.session.state = 4;
			req.session.error = "";
		} else if (req.session.state == 4 && req.body.answer.toLowerCase() == "gandalf") {
			req.session.state = 5;
			req.session.error = "";
		} else if (req.session.state == 5 && req.body.answer.toLowerCase() == "piscineux") {
			req.session.state = 6;
			req.session.error = "";
		} else {
			req.session.error = message;
		}
	}
	res.redirect('/optimusprime');
});

// router.post('/secret', async (req, res) => {
// 	if (req.session.auth) {
// 		console.log(req.session.login, " tried : ", req.body.whoami);
// 		let user = await User.findOne({
// 			login: req.session.login
// 		});
// 		secret = await Secret.findById("5d3321887c213e5998eee82d");
// 		if (secret.finish == 1) {
// 			res.render(__dirname + '/../views/toolate', {
// 				text: "Too late, " + secret.winner + " a trouvé la réponse ¯\\_(ツ)_/¯"
// 			});
// 		} else if ((["narcissa"].includes(req.body.whoami.toLowerCase())) && secret.finish == 0) {
// 			res.render(__dirname + '/../views/win', {
// 				nb: "ENORMEMENT de"
// 			});
// 			console.log(user.login, " found the answer and won the prize. What a madlad.")
// 			secret.finish = 1;
// 			secret.winner = user.login;
// 			secret.save(error => {
// 				console.log(error);
// 			})

// 			if (req.session.login != "nihilo") {
// 				pointsManager(user.user_id, 3000, "You found the secret answer. Congratulations.", 1);
// 			}
// 		} else {
// 			var errors = ["Allez un petit effort...", "T'es sûr(e) que tu sais lire ?", "How can you talk without a brain?", "Si on envoyait les cons sur orbite t'aurais pas fini de tourner...", "Ce que tu dis n'a aucun sens...", "Nope.", "Demande à ta mère", "Mhhhhhhhh c po ca", "Hein ??!", "Ché po trop mais à mon avis c'est pas ça", "Demande à Google au lieu de me faire perdre mon temps", "Bravo ! Nan je dec, c'est pas ça."];
// 			var message = errors[Math.floor(Math.random() * errors.length)];
// 			res.render(__dirname + '/../views/secret', {
// 				error: message
// 			})
// 		}
// 	} else {
// 		res.redirect('/');
// 	}
// })

function msToHMS(ms) {
	// 1- Convert to seconds:
	var seconds = ms / 1000;
	// 2- Extract hours:
	var hours = parseInt(seconds / 3600); // 3,600 seconds in 1 hour
	seconds = seconds % 3600;
	Math.floor(seconds); // seconds remaining after extracting hours
	// 3- Extract minutes:
	var minutes = parseInt(seconds / 60); // 60 seconds in 1 minute
	// 4- Keep only seconds not extracted to minutes:
	seconds = seconds % 60;
	return (hours + ":" + minutes + ":" + seconds);
}

module.exports = router;
