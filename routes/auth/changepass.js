const express = require('express');
const router = express.Router();
var mailer = require('../../config/mailer');

const Student = require('../../models/Student');
const Staff = require('../../models/Staff');

//@route /changepass
router.post('/', (req, res) => {
	var role = req.body.role;
	var id = req.body.id;
	var form = req.body.cpform;

	if (role == 'Student') {
		Student.findById(id, (err, student) => {
			if (err) {
				res.json({ success: false, msg: 'Something went wrong.' });
			} else {
				Student.comparePassword(
					form.currentPass,
					student.password,
					(err, isMatch) => {
						if (err) throw err;
						if (isMatch) {
							student.password = form.newPass;
							Student.updatePass(student);
							res.json({
								success: true,
								msg: 'Password Changed Successfully.',
							});
						} else {
							res.json({
								success: false,
								msg: 'Current Password did not match.',
							});
						}
					},
				);
			}
		});
	} else {
		Staff.findById(id, (err, staff) => {
			if (err) {
				res.json({ success: false, msg: 'Something went wrong.' });
			} else {
				Staff.comparePassword(
					form.currentPass,
					staff.password,
					(err, isMatch) => {
						if (err) throw err;
						if (isMatch) {
							staff.password = form.newPass;
							Staff.updatePass(staff);
							res.json({
								success: true,
								msg: 'Password Changed Successfully.',
							});
						} else {
							res.json({
								success: false,
								msg: 'Current Password did not match.',
							});
						}
					},
				);
			}
		});
	}
});
module.exports = router;
