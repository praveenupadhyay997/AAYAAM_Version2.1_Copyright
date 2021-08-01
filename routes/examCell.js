const express = require('express');
const router = express.Router();
const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const sms = require('../config/sms');
var upload = multer({ dest: 'public/uploads/results' });

const Upload = require('../models/Upload');
const Result = require('../models/Result');

// @desc Demo Student Registeration
//  @route POST / examCell
router.post('/', upload.single('file'), (req, res) => {
	filePath = 'public/uploads/results/' + req.file.filename;
	const excelData = excelToJson({
		sourceFile: filePath,
		header: {
			rows: 1,
		},
		columnToKey: {
			A: 'rollno',
			B: 'test_code',
			C: 'answers',
			D: 'answersEdited',
			E: 'answerConfidence',
			F: 'sheetConfidence',
			G: 'rectangleCount1',
			H: 'resolutionIssue',
			I: 'rectangleFault',
			J: 'flippedImage',
			K: 'side1BW ',
			L: 'medium',
			M: 'score',
			N: 'right',
			O: 'wrong',
			P: 'blank',
			Q: 'rank',
			R: 'physics',
			S: 'physicsCorrect',
			T: 'physicsIncorrect',
			U: 'physicsBlank',
			V: 'physicsPer',
			W: 'chemistry',
			X: 'chemistryCorrect',
			Y: 'chemistryIncorrect',
			Z: 'chemistryBlank',
			AA: 'chemistryPer',
			AB: 'botany',
			AC: 'botanyCorrect',
			AD: 'botanyIncorrect',
			AE: 'botanyBlank',
			AF: 'botanyPer',
			AG: 'zoology',
			AH: 'zoologyCorrect',
			AI: 'zoologyIncorrect',
			AJ: 'zoologyBlank',
			AK: 'zoologyPer',
		},
	});

	req.body.isDeleted = false;
	let upload = new Upload({
		examName: req.body.exam_name,
		batch: req.body.batch,
		examDate: req.body.exam_date,
		examFile: req.file.filename,
		originalName: req.file.originalname,
		isDeleted: req.body.isDeleted,
	});
	upload
		.save()
		.then((upload) => {
			excelData.Result.forEach((element) => {
				saveInResult(upload, element);
			});

			res.json({
				success: true,
				msg: 'File Uploaded Successfully',
			});
		})
		.catch((err) => {
			res.json({ success: false, msg: err });
		});
});

saveInResult = function (upload, element) {
	let result = new Result({
		upload_details: upload._id,
		rollno: element.rollno,
		test_code: element.test_code,
		answers: element.answers,
		answersEdited: element.answersEdited,
		answerConfidence: element.answerConfidence,
		sheetConfidence: element.sheetConfidence,
		rectangleCount1: element.rectangleCount1,
		resolutionIssue: element.resolutionIssue,
		rectangleFault: element.rectangleFault,
		flippedImage: element.flippedImage,
		side1BW: element.side1BW,
		medium: element.medium,
		score: element.score,
		right: element.right,
		wrong: element.wrong,
		blank: element.blank,
		rank: element.rank,
		physics: element.physics,
		physicsCorrect: element.physicsCorrect,
		physicsIncorrect: element.physicsIncorrect,
		physicsBlank: element.physicsBlank,
		physicsPer: element.physicsPer,
		chemistry: element.chemistry,
		chemistryCorrect: element.chemistryCorrect,
		chemistryIncorrect: element.chemistryIncorrect,
		chemistryPer: element.chemistryPer,
		chemistryBlank: element.chemistryBlank,
		botany: element.botany,
		botanyCorrect: element.botanyCorrect,
		botanyIncorrect: element.botanyIncorrect,
		botanyBlank: element.botanyBlank,
		botanyPer: element.botanyPer,
		zoology: element.zoology,
		zoologyCorrect: element.zoologyCorrect,
		zoologyIncorrect: element.zoologyIncorrect,
		zoologyBlank: element.zoologyBlank,
		zoologyPer: element.zoologyPer,
	});

	result.save();
};

