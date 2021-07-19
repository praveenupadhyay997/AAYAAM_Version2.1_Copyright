const express = require('express');
const Batch = require('../models/Batch');
const Student = require('../models/Student');
const router = express.Router();

// @desc Batch Registration
//  @route POST / batch
router.post('/', (req, res) => {
    Batch.findOne({ batch: req.body.genBatchText }, (err, batch) => {
        if (err) throw err;
        if (batch) {
            res.json({
                success: false,
                msg: 'Batch with same name already exists, Please try a new name.',
            });
        } else {
            let batch = new Batch({
                class: req.body.genBatchClass,
                medium: req.body.genBatchMedium,
                batch: req.body.genBatchText,
            });
            batch
                .save()
                .then(() => {
                    res.json({ success: true, msg: 'Batch saved successfully.' });
                })
                .catch((err) => {
                    res.json({
                        success: false,
                        msg: 'Something went wrong. Please try again.',
                    });
                });
        }
    });
});

//Fetch All Batch
router.get('/allBatches', (req, res) => {
    Batch.find((err, batches) => {
        if (err) throw err;
        if (!batches) {
            res.json({ success: false, msg: 'No Batch Found.' });
        } else {
            res.json({ success: true, msg: 'All Batch Fetched', batches: batches });
        }
    });
});

//Delete Batch
router.delete('/delBatch/:id', (req, res) => {
    var id = req.params.id;
    Batch.findOneAndDelete({ _id: id }, (err, batch) => {
        if (err) throw err;
        if (!batch) {
            res.json({ success: false, msg: 'No Batch Found.' });
        } else {
            Student.deleteMany({ batch: id }).then(() => {
                //res.json({ success: true, msg: 'Record Deleted Successfully!' });
            });
            res.json({ success: true, msg: 'Batch Deleted Successfully!' });
        }
    });
});

//Get Batch Strength
router.get('/count/:id', (req, res) => {
    var batch_id = req.params.id;
    Student.find({ batch: batch_id }, (err, students) => {
        if (err) throw err;
        if (students) {
            res.json({ success: true, msg: 'Counting Done', count: students.length, batch: batch_id });
        } else {
            res.json({ success: false, msg: 'Batch not found' });
        }
    });
});

//Get Students from batch
router.get('/fetch/:batch', (req, res) => {
    var batch = req.params.batch;
    var batch_id;
    Batch.findOne({ batch: batch }, (err, batch) => {
        if (err) throw err;
        else if (batch) {
            Student.find({ batch: batch._id }, (error, students) => {
                if (error) throw error;
                if (students) {
                    res.json({
                        success: true,
                        msg: 'Student for batch fetched',
                        students: students,
                    });
                } else {
                    res.json({
                        success: false,
                        msg: 'No Student registered for this batch',
                    });
                }
            });
        } else {
            res.json({ success: false, msg: 'Batch Not Found' });
        }
    });
    // if(batchStudents.length ==0){
    // 	res.json({success: false, msg: "No Student registered for this batch"});
    // }
    // else if(batchStudents.length>0){
    // 	res.json({success: true, msg: "Student for batch fetched", students: batchStudents});
    // }
});

//Get Batch by id
router.get('getbatch/:id', (req, res) => {
    Batch.find({ _id: new mongo.ObjectID(req.params.id) })
        .exec(function(err, allLogs) {
            if (err) return handleError(err);
            res.json({
                success: true,
                msg: 'All Logs Fetched',
                logs: allLogs,
            });
        });
});

module.exports = router;