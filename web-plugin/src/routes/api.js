const express = require('express');
const router = express.Router();

// Example API endpoint
router.get('/example', (req, res) => {
    res.json({ message: 'This is an example response from the API.' });
});

// Add more API endpoints as needed

module.exports = router;