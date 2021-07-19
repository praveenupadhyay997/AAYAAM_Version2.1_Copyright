var nodemailer = require('nodemailer');
const keys = require('./keys');

//Create reusable transporter object using the default SMTP server
var transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: keys.user,
		pass: keys.pass,
	},
	tls: {
		rejectUnauthorized: false,
	},
});
module.exports = {
	sendEmail(from, to, subject, html, attachments) {
		transporter.sendMail(
			{ from, to, subject, html, attachments },
			(error, info) => {
				if (error) {
					return console.log(error);
				}
			},
		);
	},
};
