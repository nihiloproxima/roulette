const express = require('express');
const apiRouter = express.Router();
const User = require("../schemas/User");
const axios = require('axios');
const staff = {
	client: 'eb0fde434d57c8ae13adad3ed5b813ad57b9d3900a79f578eaf2845be8925627',
	secret: 'd7886d2b7f3c011b045bae0e7031ff647957b03c25210c5ed57ef7a76498e349'
};

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

apiRouter.get('/gaged', (req, res) => {
	User.find({
		total_gages: {
			$gt: 0
		}
	}, null, {
		sort: {
			total_gages: -1
		}
	}, (err, docs) => {
		res.json(docs);
	})
});

apiRouter.get('/me', async (req, res) => {
	console.log("sending user...");
	let user = await User.findOne({
		login: req.session.login
	});
	console.log(user);
	res.json(user);
})

apiRouter.get('/user/:login', (req, res) => {
	User.findOne({
		login: req.params.login
	}, (err, docs) => {
		res.json(docs);
	});
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

module.exports = apiRouter;