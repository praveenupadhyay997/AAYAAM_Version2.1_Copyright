const express = require('express');
const StudentLogs = require('../models/StudentLogs');
const router = express.Router();

//Get All Logs Generated by the system
router.get('/getAll', (req, res) => {
    StudentLogs.find({})
        .exec(function(err, allLogs) {
            if (err) return handleError(err);
            res.json({
                success: true,
                msg: 'All Logs Fetched',
                logs: allLogs,
            });
        });
});


// @desc Logs entry to system
//  @route POST / saveLog
router.post('/saveLog', (req, res) => {
    let uniLog = new StudentLogs({
        timeStamp: req.body.timeStamp,
        rollNo: req.body.rollNo,
        logText: req.body.logText
    });

    StudentLogs.createStudentLogs(uniLog, (err, logs) => {
        if (err) {
            res.json({ success: false, msg: 'Failed To log the transaction' });
        } else {
            res.json({
                success: true,
                msg: 'Log created successfully',
                log: uniLog,
            });
        }
    });
});

module.exports = router;