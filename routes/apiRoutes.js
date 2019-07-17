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

apiRouter.post('/test', (req, res) => {
	console.log(req.body);
	res.send(req.body);
})

module.exports = apiRouter;