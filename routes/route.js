const express = require('express');
const router = express.Router()

db = require('../services/db_connection');

router.get('/up', (req, res) => {
    res.send('API is up and running')
});

router.get("/db", (req, res) => {
    db.query('SELECT * FROM test', (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result.rows);
    });
});

module.exports = router;

