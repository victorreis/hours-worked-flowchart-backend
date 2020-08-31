var express = require('express');
var calculatorService = require('./../service/WorkedHoursCalculatorService');
var router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.post('/', function (req, res, next) {
    const {startTime, finishTime} = req.body;
    res.send(calculatorService.calculateHoursPerPeriod(startTime, finishTime));
});

module.exports = router;
