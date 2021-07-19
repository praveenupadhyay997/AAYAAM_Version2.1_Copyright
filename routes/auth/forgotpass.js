const express = require('express');
var mailer = require('../../config/mailer');
var RandExp = require('randexp');
var bcrypt = require('bcryptjs');
const Student = require('../../models/Student');
const Staff = require('../../models/Staff');
const router = express.Router();

// @desc Forgot Password Page
// @route GET/ forgotPassword
router.post('/', (req, res) => {
	role = req.body.role;
	if (role == 'student') {
		Student.findOne({ rollNo: req.body.rollNo }, (err, student) => {
			if (err) {
				res.json({
					success: false,
					msg: 'Something went wrong Please try again',
				});
			} else if (!student) {
				res.json({
					success: false,
					msg: 'Student with this roll no not found',
				});
			} else {
				//System generated password
				var randexp = new RandExp(/[A-Z]{1}[a-z]{3}@[0-9]{4}/).gen();
				// Setting This password as new student password
				student.password = randexp;
				// Hashing this password and updating it
				bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(student.password, salt, (err, hash) => {
						if (err) throw err;
						student.password = hash;
						// Saving Student or updating password
						student
							.save()
							.then((student) => {
								var output = `Hi there,<br/>
							Welcome again <br>${student.fullName} </br>,
							Here is your new password :-<br/>
							<h3> <b>New Password: ${randexp}</b> </h3><br/>
							Now you can update you password by logining using this password
							Enjoy!!...Have a pleasent day`;
								//send the mail
								mailer.sendEmail(
									'"Aayaam Academy" <ascw.upes@gmail.com>',
									student.email,
									'Forgot Password Change Verification',
									output,
								);
								res.json({
									success: true,
									msg: 'Please check your mail for new password',
								});
							})
							.catch((err) => {
								return handleError(err);
							});
					}),
				);
			}
		});
	} else {
		Staff.getStaffByEmail(req.body.email, (err, staff) => {
			if (err) {
				res.json({
					success: false,
					msg: 'Something went wrong PLease try again',
				});
			} else if (!staff) {
				res.json({
					success: false,
					msg: 'Sorry Email Not Found',
				});
			} else {
				//System generated password
				var randexp = new RandExp(/[A-Z]{1}[a-z]{3}@[0-9]{4}/).gen();
				// Setting This password as new student password
				staff.password = randexp;
				// Hashing this password and updating it
				bcrypt.genSalt(10, (err, salt) =>
					bcrypt.hash(staff.password, salt, (err, hash) => {
						if (err) throw err;
						staff.password = hash;
						// Saving Staff or updating password
						staff
							.save()
							.then((staff) => {
								var output = `Hi there,<br/>
							Welcome again <br>${staff.fullName} </br>,
							Here is your new password :-<br/>
							<h3> <b>New Password: ${randexp}</b> </h3><br/>
							Now you can update you password by logining using this password
							Enjoy!!...Have a pleasent day`;
								//send the mail
								mailer.sendEmail(
									'"Aayaam Academy" <ascw.upes@gmail.com>',
									staff.email,
									'Forgot Password Change Verification',
									output,
								);
								res.json({
									success: true,
									msg: 'Please check your mail for new password',
								});
							})
							.catch((err) => {
								return handleError(err);
							});
					}),
				);
			}
		});
	}
});

module.exports = router;
