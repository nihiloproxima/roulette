const express = require('express');
const session = require('express-session');
const port = process.env.PORT || 3000;
const app = express();
const cors = require('cors');
const routes = require('./routes');

require('dotenv').config();
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

app.use('/', routes);

app.listen(port, function () {
	console.log('Listening on port ' + port);
});