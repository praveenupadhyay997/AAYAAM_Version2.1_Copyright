const express = require('express');
const Account = require('../models/Account');
const Student = require('../models/Student');
const sms = require('../config/sms');
const router = express.Router();
const multer = require('multer');
var upload = multer({ dest: 'public/uploads/feeConfirmation' });
const Counter = require('../models/Counter');

var c = 0;

class CumulativeSum {
    cumulativeSumOne;
    cumulativeSumTwo;
    cumulativeSumThree;
    cumulativeSumFour;

    constructor(...params) {
        this.cumulativeSumOne = params[0] != null ? params[0] : 0;
        this.cumulativeSumTwo = this.cumulativeSumOne + (params[1] != null ? params[1] : 0);
        this.cumulativeSumThree = this.cumulativeSumTwo + (params[2] != null ? params[2] : 0);
        this.cumulativeSumFour = this.cumulativeSumThree + (params[3] != null ? params[3] : 0);

        if (isNaN(this.cumulativeSumOne)) {
            this.cumulativeSumOne = 0;
        } else if (isNaN(this.cumulativeSumTwo)) {
            this.cumulativeSumTwo = 0;
        } else if (isNaN(this.cumulativeSumThree)) {
            this.cumulativeSumThree = 0;
        } else if (isNaN(this.cumulativeSumFour)) {
            this.cumulativeSumFour = 0;
        }
    }
}

