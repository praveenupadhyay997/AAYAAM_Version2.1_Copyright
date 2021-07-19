const express = require('express');
const router = express.Router();
const multer = require('multer');
var upload = multer({ dest: 'public/uploads/profile' });
const Student = require('../models/Student');
const Batch = require('../models/Batch');
const Upload = require('../models/Upload');
const Result = require('../models/Result');

//Get Stuent by ID
router.get('/:id', (req, res) => {
	var rollno = req.params.id;
	Student.getStudentByRollNo(rollno, (err, student) => {
		if (err) {
			throw err;
		} else {
			Student.find({ rollNo: rollno })
				.populate('batch')
				.exec(function (error, student) {
					if (error) throw error;
					if (student) {
						res.json({
							success: true,
							msg: 'Student found',
							student: student,
						});
					} else {
						res.json({ success: false, msg: 'Failed To find student' });
					}
				});
		}
	});
});

//Get Exam by batch
router.get('/exam/:batch', (req, res) => {
	var batch = req.params.batch;
	
	Upload.find({ batch: batch })
		.then(function (allUploads) {
			if (allUploads) {
				res.json({
					success: true,
					msg: 'Uplaods Fetched',
					uploads: allUploads,
				});
			} else {
				
				res.json({
					success: false,
					msg: 'Exams for this class and batch did not exist',
					uploads: allUploads,
				});
			}
		})
		.catch(function (err) {
			if (err) {
				res.json({ success: false, msg: err });
			}
		});
});

//Get Result of student
router.get('/exam/:id/:rollno', (req, res) => {
	var id = req.params.id;
	var rollNo = req.params.rollno;
	Result.findOne({ upload_details: id, rollno: rollNo }, (err, result) => {
		if (err) {
			res.json({ success: false, msg: 'Something Went wrong' });
		}
		if (result) {
			res.json({
				success: true,
				msg: 'result found',
				isPresent: 'Present',
				result: result,
			});
		} else {
			res.json({
				success: false,
				msg: 'result not found',
				isPresent: 'Absent',
				result: 'None',
			});
		}
	});
});

//Get batch by class
router.get('/batch/:cls', (req, res) => {
	var cls = req.params.cls;
	var batch = [];
	batch.PushAndRejectDuplicate = function (el) {
		if (this.indexOf(el) == -1) this.push(el);
		else return;
	};
	Batch.find({ class: cls }, (err, batches) => {
		if (err) {
			res.json({ success: false, msg: 'Something Went wrong' });
		}
		if (batches) {
			batches.forEach((b) => {
				batch.PushAndRejectDuplicate(b.batch);
			});
			res.json({ success: true, msg: 'Distinct batch fetched', batch: batch });
		} else {
			res.json({ success: false, msg: 'Class Not found' });
		}
	});
});

//Get Average score for each subject by batch & class
router.get('/average/:batch', (req, res) => {
	var batch = req.params.batch;
	var avg = {
		avgPhy: 0,
		avgChem: 0,
		avgBot: 0,
		avgZoo: 0,
	};

	Result.find({})
		.populate({
			path: 'upload_details',

			populate: { path: 'batch' },
		})
		.exec(function (err, results) {
			if (err) return handleError(err);
			if (results) {
				var phy = 0;
				var chem = 0;
				var bot = 0;
				var zoo = 0;
				var i = 0;
				results.forEach((result) => {
					
					if (result.upload_details.batch.batch == batch) {
						i++;
						phy += result.physics;
						chem += result.chemistry;
						bot += result.botany;
						zoo += result.zoology;

						avg.avgPhy = phy / i;
						avg.avgChem = chem / i;
						avg.avgBot = bot / i;
						avg.avgZoo = zoo / i;
					}
				});
				res.json({ success: true, msg: 'average calculated', avg: avg });
			} else {
				res.json({ success: true, msg: 'Something went wrong' });
			}
		});
});

//Update Student
router.post('/update', upload.single('file'), (req, res) => {
	var fileName = null;
	var originalName = null;
	if (typeof req.file !== 'undefined') {
		fileName = req.file != null ? 'uploads/profile/' + req.file.filename : null;
		originalName =
			req.file != null ? 'uploads/profile/' + req.file.originalname : null;
	}
	Student.findOneAndUpdate(
		{ rollNo: req.body.rollno },
		{
			referenceId: req.body.referenceid,
			rollNo: req.body.rollno,
			fullName: req.body.name,
			fatherName: req.body.fname,
			motherName: req.body.mname,
			email: req.body.email,
			fathersOccupation: req.body.focc,
			mothersOccupation: req.body.mocc,
			studentContact: req.body.contact,
			fatherContact: req.body.fmno,
			motherContact: req.body.mmno,
			localGuardNo: req.body.lgmno,
			dob: req.body.dob, // student DOB
			aadhaarNo: req.body.aadhaarno, //student's adhaar
			category: req.body.category, // student's category
			pwd: req.body.pwd, //Students PWD
			state: req.body.state, // Students state
			district: req.body.district, // Students district
			address: req.body.address, //Students address
			localAddress: req.body.localaddress, //Student Local Address
			localGuardAdd: req.body.lgaddress, //Local Guardian Address
			referenceMedium: req.body.reference_from, // Student Referenced From
			class: req.body.class, // Students Class
			medium: req.body.medium, // Students Medium
			counsellorName: req.body.cname, // counseller name
			counsellorCabin: req.body.cabin, //counseller name
			passYearX: req.body.poyoX, //pass year 10
			passYearXI: req.body.poyoXI, //pass year 11
			passYearXII: req.body.poyoXII, //pass year 12
			pastNeetMarks: req.body.pastneetmarks, //past Neet Marks
			gradeInX: req.body.gradeX, //grades in 10 class
			gradeInXI: req.body.gradeXI, //grades in 10 class
			gradeInXII: req.body.gradeXII, //grades in 10 class
			pastNeetAir: req.body.pastneetair, //past neet AIR
			schoolNameX: req.body.schoolnameX, //School Name 10
			schoolNameXI: req.body.schoolnameXI, //School Name 11
			schoolNameXII: req.body.schoolnameXII, ///School Name 12
			noOfAttemptsNeet: req.body.pastneetattemptsno, ///No of attempts in neet
			schoolAddressX: req.body.schooladdX, //School Address of 10
			schoolAddressXI: req.body.schooladdXI, //School Address of 11
			schoolAddressXII: req.body.schooladdXII, //School Address of 12
			pastNeetRemarks: req.body.pastneetremarks, //Remarks from PAST NEET
			acadYear: req.body.acadyear, //Academic Year
			batch: req.body.batch, //Batch
			bag: req.body.bag, //Bag
			moduleCard: req.body.modulecard, //Module Card
			profilePic: fileName,
			profileOriginalName: originalName,
		},
		(err, student) => {
			if (err) throw err;
			if (student) {
				res.json({ success: true, msg: 'Student data Updated Successfully' });
			} else {
				res.json({ success: false, msg: 'Student not Found' });
			}
		},
	);
});

module.exports = router;
