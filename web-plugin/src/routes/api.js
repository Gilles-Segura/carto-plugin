const express = require('express');
const router = express.Router();

// Example API endpoint
router.get('/example', (req, res) => {
    res.json({ message: 'This is an example response from the API.' });
});

// Add more API endpoints as needed
router.get('/river-structures', (req, res) => {
    const structures = [
        {
            id: 1,
            name: "Test Barrage",
            type: "barrage",
            lat: 46.2276,
            lng: 2.2137,
            river: "Loire",
            height: 50,
            year: 2000
        }
    ];
    res.json(structures);
});

module.exports = router;