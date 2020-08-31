var moment = require('moment');

const createMomentFromString = (timeString) => {
    const [hour, minute] = timeString.split(':');
    return createMomentFromHourMinute(hour, minute);
};

const verifyRules = (startMoment, finishMoment) => {
    if (startMoment.isSame(finishMoment)) {
        throw 'Equal hours not allowed';
    }
};

const createMomentFromHourMinute = (hour, minute) => {
    if (hour && minute) {
        return moment().set({hour, minute, second: 0});
    }
    throw 'ERROR';
};

const formatMoment = (moment) => {
    return moment?.format('HH:mm');
};

const daytimeMomentLimit = createMomentFromHourMinute(21, 59);
const nightMomentLimit = createMomentFromHourMinute(4, 59);

const calculatorWorkflow = (startMoment, finishMoment) => {
    if (startMoment.isBefore(finishMoment)) {
        // first path
    }
    finishMoment.add({day: 1});
    // second path

    return {
        daytimeHours: formatMoment(startMoment),
        nightHours: formatMoment(finishMoment),
    };
};

const calculateHoursPerPeriod = (startTime, finishTime) => {
    const startMoment = createMomentFromString(startTime);
    const finishMoment = createMomentFromString(finishTime);

    verifyRules(startMoment, finishMoment);

    return calculatorWorkflow(startMoment, finishMoment);
};

module.exports = {
    calculateHoursPerPeriod,
};
