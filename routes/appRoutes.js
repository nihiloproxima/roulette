const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require("../schemas/User");
const tigManager = require("../middlewares/tigManager.js");

const gages = [
	"Faire un Powerpoint de présentation de ta piscine avec des chiffres clés et des stats que tu récolteras en intérrogeant tes camarades. Minimum 5 diapos. Le tout sans ordinateur. Débrouille toi pour les feuilles/stylos. Tu feras un présentation du résultat au bocal. Tu as 24h.",
	"Paye un café/thé au stud de ton choix.",
	"Demain, tu apporteras des viennoiseries pour tes camarades.",
	"Chaque fois que tu croiseras un membre du bocal, tu devras le saluer en levant ton chapeau. Ou mimer le geste si tu n'as pas de chapeau.",
	"Chaque vendredi à 16h42 avant l'exam, tu passeras en cluster en criant \"Ça va être tout noir !\"",
	"Tu signeras tous tes feedbacks de correction de ton login en binaire",
	"Tu signeras tous tes feedbacks de correction par un \"Je t'aime\". Sans dire que c'est un gages.",
	"Tu signeras tous tes messages Slack par \"Méfaits accomplis\"",
	"Ajoute l'emoji :bubflesh: à coté de ton login sur Slack",
	"Pendant une heure tu feras le Groom dans l'ascenseur en demandant aux gens \"Quel étage ?\", en étant courtois et souriant.",
	"Remet de l'ordre dans les chaises en cantina.",
	"Faire un tour de cluster en demandant à tout le monde s'ils savent où est Charlie.",
	"À ta prochaine correction, comme Maître Yoda tu parleras.",
	"Tu devras payer quelque chose (au distributeur) à la prochaine personne que tu croiseras dans le hall. La personne choisira.",
	"Compte le nombre de post-it présents sur les fenêtres de l'école et viens nous donner le résultat au bocal.",
	"Tu iras voir 3 personnes random et leur proposeras de l'aide (des personnes que tu ne connais pas).",
	"Ecris un poème au bocal en alexandrin avec césure à l'hémistiche, de 8 vers, avec au moins une alitération et qui aura pour titre \"Bocal, mon Amour \". Il évoquera, bien évidemment, le champ lexical de la mer. Tu viendras nous le donner en personnne ou le glisser sous la porte si elle est fermée."
];

router.get('/', (req, res) => {
	if (req.session.auth) {
		// User is logged in
		res.render(__dirname + '/../views/index', {
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
						console.log("Requesting user");
						user_exists = await User.findOne({
							login: response.data.login
						});
						console.log("User exists :", user_exists != undefined);
						if (!user_exists) {
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
				res.render(__dirname + '/../views/wait', {
					countDownDate: last_entry.date.getTime()
				});
			} else {
				var rand = Math.floor(Math.random() * 100);
				if (rand <= 16) {
					var rand2 = Math.floor(Math.random() * 100);

					if (rand2 <= 32) {
						hours = rand2 <= 16 ? 4 : 2;

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
						if (hours > 0 && ['naplouvi', 'fleonard', 'ftourret', 'nihilo', 'rcodazzi', 'conrodri', 'vicaster', 'ledebut'].includes(req.session.login) == false)
							tigManager(user.user_id, hours);
					} else {

						res.send(gages[Math.floor(Math.random(gages.length - 1))]);
					}
				} else if (rand <= 32) {
					res.send(gages[Math.floor(Math.random(gages.length - 1))]);
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
					res.render(__dirname + '/../views/win', {
						nb: points
					});
				}
			}
		} else {
			// User can play 
			var rand = Math.floor(Math.random() * 100);
			if (rand <= 16) {
				var rand2 = Math.floor(Math.random() * 100);

				if (rand2 <= 32) {
					hours = rand2 <= 16 ? 4 : 2;

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
					if (hours > 0 && ['naplouvi', 'fleonard', 'ftourret', 'nihilo', 'rcodazzi', 'conrodri', 'vicaster', 'ledebut'].includes(req.session.login) == false)
						tigManager(user.user_id, hours);
				} else {

					res.send(gages[Math.floor(Math.random(gages.length - 1))]);
				}
			} else if (rand <= 32) {
				res.send(gages[Math.floor(Math.random(gages.length - 1))]);
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
				res.render(__dirname + '/../views/win', {
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