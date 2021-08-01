const express = require('express');
const ChequeDetails = require('../models/ChequeDetail');
const router = express.Router();

//Get Cheque Details by roll number from the Backend
router.get('/getAll/:rollNo', (req, res) => {
    let rollNumber = req.params.rollNo;
    ChequeDetails.find({ rollNo: rollNumber })
        .exec(function(err, allChequeDetails) {
            if (err) return handleError(err);
            res.json({
                success: true,
                msg: 'All Cheque Details Fetched',
                chequeDetails: allChequeDetails,
            });
        });
});


// @desc Cheque Detail entry to system
//  @route POST / saveChequeDetails
router.post('/saveChequeDetails', (req, res) => {
    let dateApproved = req.body.approvedDate;
    let details;
    if (dateApproved) {
        details = new ChequeDetails({
            rollNo: req.body.rollNo,
            paymentAmount: req.body.paymentAmount,
            submissionDate: req.body.submissionDate,
            approvedDate: null,
            status: req.body.status
        });
    } else {
        details = new ChequeDetails({
            rollNo: req.body.rollNo,
            paymentAmount: req.body.paymentAmount,
            submissionDate: req.body.submissionDate,
            approvedDate: null,
            status: req.body.status
        });
    }

    ChequeDetails.createChequeDetails(details, (err, det) => {
        if (err) {
            res.json({ success: false, msg: 'Failed To save the cheque details.' });
        } else {
            res.json({
                success: true,
                msg: 'Cheque details saved successfully',
                detail: details,
            });
        }
    });
});

// Update the ChequeDetails status and enter the date approvedDate
router.post('/update', (req, res) => {

    ChequeDetails.findOneAndUpdate({ $and: [{ rollNo: req.body.rollNo }, { status: "due" }] }, {
            rollNo: req.body.rollNo,
            paymentAmount: req.body.paymentAmount,
            submissionDate: req.body.submissionDate,
            approvedDate: req.body.approvedDate,
            status: req.body.status
        },
        (err, chequeDetails) => {
            if (err) throw err;
            if (chequeDetails) {
                ChequeDetails.findOne({ rollNo: req.body.rollNo })
                    .exec(function(err, chequeDetails) {
                        if (err) return handleError(err);
                        if (chequeDetails) {
                            res.json({
                                success: true,
                                msg: 'Cheque Details Updated Successfully',
                                updatedChequeDetails: chequeDetails
                            });
                        }
                    });
            } else {
                res.json({ success: false, msg: 'No Cheque Details found for this roll No' });
            }
        },
    );
});

module.exports = router;