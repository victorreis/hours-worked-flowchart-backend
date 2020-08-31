var express = require('express');
var calculatorService = require('./../service/WorkedHoursCalculatorService');
const {exception} = require('../service/ExceptionHandlerService');
var router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.post('/', function (req, res, next) {
    const {startTime, finishTime} = req.body;
    try {
        res.send(
            calculatorService.calculateHoursPerPeriod(startTime, finishTime)
        );
    } catch (e) {
        next(e);
    }
});

router.use(exception);

module.exports = router;
