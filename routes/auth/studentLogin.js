const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config/keys');
const Student = require('../../models/Student');
const sms = require('../../config/sms');

// @desc Student Login
//  @route POST / studentLogin
router.post('/', (req, res) => {
	Student.getStudentByRollNo(req.body.rollNo, (err, student) => {
		if (err) throw err;
		if (!student) {
			return res.json({ success: false, msg: 'Invalid Roll No.' });
		} else {
			Student.comparePassword(
				req.body.password,
				student.password,
				(err, isMatch) => {
					if (err) throw err;
					if (isMatch) {
						const token = jwt.sign(student.toJSON(), config.secret, {
							expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
						});
						res.json({
							success: true,
							token: 'JWT ' + token,
							student: {
								name: student.fullName,
								role: student.role,
								email: student.email,
								referenceId: student.referenceId,
								rollno: student.rollNo,
								_id: student._id,
								profile: student.profilePic,
							},
						});
					} else {
						return res.json({ success: false, msg: 'Wrong Password' });
					}
				},
			);
		}
	});
});

module.exports = router;
