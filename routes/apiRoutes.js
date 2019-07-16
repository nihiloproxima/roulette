const express = require('express');
const apiRouter = express.Router();
const User = require("../schemas/User");
const axios = require('axios');

apiRouter.get('/', async (req, res) => {
	User.find({}, (err, docs) => {
		if (docs)
			res.json(docs);
	})
});

apiRouter.get('/tiged', (req, res) => {
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

apiRouter.get('/winners', async (req, res) => {
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
});

apiRouter.get('/user/:id', async (req, res) => {
	// if (req.session.login != "nihilo") {
	// 	res.send('mdr noob');
	// 	return;
	// }

	// if (!req.session.access_token) {
	axios
		.post("https://api.intra.42.fr/oauth/token", {
			grant_type: "client_credentials",
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET
		}).then(response => {
			const access_token = response.data.access_token;
			console.log("Access granted, code : ", req.session.access_token);
			console.log("Creating new close...");
			axios.post('https://api.intra.42.fr/v2/users/' + req.params.id + '/closes', {
				"close": {
					"closer_id": 58278,
					"kind": "other",
					"reason": "You played, you lost.",
					"state": "close",
					"user_id": req.params.id
				}
			}, {
				headers: {
					"Authorization": "Bearer " + access_token
				}
			}).then(results => {
				console.log("Close created : ", results.data);
				console.log("Assign community service...");
				axios.post('https://api.intra.42.fr/v2/community_services', {
						"community_service": {
							"close_id": results.data.id,
							"duration": 7200,
							"occupation": "Regarder Shrek, en entier, avec Mathieu Trentin",
							"tiger_id": 58278
						},
					}, {
						headers: {
							"Authorization": "Bearer " + access_token
						}
					}).then(response => {
						console.log("Successfully Tiged :", response.data);
						res.json(response.data)
					})
					.catch(error => {
						console.log(error);
						res.json({
							message: error
						});
					})
			}).catch(error => {
				console.log("Can't close :", error);
				res.json({
					message: error
				});
			})
		})
		.catch(error => {
			res.json(error);
		})
	// }
});

module.exports = apiRouter;