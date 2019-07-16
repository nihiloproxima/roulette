const express = require('express');
const adminRouter = express.Router();
const axios = require('axios');
const User = require("./schemas/User");

adminRouter.get('/', async (req, res) => {
	if (req.session.login == "nihilo") {
		res.sendFile(__dirname + '/views/admin');
	} else {
		res.send("mdr noob");
	}
})

module.exports = adminRouter;