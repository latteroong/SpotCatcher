const express = require('express');
const router = express.Router();
let dataset;

router.post('/', (req, res) => {
    console.log(req.body);
    dataset = req.body
    res.render('result', {data: dataset});
});

router.get('/', (req, res) => {
    res.json({
        keyword: dataset.keyword,
        locations: dataset.locations
    });
});

module.exports = router;