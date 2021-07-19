const express = require('express');
const router = express.Router();
const Staff = require('../../models/Staff');
const jwt = require('jsonwebtoken');
const config = require('../../config/keys');

// @desc Staff Login Page
// @route GET/ Staff
router.post('/login', (req, res) => {
	Staff.getStaffByEmail(req.body.email, (err, staff) => {
		if (err) throw err;
		if (!staff) {
			return res.json({ success: false, msg: 'Invalid Email' });
		} else {
			Staff.comparePassword(
				req.body.password,
				staff.password,
				(err, isMatch) => {
					if (err) throw err;
					if (isMatch) {
						const token = jwt.sign(staff.toJSON(), config.secret, {
							expiresIn: '1h',
						});
						res.json({
							success: true,
							token: 'JWT ' + token,
							staff: {
								role: staff.role,
								email: staff.email,
								name: staff.fullName,
								_id: staff._id,
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

router.post('/register', (req, res) => {
	let staff = new Staff({
		role: req.body.role,
		email: req.body.email,
		fullName: req.body.name,
		password: req.body.password,
	});

	Staff.createStaff(staff, (err, staff) => {
		if (err) {
			res.json({ success: false, msg: 'Failed To register staff' });
		} else {
			res.json({
				success: true,
				msg: 'Staff Registered',
			});
		}
	});
});

module.exports = router;
