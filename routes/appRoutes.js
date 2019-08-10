const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require("../schemas/User");
const Secret = require("../schemas/Secret");
const tigManager = require("../middlewares/tigManager.js");
const pointsManager = require('../middlewares/pointsManager.js');

const gages = [
	"Chaque vendredi à 16h42 avant l'exam, tu passeras en cluster en criant \"Ça va être tout noir !\"",
	"Tu signeras tous tes feedbacks de correction de ton login en binaire",
	"Tu signeras tous tes feedbacks de correction par un \"Je t'aime\"",
	"Tu signeras tous tes messages Slack par \"Méfaits accomplis\"",
	"Ajoute l'emoji :bubflesh: à coté de ton login sur Slack",
	"Pendant une demie-heure tu feras le Groom dans l'ascenseur en demandant aux gens \"Quel étage ?\", en étant courtois et souriant.",
	"Remet de l'ordre dans les chaises en cantina.",
	"Explique à tes camarades comment faire un cake au chocolat sans parler",
	"Tu as interdiction de parler jusqu'à ce que quelqu'un prononce ton login.",
	"Envoie sur random une phrase contenant les mots suivants : cucurbitacée, lapsus, épistolaire.",
	"Envoie sur random une phrase contenant les mots suivants : parphélie, zinzinuler, impécunieux.",
	"Envoie sur random une phrase contenant les mots suivants : concupiscence, nullipare, nyctémère.",
	"Envoie sur random une phrase contenant les mots suivants : codicille, anachorète, adamantin.",
	"Dessine ton autoportrait les yeux bandés, poste le résultat sur #random",
	"Dessine ton voisin de droite, sans les mains, poste le résultat sur #random avec le login de la personne concernée",
	"Pendant les deux prochaines heures, tu commenceras tes phrases par \"Meow\".",
	"Parle une autre langue jusqu'à la prochaine roulette tout en faisant semblant de ne pas comprendre ce que disent les autres",
	"Cherche Charlie dans l'école.",
	"À ta prochaine correction, comme Maître Yoda tu parleras.",
	"Compte le nombre de post-it présents sur les fenêtres de l'école et viens nous donner le résultat au bocal.",
	"Préviens les fumeurs devant le hall d'entrée que c'est mauvais pour leur santé.",
	"Fais un dessin des membres du bocal dans des postures glorieuses. Tu partageras ta création sur le #random.",
	"Imagine un calamar qui fait du roller. Et dessine le. Tu pourras partager ta création sur le #random de Slack.",
	"Imagine un blobfish avec un corps bodybuildé tentant de séduire une octagenaire à l'aide d'un cornet de frites. Et dessine le. Tu pourras partager ta création sur le #random de Slack.",
	"Ecris un poème au bocal en alexandrin avec césure à l'hémistiche, de 8 vers, avec au moins une alitération et qui aura pour titre \"Bocal, mon Amour \". Il évoquera, bien évidemment, le champ lexical de la mer. Tu viendras nous le donner en personnne ou le glisser sous la porte si elle est fermée."
];

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

// WIP

router.get('/ariane', async (req, res) => {
	if (req.session.auth) {
		secret = await Secret.findById("5d3321887c213e5998eee82d");
		if (secret.finish == 0) {
			res.render(__dirname + '/../views/secret');
			console.log(req.session.login, " found the secret path");
			return
		} else {
			res.render(__dirname + '/../views/toolate', {
				text: "Too late, " + secret.winner + " a trouvé la réponse ¯\\_(ツ)_/¯ : Gargantua"
			});
		}
	} else {
		console.log("User not logged in");
		res.redirect('/');
	}
});

router.post('/ariane', async (req, res) => {
	if (req.session.auth) {
		console.log(req.session.login, " tried : ", req.body.omaewa);
		let user = await User.findOne({
			login: req.session.login
		});
		secret = await Secret.findById("5d3321887c213e5998eee82d");
		console.log(secret.finish);
		if (secret.finish == 1) {
			res.render(__dirname + '/../views/toolate', {
				text: "Too late, " + secret.winner + " a trouvé la réponse ¯\\_(ツ)_/¯"
			});
		} else if (["blackhole", "Blackhole", "trou noir"].includes(req.body.whoami)) {
			res.render(__dirname + '/../views/secret', {
				error: "Non, sinon la question aurait été : quel avenir t'attend à 42"
			})
		} else if (["adele", "nihilo", "vico", "clarisse", "cyril", "lazare", "sandrine"].includes(req.body.whoami)) {
			res.render(__dirname + '/../views/secret', {
				error: "J'espère que tu as un plan B pour après la piscine"
			})
		} else if ((req.body.whoami == "gargantua" || req.body.whoami == "Gargantua") && secret.finish == 0) {
			res.render(__dirname + '/../views/win', {
				nb: "ENORMEMENT de"
			});
			console.log(user.login, " found the answer and won the prize. What a madlad.")
			secret.finish = 1;
			secret.winner = user.login;
			secret.save(error => {
				console.log(error);
			})
			// if (req.session.login != "nihilo") {
			// 	pointsManager(user.user_id, 3000, "You found the secret answer. Congratulations.", 1);
			// }
		} else {
			var errors = ["Allez un petit effort...", "T'es sûr(e) que tu sais lire ?", "How can you talk without a brain?", "Si on envoyait les cons sur orbite t'aurais pas fini de tourner...", "Ce que tu dis n'a aucun sens...", "Nope.", "Demande à ta mère", "Mhhhhhhhh c po ca", "Hein ??!", "Ché po trop mais à mon avis c'est pas ça", "Demande à Google au lieu de me faire perdre mon temps", "Bravo ! Nan je dec, c'est pas ça."];
			var message = errors[Math.floor(Math.random() * errors.length)];
			res.render(__dirname + '/../views/secret', {
				error: message
			})
		}
	} else {
		res.redirect('/');
	}
})

// FIN WIP

router.get('/pwn', async (req, res) => {
	if (req.session.auth) {
		let user = await User.findOne({
			login: req.session.login
		});

		// Compare last_entry to now, preventing user to spam actually set to 6h !
		var last_entry = user.activity[user.activity.length - 1];
		if (last_entry) {
			last_try = Date.now() - last_entry.date.getTime();
			if (last_try < 3600000 * 2) {
				res.render(__dirname + '/../views/wait', {
					countDownDate: last_entry.date.getTime()
				});
				return (0);
			}
		}
		var rand = Math.floor(Math.random() * 100);
		if (rand <= 10) {
			var rand2 = Math.floor(Math.random() * 100);
			// TIG RNG
			if (rand2 <= 3) {
				hours = 2;

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
				res.render(__dirname + '/../views/tig', {
					nb: hours
				});
				// Users who can not get tiged
				if (hours > 0 && ['naplouvi', 'fleonard', 'ftourret', 'nihilo', 'rcodazzi', 'conrodri', 'vicaster'].includes(req.session.login) == false)
					tigManager(user.user_id, hours);
			} else {
				// Gages RNG
				gage = gages[Math.floor(Math.random() * gages.length)];
				user.activity.push({
					kind: "Gage",
					amount: 1,
					mission: gage
				});
				user.total_gages += 1;
				user.save(error => {
					console.log(error);
				});
				res.render(__dirname + '/../views/gage', {
					gage: gage
				});
				console.log(user.login, " is assigned a gage : ", gage);
			}
		} else {
			// You won some coallition points
			var points = Math.floor(Math.random() * 100);
			if (points == 0)
				points++;
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
			pointsManager(user.user_id, points, "You played, you won.");
		}
	} else {
		res.redirect('/');
	}
})

module.exports = router;