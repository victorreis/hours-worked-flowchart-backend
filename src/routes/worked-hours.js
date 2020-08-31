var express = require('express');
var moment = require('moment');
var router = express.Router();

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

const createMomentFromString = (timeString) => {
    const [hour, minute] = timeString.split(':');
    return createMomentFromHourMinute(hour, minute);
};

const createMomentFromHourMinute = (hour, minute) => {
    if (hour && minute) {
        return moment().set({hour, minute, second: 0});
    }
    throw 'ERROR';
};

const daytimeMomentLimit = createMomentFromHourMinute(21, 59);
const nightMomentLimit = createMomentFromHourMinute(21, 59);

const calculateHoursPerPeriod = (firstMoment, secondMoment) => {
    // const daytimeHours = formatMoment(startMoment);
    // const nightHours = formatMoment(finishMoment);
    // if (firstMoment.isBefore(secondMoment)) {
    //     if ()
    // }
    return {
        daytimeHours: firstMoment,
        nightHours: secondMoment,
    };
};

const formatMoment = (moment) => {
    return moment?.format('HH:mm');
};

router.post('/', function (req, res, next) {
    const {startTime, finishTime} = req.body;
    const startMoment = createMomentFromString(startTime);
    const finishMoment = createMomentFromString(finishTime);

    if (startMoment.isSame(finishMoment)) {
        throw 'Equal hours not allowed';
    }

    const {daytimeHours, nightHours} = calculateHoursPerPeriod(
        startMoment,
        finishMoment
    );

    res.send({
        daytimeHours: formatMoment(daytimeHours),
        nightHours: formatMoment(nightHours),
    });
});

module.exports = router;
