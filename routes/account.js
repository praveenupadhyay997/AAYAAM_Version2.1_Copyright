const express = require('express');
const Account = require('../models/Account');
const Student = require('../models/Student');
const sms = require('../config/sms');
const router = express.Router();
const Counter = require('../models/Counter');

var c = 0;

router.post('/', (req, res) => {
	var statusOne = false;
	var statusTwo = false;
	var statusThree = false;
	if (
		req.body.statusOne != null ||
		req.body.statusThree != null ||
		req.body.statusFour != null
	) {
		statusOne =
			req.body.statusOne == 'otp' || req.body.statusOne == 'paid'
				? true
				: false;
		statusTwo = req.body.statusTwo == 'paid' ? true : false;
		statusThree = req.body.statusThree == 'paid' ? true : false;
		statusFour = req.body.statusFour == 'paid' ? true : false;
	}
	Account.findOne({ rollNo: req.body.rollno }, (err, account) => {
		if (err) throw err;
		if (account) {
			res.json({
				success: false,
				msg:
					'Entry with this Roll No: ' +
					`${req.body.rollno}` +
					' already exists. Please go to dashboard and to the updates.',
			});
		} else {
			Student.getStudentByRollNo(req.body.rollno, (err, student) => {
				if (err) return handleError(err);
				if (!student) {
					res.json({
						success: false,
						msg: 'Please do the admission first and then create payslip.',
					});
				} else {
					req.body.isDeleted = false;
					newAccount = new Account({
						student: student._id,
						rollNo: req.body.rollno,
						totalFeeAmount: req.body.totalAmount,
						modeOfPayment: req.body.mop,
						board: req.body.board,
						noOfInstallment: req.body.noOfInstallments,
						remarks: req.body.remarks,
						installOne: req.body.installOne,
						installTwo:
							req.body.installTwo != null ? req.body.installTwo : null,
						installThree:
							req.body.installThree != null ? req.body.installThree : null,
						installFour:
							req.body.installFour != null ? req.body.installFour : null,
						installDateOne: req.body.dateInstallOne,
						installDateTwo:
							req.body.dateInstallTwo != null ? req.body.dateInstallTwo : null,
						installDateThree:
							req.body.dateInstallThree != null
								? req.body.dateInstallThree
								: null,
						installDateFour:
							req.body.dateInstallFour != null
								? req.body.dateInstallFour
								: null,
						statusOne: statusOne,
						statusTwo: statusTwo,
						statusThree: statusThree,
						statusFour: statusFour,
						isDeleted: req.body.isDeleted,
					});
					Account.createAccount(newAccount, (err, account) => {
						getCounter();
						if (err) {
							res.json({ success: false, msg: 'Failed to create payslip' });
							throw err;
						} else {
							Account.findOne({ rollNo: req.body.rollno })
								.populate({
									path: 'student',

									populate: { path: 'batch' },
								})
								.exec(function (err, account) {
									if (err) return handleError(err);
									if (account) {
										res.json({
											success: true,
											msg: 'Payslip Generated Successfully',
											account: account,
											count: c,
										});
									}
								});
						}
					});
				}
			});
		}
	});
});

//Get All Accounts
router.get('/fetchAll', (req, res) => {
	Account.find({})
		.populate({
			path: 'student',
			populate: { path: 'batch' },
		})
		.exec(function (err, allAccounts) {
			if (err) return handleError(err);
			else {
				// allAccounts.foreach();
				var accounts = [];
				allAccounts.forEach((account) => {
					if (account.student.isDeleted == false) {
						accounts.push(account);
					}
				});
				res.json({
					success: true,
					msg: 'All Uplaods Fetched',
					accounts: accounts,
				});
			}
		});
});

// @desc Delete corrosponding upload from upload table
//  @route POST / delete
router.delete('/delete/:id', (req, res) => {
	var id = req.params.id;
	Account.findOneAndDelete({ _id: id }, (err, account) => {
		if (err) throw err;
		if (!account) {
			res.json({ success: false, msg: 'Account not found' });
		} else {
			res.json({ success: true, msg: 'Account Deleted Successfully!' });
		}
	});
});

router.post('/update', (req, res) => {
	var statusOne = false;
	var statusTwo = false;
	var statusThree = false;
	var statusFour = false;
	if (
		req.body.status_One != null ||
		req.body.status_Two != null ||
		req.body.status_Three != null ||
		req.body.status_Four != null
	) {
		statusOne =
			req.body.status_One == 'otp' || req.body.status_One == 'paid'
				? true
				: false;
		statusTwo = req.body.status_Two == 'paid' ? true : false;
		statusThree = req.body.status_Three == 'paid' ? true : false;
		statusFour = req.body.status_Four == 'paid' ? true : false;
	}
	Account.findOneAndUpdate(
		{ rollNo: req.body.roll_No },
		{
			rollNo: req.body.roll_No,
			totalFeeAmount: req.body.total_Amount,
			modeOfPayment: req.body.modeOfPayment,
			board: req.body.edu_board,
			noOfInstallment: req.body.totalInstallments,
			remarks: req.body.remark,
			installOne: req.body.install_One,
			installDateOne: req.body.dateInstall_One,
			statusOne: statusOne,
			installTwo: req.body.install_Two,
			installDateTwo: req.body.dateInstall_Two,
			statusTwo: statusTwo,
			installThree: req.body.install_Three,
			installDateThree: req.body.dateInstall_Three,
			statusThree: statusThree,
			installFour: req.body.install_Four,
			installDateFour: req.body.dateInstall_Four,
			statusFour: statusFour,
		},
		(err, account) => {
			getCounter();
			if (err) throw err;
			if (account) {
				Account.findOne({ rollNo: req.body.roll_No })
					.populate({
						path: 'student',

						populate: { path: 'batch' },
					})
					.exec(function (err, account) {
						if (err) return handleError(err);
						if (account) {
							res.json({
								success: true,
								msg: 'Payslip Updated Successfully',
								account: account,
								count: c,
							});
						}
					});
			} else {
				res.json({ success: false, msg: 'Account not Found' });
			}
		},
	);
});

//Send SMS
router.post('/sms', (req, res) => {
	//Sending sms
	var data = JSON.stringify({
		from: 'aayaam',
		to: '91' + `${req.body.contact}`,
		text: `Hey ${req.body.name}, Reminder. Your status for ${req.body.instNo} installment is ${req.body.status} with amount ₹${req.body.amount} Please Pay before ${req.body.dueDate}. Kindly ignore if already paid. - Aayaam Family.`,
	});
	sms.sendSms(data);
	res.json({ success: true, msg: 'Sms Sent' });
});

function getCounter() {
	Counter.find({}, (err, counter) => {
		if (err) throw err;
		if (counter.length > 0) {
			c = counter[0].counter;
			counter[0].counter += 1;
			counter[0].save();
		} else {
			count = new Counter({
				counter: 1000001,
			});
			Counter.createCounter(count, (err, count) => {
				if (err) throw err;
				if (count) {
					c = count.counter;
				}
			});
		}
	});
}

module.exports = router;