router.post('/', upload.single('file'), (req, res) => {
    filePath = 'public/uploads/feeConfirmation/' + req.file.filename;
    var statusOne = false;
    var statusTwo = false;
    var statusThree = false;
    var statusFour = false;
    var defaultReceived = 0;

    Account.findOne({ rollNo: req.body.rollno }, (err, account) => {
        if (err) throw err;
        if (account) {
            res.json({
                success: false,
                msg: 'Entry with this Roll No: ' +
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
                        totalFeeAmountReceived: defaultReceived,
                        // modeOfPayment: req.body.mop,
                        board: req.body.board,
                        noOfInstallment: req.body.noOfInstallments,
                        remarks: req.body.remarks,
                        installOne: req.body.installOne,
                        installTwo: req.body.installTwo != null ? req.body.installTwo : null,
                        installThree: req.body.installThree != null ? req.body.installThree : null,
                        installFour: req.body.installFour != null ? req.body.installFour : null,
                        installDateOne: req.body.dateInstallOne,
                        installDateTwo: req.body.dateInstallTwo != null ? req.body.dateInstallTwo : null,
                        installDateThree: req.body.dateInstallThree != null ?
                            req.body.dateInstallThree : null,
                        installDateFour: req.body.dateInstallFour != null ?
                            req.body.dateInstallFour : null,
                        statusOne: statusOne,
                        statusTwo: statusTwo,
                        statusThree: statusThree,
                        statusFour: statusFour,
                        confirmationFile: req.file.filename,
                        originalName: req.file.originalname,
                        isDeleted: req.body.isDeleted,
                    });
                    Account.createAccount(newAccount, (err, account) => {
                        if (err) {
                            res.json({ success: false, msg: 'Failed to create payslip' });
                            throw err;
                        } else {
                            Account.findOne({ rollNo: req.body.rollno })
                                .populate({
                                    path: 'student',

                                    populate: { path: 'batch' },
                                })
                                .exec(function(err, account) {
                                    if (err) return handleError(err);
                                    if (account) {
                                        res.json({
                                            success: true,
                                            msg: 'Payslip Generated Successfully',
                                            account: account
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
        .exec(function(err, allAccounts) {
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

router.post('/update', upload.single('updateFile'), (req, res) => {
    var statusOne = false;
    var statusTwo = false;
    var statusThree = false;
    var statusFour = false;

    var cumulativeSum = new CumulativeSum(parseInt(req.body.install_One), parseInt(req.body.install_Two), parseInt(req.body.install_Three), parseInt(req.body.install_Four));

    var receivedAmt = parseInt(req.body.totalDeposit);
    var numInstallment = parseInt(req.body.totalInstallments);

    console.log(receivedAmt, numInstallment);

    if (receivedAmt >= cumulativeSum.cumulativeSumOne && receivedAmt < cumulativeSum.cumulativeSumTwo && numInstallment >= 1) {
        statusOne = true;
    } else if (receivedAmt >= cumulativeSum.cumulativeSumTwo && receivedAmt < cumulativeSum.cumulativeSumThree && numInstallment >= 2) {
        statusOne = true;
        statusTwo = true;
    } else if (receivedAmt >= cumulativeSum.cumulativeSumThree && receivedAmt < cumulativeSum.cumulativeSumFour && numInstallment >= 3) {
        statusOne = true;
        statusTwo = true;
        statusThree = true;
    } else if (receivedAmt >= cumulativeSum.cumulativeSumFour && numInstallment == 4) {
        statusOne = true;
        statusTwo = true;
        statusThree = true;
        statusFour = true;
    }

    updateAccount = new Account({
        student: req.body._id,
        rollNo: req.body.roll_No,
        totalFeeAmount: req.body.total_Amount,
        totalFeeAmountReceived: parseInt(req.body.totalDeposit),
        modeOfPayment: req.body.modeOfPayment,
        board: req.body.edu_board,
        noOfInstallment: req.body.totalInstallments,
        remarks: req.body.remark,
        installOne: req.body.install_One,
        installTwo: req.body.install_Two,
        installThree: req.body.install_Three,
        installFour: req.body.install_Four,
        installDateOne: req.body.dateInstall_One != null ? req.body.dateInstall_One : null,
        installDateTwo: req.body.dateInstall_Two != null ? req.body.dateInstall_Two : null,
        installDateThree: req.body.dateInstall_Three != null ?
            req.body.dateInstall_Three : null,
        installDateFour: req.body.dateInstall_Four != null ?
            req.body.dateInstall_Four : null,
        statusOne: statusOne,
        statusTwo: statusTwo,
        statusThree: statusThree,
        statusFour: statusFour,
        confirmationFile: fileName,
        originalName: originalName,
        isDeleted: false,
    });

    console.log(req.body);
    console.log(cumulativeSum.cumulativeSumTwo, cumulativeSum.cumulativeSumFour);
    var fileName = null;
    var originalName = null;
    if (typeof req.file !== 'undefined') {
        fileName =
            req.file != null ? 'uploads/feeConfirmation/' + req.file.filename : null;
        originalName =
            req.file != null ?
            'uploads/feeConfirmation/' + req.file.originalname :
            null;
    }

    console.log(req.body.dateInstall_One.toString(), req.body.dateInstall_Two, (!req.body.dateInstall_Two.toString()), !(req.body.dateInstall_Two), !(req.body.dateInstall_Four));

    Account.findOneAndUpdate({ rollNo: req.body.roll_No }, {
            rollNo: updateAccount.rollNo,
            totalFeeAmount: updateAccount.totalFeeAmount,
            totalFeeAmountReceived: updateAccount.totalFeeAmountReceived,
            modeOfPayment: updateAccount.modeOfPayment,
            board: updateAccount.board,
            noOfInstallment: updateAccount.noOfInstallment,
            remarks: updateAccount.remarks,
            installOne: updateAccount.installOne,
            installDateOne: updateAccount.installDateOne,
            installTwo: updateAccount.installTwo,
            installDateTwo: updateAccount.installDateTwo,
            statusTwo: updateAccount.statusTwo,
            installThree: updateAccount.installThree,
            installDateThree: updateAccount.installDateThree,
            statusThree: updateAccount.statusThree,
            installFour: updateAccount.installFour,
            installDateFour: updateAccount.installDateFour,
            statusFour: updateAccount.statusFour,
            confirmationFile: fileName,
            originalName: originalName,
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
                    .exec(function(err, account) {
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

function isEmpty(obj) {
    return JSON.stringify(obj) === JSON.stringify({});
}

module.exports = router;