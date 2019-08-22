const express = require('express');
const session = require('express-session');
const port = process.env.PORT || 3000;
const app = express();
const cors = require('cors');
const routes = require('./routes');
const mongoose = require("mongoose");
const tokenManager = require('./middlewares/tokenManager');
require('dotenv').config();
app.set('view engine', 'ejs');
app.use(cors());
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
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true
	})
);
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
app.set('view engine', 'ejs');
app.use(tokenManager);


app.use('/', routes);
console.log(process.ENV);

// app.listen(port, function () {
// 	console.log('Listening on port ' + port);
// 	console.log("Go to http://localhost:3000/");
// });

app.listen(80, function () {
	console.log('Listening on port ' + 80);
	console.log("Go to http://127.0.0.1/");
});
