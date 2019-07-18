const express = require('express');
const session = require('express-session');
const port = process.env.PORT || 3000;
const app = express();
const cors = require('cors');
const routes = require('./routes');
const mongoose = require("mongoose");
const schedule = require('node-schedule');
const sendRecap = require('./middlewares/sendRecap');

// require('dotenv').config();
app.set('view engine', 'ejs');
app.use(cors());

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true
	})
);

app.set('view engine', 'ejs');
app.use(
	session({
		secret: "powned",
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false
		}
	})
);

mongoose.connect(
	process.env.MONGODB_URI, {
		useNewUrlParser: true
	},
	(err, res) => {
		if (err)
			console.log(err);
		else
			console.log("Connected to db!");
	}
);

app.use('/', routes);

let j = schedule.scheduleJob('* 12 * * *', sendRecap());


app.listen(port, function () {
	console.log('Listening on port ' + port);
});