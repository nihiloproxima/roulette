const nodemailer = require("nodemailer");
const User = require("../schemas/User");

const sendRecap = async () => {
	users = await User.find({});
	let body = "";
	for (i in users) {
		body += "<p>" + users[i].login + " played " + users[i].activity.length + " times.</p>\
		<ul>\
			<li>Total points : " + users[i].total_points + " </li>\
			<li>Total TIG : " + users[i].total_tig + " </li>\
			<li> Total TIG: " + users[i].total_tig + " </li>\
			<li> Total Gages: " + users[i].total_gages + " </li>\
		</ul>";
	}

	const transporter = nodemailer.createTransport({
		port: 25,
		host: 'localhost',
		tls: {
			rejectUnauthorized: false
		},
	});

	let mailOptions = {
		from: "jobs@get-pwnd.herokuapp.com",
		to: 'nihilo@le-101.fr',
		subject: "Recap get-pwn",
		html: body
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log("error sending email... ", error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
}

module.exports = sendRecap;