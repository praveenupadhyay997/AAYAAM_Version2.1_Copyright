const express = require('express');
const router = express.Router();

// @desc Landing Page
// @route GET/ landing
router.get('/', (req, res) => {
	res.send('Welcome to Aayaam');
});

module.exports = router;
