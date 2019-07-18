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

	let testAccount = await nodemailer.createTestAccount();

	let transporter = nodemailer.createTransport({
		host: "smtp.ethereal.email",
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: testAccount.user, // generated ethereal user
			pass: testAccount.pass // generated ethereal password
		}
	});

	let info = await transporter.sendMail({
		from: '"Get-pwnd 👻" <get-pwnd@herokuapp.com>', // sender address
		to: "nihilo@le-101.fr", // list of receivers
		subject: "Pwnd recap ✔", // Subject line
		html: body
	});

	console.log("Message sent: %s", info.messageId);
	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = sendRecap;