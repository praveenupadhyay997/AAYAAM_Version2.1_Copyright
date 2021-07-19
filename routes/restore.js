const express = require('express');
const router = express.Router();
const passport = require('passport');

const Student = require('../models/Student');
const DemoStudent = require('../models/Reception');
const Account = require('../models/Account');

//@route GET /restore/allStudents
router.get('/allStudents', (req, res) => {
	Student.find({ isDeleted: true })
		.populate('batch')
		.exec(function (error, students) {
			if (error) throw error;
			else if (students) {
				res.json({
					success: true,
					msg: 'All Students Fetched',
					students: students,
				});
			} else {
				res.json({ success: false, msg: 'Students Not Found' });
			}
		});
});

// Restore Admitted Student
router.post('/restoreStudent/:id', (req, res) => {
	var id = req.params.id;
	req.body.isDeleted = false;
	Student.findByIdAndUpdate(
		{ _id: id },
		{ isDeleted: req.body.isDeleted },
		(err, student) => {
			if (err) throw err;
			if (student) {
				res.json({
					success: true,
					msg: 'Student Restored Successfully.',
				});
			} else {
				res.json({ success: false, msg: 'Student Not Found' });
			}
		},
	);
});

module.exports = router;
