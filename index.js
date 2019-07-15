const express = require('express');
const session = require('express-session');
const port = process.env.PORT || 3000;
const app = express();

// require('dotenv').config();

const routes = require('./routes');

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

app.use('/', routes);

app.listen(port, function () {
	console.log('Listening on port ' + port);
});