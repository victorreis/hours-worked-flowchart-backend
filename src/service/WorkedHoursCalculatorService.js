var moment = require('moment');

const createMomentFromString = (timeString) => {
    const [hour, minute] = timeString.split(':');
    return createMomentFromHourMinute(hour, minute);
};

const createMoments = (startTime, finishTime) => {
    const startMoment = createMomentFromString(startTime);
    const finishMoment = createMomentFromString(finishTime);

    if (startMoment.isAfter(finishMoment)) {
        finishMoment.add({day: 1});
    }

    return {
        startMoment,
        finishMoment,
    };
};

const verifyRules = (startMoment, finishMoment) => {
    if (startMoment.isSame(finishMoment)) {
        throw 'Equal hours not allowed.';
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomMoment = () => {
    return moment().set({
        hour: getRandomInt(0, 23),
        minute: getRandomInt(0, 59),
    });
};

const calculate = {
    s1f1: (m1, m2) => ({
        daytimeHours: randomMoment(),
        nightHours: randomMoment(),
    }),
    s1f2: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    s1f3: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    s2f1: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    s2f2: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    s2f3: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    s3f1: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    s3f2: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    s3f3: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    f1s1: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    f1s2: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    f1s3: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    f2s1: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    f2s2: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    f2s3: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    f3s1: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    f3s2: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
    f3s3: (m1, m2) => ({daytimeHours: m1, nightHours: m2}),
};

const determineLetters = (startMoment, finishMoment) => {
    const letter1 = 's';
    const letter2 = 'f';
    return {letter1, letter2};
};

const determineNumbers = (startMoment, finishMoment) => {
    const number1 = '1';
    const number2 = '1';
    return {number1, number2};
};

const calculateHoursPerPeriod = (startTime, finishTime) => {
    const {startMoment, finishMoment} = createMoments(startTime, finishTime);

    // Start of the calculation workflow
    verifyRules(startMoment, finishMoment);
    const {letter1, letter2} = determineLetters(startMoment, finishMoment);
    const {number1, number2} = determineNumbers(startMoment, finishMoment);

    // Caculating the daytime hours and night hours
    const functionName = letter1 + number1 + letter2 + number2;
    const {daytimeHours, nightHours} = calculate[functionName](
        startMoment,
        finishMoment
    );

    return {
        daytimeHours: formatMoment(daytimeHours),
        nightHours: formatMoment(nightHours),
    };
};

module.exports = {
    calculateHoursPerPeriod,
};
