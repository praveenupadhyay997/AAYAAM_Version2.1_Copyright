const express = require('express');
const router = express.Router();
const passport = require('passport');

const Student = require('../models/Student');
const DemoStudent = require('../models/Reception');
const Account = require('../models/Account');
const Upload = require('../models/Upload');
const Batch = require('../models/Batch');

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

//@route GET /restore/allDemoStudents
router.get('/allDemoStudents', (req, res) => {
	DemoStudent.find({ isDeleted: true })
		.exec(function (error, demostudents) {
			if (error) throw error;
			else if (demostudents) {
				res.json({
					success: true,
					msg: 'All Demo Students Fetched',
					demostudents: demostudents,
				});
			} else {
				res.json({ success: false, msg: 'Demo Students Not Found' });
			}
		});
});

// @desc Display upload table
//  @route POST / allExamData
router.get('/allExamData', (req, res) => {
	Upload.find({ isDeleted: true })
		.populate('batch')
		.exec(function (error, uploads) {
			if (error) throw error;
			else if (uploads) {
				res.json({
					success: true,
					msg: 'All Uploads Fetched',
					uploads: uploads,
				});
			} else {
				res.json({
					success: false,
					msg: 'Something went wrong pls contact admin',
				});
			}
		});
});

//Fetch All Batch at Restore Point (Newer Test version)
router.get('/allRestorePointBatches', (req, res) => {
	Batch.find({ isDeleted: true })
	.exec(function(err, batches) {
		if (err) throw err;
		if (!batches) {
			res.json({ success: false, msg: 'No Batch Found.' });
		} else {
			res.json({ success: true, msg: 'All Batch Fetched', batches: batches });
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

// Restore Demo Student
router.post('/restoreDemoStudent/:id', (req, res) => {
	var id = req.params.id;
	req.body.isDeleted = false;
	DemoStudent.findByIdAndUpdate(
		{ _id: id },
		{ isDeleted: req.body.isDeleted },
		(err, demostudent) => {
			if (err) throw err;
			if (demostudent) {
				res.json({
					success: true,
					msg: 'Demo Student Restored Successfully.',
				});
			} else {
				res.json({ success: false, msg: 'Student Not Found' });
			}
		},
	);
});

// Restore Exam Data Student
router.post('/restoreExamData/:id', (req, res) => {
	var id = req.params.id;
	req.body.isDeleted = false;
	Upload.findByIdAndUpdate(
		{ _id: id },
		{ isDeleted: req.body.isDeleted },
		(err, demostudent) => {
			if (err) throw err;
			if (demostudent) {
				res.json({
					success: true,
					msg: 'Exam Data Restored Successfully.',
				});
			} else {
				res.json({ success: false, msg: 'Exam Data Not Found' });
			}
		},
	);
});

module.exports = router;
