const express = require('express');
const adminRouter = express.Router();
const User = require("../schemas/User");

adminRouter.get('/', async (req, res) => {
	console.log(req.session.login, " connected on admin");
	if (req.session.login == "nihilo" || req.session.login == "ftourret") {
		res.render(__dirname + '/../views/admin');
	} else {
		res.send("mdr noob");
	}
})

module.exports = adminRouter;