const express = require('express');
const router = express.Router();
const passport = require('passport');

const Student = require('../models/Student');
const DemoStudent = require('../models/Reception');
const Account = require('../models/Account');

// @desc Dashboard
// @route GET /dashboard
router.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		res.json({ user: req.user });
	},
);

//@route GET /dashboard/allStudents
router.get('/allStudents', (req, res) => {
	Student.find({ isDeleted: false })
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
// @desc Delete corrosponding Addmitted Student from Dashboard table
//  @route POST / delete
router.delete('/deleteStudent/:id', (req, res) => {
	var id = req.params.id;
	Student.findOneAndDelete({ _id: id }, (err, student) => {
		if (err) throw err;
		if (!student) {
			res.json({ success: false, msg: 'Student Not Found' });
		} else {
			Account.findOneAndDelete({ student: id })
				.then(() => {
					res.json({ success: true, msg: 'Student Deleted Successfully!' });
				})
				.catch((err) => {
					res.json({ success: false, msg: 'Something Went wrong!' });
				});
			//res.json({ success: true, msg: 'Upload Deleted Successfully!' });
		}
	});
});
//@route GET /dashboard/demoStudents
router.get('/demoStudents', (req, res) => {
	DemoStudent.find({ isDeleted: false }, (error, demo) => {
		if (error) throw error;
		else if (demo) {
			res.json({
				success: true,
				msg: 'All Students Fetched',
				demoStudent: demo,
			});
		} else {
			res.json({ success: false, msg: 'Students Not Found' });
		}
	});
});
// @desc Delete corrosponding Demo Student from Dashboard Demo Student table
//  @route POST / delete
router.delete('/deleteDemoStudent/:id', (req, res) => {
	var id = req.params.id;
	DemoStudent.findOneAndDelete({ _id: id }, (err, student) => {
		if (err) throw err;
		if (!student) {
			res.json({ success: false, msg: 'Student Not Found' });
		} else {
			res.json({ success: true, msg: 'Demo Student Deleted Successfully!' });
		}
	});
});
//Update Demo Student
router.post('/updateDemoStudent', (req, res) => {
	DemoStudent.findOneAndUpdate(
		{ _id: req.body.demoStudentId },
		{
			fullName: req.body.name,
			fatherName: req.body.fname,
			category: req.body.category,
			studentContact: req.body.contact,
			category: req.body.category,
			class: req.body.class,
			medium: req.body.medium,
			state: req.body.state,
			district: req.body.district,
			referenceMedium: req.body.reference_from,
			counsellorName: req.body.cname,
			counsellorCabin: req.body.cabin,
		},
		(err, student) => {
			if (err) throw err;
			if (student) {
				res.json({ success: true, msg: 'Demo Student Updated Successfully' });
			} else {
				res.json({ success: false, msg: 'Student not found' });
			}
		},
	);
});

// Deactivate Admitted Student
router.post('/deactivate/:id', (req, res) => {
	var id = req.params.id;
	req.body.isDeleted = true;
	Student.findByIdAndUpdate(
		{ _id: id },
		{ isDeleted: req.body.isDeleted },
		(err, student) => {
			if (err) throw err;
			if (student) {
				res.json({
					success: true,
					msg: 'Student Deleted Along with the Account. If you think this was a mistake, Please go to the Restore Point and Restore. ',
				});
			} else {
				res.json({ success: false, msg: 'Student Not Found' });
			}
		},
	);
});

// Deactivate Demo Student
router.post('/deactivateDemoStudent/:id', (req, res) => {
	var id = req.params.id;
	req.body.isDeleted = true;
	DemoStudent.findByIdAndUpdate(
		{ _id: id },
		{ isDeleted: req.body.isDeleted },
		(err, demostudent) => {
			if (err) throw err;
			if (demostudent) {
				res.json({
					success: true,
					msg: 'Demo Student Deleted. If you think this was a mistake, Please go to the Restore Point and Restore. ',
				});
			} else {
				res.json({ success: false, msg: 'Demo Student Not Found' });
			}
		},
	);
});

module.exports = router;
