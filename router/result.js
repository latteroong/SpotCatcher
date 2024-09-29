const express = require('express');
const router = express.Router();
const controller =  require('../controller/resultController');

router.post('/', controller.postResult);

router.get('/', controller.getResult);

module.exports = router;