const express = require('express');
const generateUniqueId = require('generate-unique-id');
const sms = require('../config/sms');
const router = express.Router();

const DemoStudent = require('../models/Reception');
// @desc Demo Student Registeration
//  @route POST / reception
router.post('/', (req, res) => {
	const id = generateUniqueId({
		length: 8,
		useLetters: true,
		useNumbers: true,
	});

	req.body.isDeleted = false;
	let demoStudent = new DemoStudent({
		referenceId: id,
		fullName: req.body.name,
		fatherName: req.body.fname,
		category: req.body.category,
		studentContact: req.body.contact,
		class: req.body.class,
		medium: req.body.medium,
		state: req.body.state,
		district: req.body.district,
		address: req.body.address,
		referenceMedium: req.body.reference_from,
		counsellorName: req.body.cname,
		counsellorCabin: req.body.cabin,
		isDeleted: req.body.isDeleted,
	});
	DemoStudent.createDemoStudent(demoStudent, (err, demo) => {
		if (err) {
			res.json({ success: false, msg: 'Failed To register demo student' });
		} else {
			//Sending sms
			var data = JSON.stringify({
				from: 'aayaam',
				to: '91' + `${req.body.contact}`,
				text: `Welcome ${req.body.name}, To Aayaam Career Academy. Your Demo Period is started. Reference No.: ${id} Please receive your demo card from reception desk. Enjoy! Have a pleasant day - Aayaam Family.`,
			});

			sms.sendSms(data);
			res.json({
				success: true,
				msg: 'demo Student created',
				demoStudent: demoStudent,
			});
		}
	});
});

router.post('/getdemostudent', (req, res) => {
	DemoStudent.findOne({ referenceId: req.body.reference_no }, (err, demo) => {
		if (err) {
			res.json({ success: false, msg: 'Something Went wrong' });
		} else if (demo) {
			res.json({
				success: true,
				msg: 'demo Student found',
				demoStudent: demo,
			});
		} else {
			res.json({ success: false, msg: 'Failed To find demo student' });
		}
	});
});

module.exports = router;
