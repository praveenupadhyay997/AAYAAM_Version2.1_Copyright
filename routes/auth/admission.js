const express = require('express');
const router = express.Router();
const multer = require('multer');
var mailer = require('../../config/mailer');
const sms = require('../../config/sms');
var upload = multer({ dest: 'public/uploads/profile' });

const Student = require('../../models/Student');

// @desc Student Admission
// @route POST/ admission
router.post('/', upload.single('file'), (req, res) => {
	var fileName = null;
	var originalName = null;
	if (typeof req.file !== 'undefined') {
		fileName = req.file != null ? 'uploads/profile/' + req.file.filename : null;
		originalName =
			req.file != null ? 'uploads/profile/' + req.file.originalname : null;
	}
	Student.findOne({ rollNo: req.body.rollno }, (err, student) => {
		if (err) {
			res.json({ success: false, msg: err });
		}
		if (student) {
			res.json({
				success: false,
				msg: 'Student with this Roll no already exist.',
			});
		} else {
			var password =
				req.body.name[0].toUpperCase() +
				req.body.name.slice(1, 4) +
				'@' +
				req.body.dob.slice(8, 10) +
				'' +
				req.body.dob.slice(5, 7);
			req.body.isDeleted = false;
			let newStudent = new Student({
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
				password: password,
				profilePic: fileName,
				profileOriginalName: originalName,
				isDeleted: req.body.isDeleted,
			});

			Student.createStudent(newStudent, (err, student) => {
				if (err) {
					res.json({ success: false, msg: 'Failed To Admit the student' });
				} else {
					Student.find({})
						.populate('batch')
						.exec(function (error, students) {
							if (error) throw error;
							//res.json({ success: true, msg: 'Results saved successfully' });
						});

					var output = `
               Hi there,
               <br/>
               Welcome <b>${req.body.name} </b>,to Aayaam Academy!
               <br/>
               Here are your Credentials:-
               <br/>
               <h3> <b>Reference No.: ${req.body.referenceid}</b> </h3>
               <br/>
                For Login Use below credetials:-
               <h3> <b>Roll No.: ${req.body.rollno}</b> </h3>
               <h3> <b>Login Password: ${password}</b> </h3>
               <br/>
               Enjoy!!...Have a pleasent day`;
					//send the mail
					mailer.sendEmail(
						'"Aayaam Academy" <ascw.upes@gmail.com>',
						req.body.email,
						'Welcome to Aayaam Academy',
						output,
					);
					//Sending sms
					var data = JSON.stringify({
						from: 'aayaam',
						to: '91' + `${req.body.contact}`,
						text: `Welcome ${req.body.name}, To Aayaam Career Academy. Your Admission has been processed successfully. Here are your Credentials:- Reference No.: ${req.body.referenceid} For Login Use below credentials:- Roll No.: ${req.body.rollno} Login Password: ${password} Enjoy! Have a pleasant day - Aayaam Family.`,
					});
					sms.sendSms(data);
					res.json({ success: true, msg: 'Student Registered Successfully.' });
				}
			});
		}
	});
});

router.post('/getstudent', (req, res) => {
	Student.getStudentByRollNo(req.body.roll_no, (err, student) => {
		if (err) {
			res.json({ success: false, msg: 'Failed To find demo student' });
		} else if (student) {
			Student.find({ rollNo: req.body.roll_no })
				.populate('batch')
				.exec(function (error, student) {
					if (error) throw error;
					res.json({
						success: true,
						msg: 'Student found',
						student: student,
					});
				});
		} else {
			res.json({
				success: false,
				msg: 'Student Not found',
				student: student,
			});
		}
	});
});

module.exports = router;
