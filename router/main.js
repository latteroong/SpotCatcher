const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log('첫페이지 접속됨.');

    let fruits = ['apple', 'banana', '복숭아', '오렌지'];
    const sendData = {
        name: '한병일',
        fruits
    };
    res.render('index', sendData);
})

module.exports = router;