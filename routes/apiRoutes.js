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

apiRouter.post('/user/:id', async (req, res) => {
	// if (req.session.login != "nihilo") {
	// 	res.send('mdr noob');
	// 	return;
	// }

	if (!req.session.access_token) {
		apicall = await axios
			.post("https://api.intra.42.fr/oauth/token", {
				grant_type: "client_credentials",
				client_id: process.env.CLIENT_ID,
				client_secret: process.env.CLIENT_SECRET
			});
		req.session.access_token = apicall.data.access_token;

		console.log(req.session.access_token);
		// .then(response => {
		// 	axios.post('https://api.intra.42.fr/v2/users', newUser, {
		// 		headers: {
		// 			"Authorization": "Bearer " + response.data.access_token
		// 		}
		// 	}).then(results => {

		// 	}).catch(error => {
		// 		console.log(error);
		// 		res.json({
		// 			message: error
		// 		});
		// 	})
		// })
		// .catch(error => {
		// 	console.log(error);
		// 	res.json({
		// 		message: error
		// 	});
		// })
		user = await User.findOne({
			id: req.params.id
		});
	}
});

		module.exports = apiRouter;