// @desc Display upload table
//  @route POST / msgsection
router.get('/msgsection', (req, res) => {
	Upload.find({ isDeleted: false })
		.populate('batch')
		.exec(function (error, uploads) {
			if (error) throw error;
			else if (uploads) {
				res.json({
					success: true,
					msg: 'All Uplaods Fetched',
					uploads: uploads,
				});
			} else {
				res.json({
					success: false,
					msg: 'Something went wrong pls contaact admin',
				});
			}
		});
});

// @desc Delete corrosponding upload from upload table
//  @route POST / delete
router.delete('/delete/:id', (req, res) => {
	var id = req.params.id;
	Upload.findOneAndDelete({ _id: id }, (err, upload) => {
		if (err) throw err;
		if (!upload) {
			res.json({ success: false, msg: 'Record not found' });
		} else {
			Result.deleteMany({ upload_details: id })
				.then(() => {
					res.json({ success: true, msg: 'Record Deleted Successfully!' });
				})
				.catch((err) => {
					res.json({ success: false, msg: 'Something Went wrong!' });
				});
			//res.json({ success: true, msg: 'Upload Deleted Successfully!' });
		}
	});
});

// Deactivate Message Section Data of ExamCell
router.post('/deactivateExamData/:id', (req, res) => {
	var id = req.params.id;
	req.body.isDeleted = true;
	Upload.findByIdAndUpdate(
		{ _id: id },
		{ isDeleted: req.body.isDeleted },
		(err, upload) => {
			if (err) throw err;
			if (upload) {
				res.json({
					success: true,
					msg: 'Exam Data Deleted for the particular Exam. If you think this was a mistake, Please go to the Restore Point and Restore. ',
				});
			} else {
				res.json({ success: false, msg: 'Exam Data Not Found' });
			}
		},
	);
});

//Update Exam Upload
router.post('/update', (req, res) => {
	Upload.findOneAndUpdate(
		{ _id: req.body.update_id },
		{
			examName: req.body.update_exam_name,
			batch: req.body.update_batch,
			examDate: req.body.update_exam_date,
		},
		(err, upload) => {
			if (err) throw err;
			if (upload) {
				res.json({ success: true, msg: 'Exam Updated Successfully' });
			} else {
				res.json({ success: false, msg: 'Upload not Found' });
			}
		},
	);
});

//Send SMS
router.post('/sms', (req, res) => {
	var students = req.body.students;
	students.forEach((student) => {
		Result.findOne(
			{ rollno: student.rollNo, upload_details: req.body.upload._id },
			(err, result) => {
				if (err) throw err;
				if (result) {
					var data = JSON.stringify({
						from: 'aayaam',
						to: '91' + `${student.studentContact}`,
						text: `Results:- Physics: ${result.physics} Chemistry: ${result.chemistry} Botany: ${result.botany} Zoology: ${result.zoology} Total:- ${result.score} Rank:- ${result.rank} -Aayaam Family.`,
					});
					sms.sendSms(data);
				}
			},
		);
	});
	res.json({ success: true, msg: 'SMS sent' });
});

//Send Single SMS
router.post('/detailedSingleSms', (req, res) => {
	var student = req.body.student;
		Result.findOne(
			{ rollno: student.rollNo, upload_details: req.body.upload._id },
			(err, result) => {
				if (err) throw err;
				if (result) {
					var data = JSON.stringify({
						from: 'aayaam',
						to: '91' + `${student.studentContact}`,
						text: `Results:- Physics: ${result.physics} Chemistry: ${result.chemistry} Botany: ${result.botany} Zoology: ${result.zoology} Total:- ${result.score} Rank:- ${result.rank} -Aayaam Family.`,
					});
					sms.sendSms(data);
				}
			},
		);
	res.json({ success: true, msg: 'SMS sent' });
});

//Send List of Student to SMS
router.post('/sendListOfStudent', (req, res) => {
	var students = req.body.students;
	var filterStudentToSMS = [];
	for (let i = 0; i < students.length; i++) {
		const student = students[i];
		Result.findOne(
			{ rollno: student.rollNo, upload_details: req.body.upload._id },
			(err, result) => {
				if (err) throw err;
				if (result) {
					filterStudentToSMS.push(student);
					if(i == (students.length-1)){
						res.json({ success: true, students:filterStudentToSMS , msg: 'Students Filtered Examwise' });
					}	
				}
				else {
					console.log("Student not found", student.rollNo);
				}
			},
		);	
	}
	
});

module.exports = router;
