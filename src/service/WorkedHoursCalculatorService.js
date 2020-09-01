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
    if (
        Number.isInteger(Number.parseInt(hour)) &&
        Number.isInteger(Number.parseInt(minute))
    ) {
        return moment().set({hour, minute, second: 0});
    }
    throw 'Number conversion error.';
};

const formatMoment = (moment) => {
    return moment.format('HH:mm');
};

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

const zeroFilled = (number) => ('00' + Math.round(number)).slice(-2);

const calculateDifference = (moment1, moment2) => {
    const differenceInHours = moment1.diff(moment2, 'hours');
    const differenceInMinutes = moment1.diff(moment2, 'minutes');
    const hours = zeroFilled(differenceInHours);
    const minutes = zeroFilled(differenceInMinutes - differenceInHours * 60);
    return `${hours}:${minutes}`;
};

const ZERO_HOUR = '00:00';
const zeroHourMoment = createMomentFromHourMinute(0, 0);
const calculate = {
    s1f1: (m1, m2) => {
        return {
            daytimeHours: ZERO_HOUR,
            nightHours: calculateDifference(m2, m1),
        };
    },
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
    if (startMoment.isBefore(finishMoment)) {
        return {letter1: 's', letter2: 'f'};
    }
    return {letter1: 'f', letter2: 's'};
};

// Eu poderia ter usado algum design patter nessa função para deixar
// ela com menos ifs, mas estou com pouco tempo.
const determineNumbers = (startMoment, finishMoment) => {
    const nightMomentLimit = createMomentFromHourMinute(4, 59);
    const daytimeMomentLimit = createMomentFromHourMinute(21, 59);
    const twentyFourHoursMoment = createMomentFromHourMinute(23, 59);

    const isStartBetween0And1stLimit = startMoment.isBetween(
        zeroHourMoment,
        nightMomentLimit,
        undefined,
        '[]'
    );
    const isFinishBetween0And1stLimit = finishMoment.isBetween(
        zeroHourMoment,
        nightMomentLimit,
        undefined,
        '[]'
    );

    const isStartBetween1stLimitAnd2ndLimit = startMoment.isBetween(
        nightMomentLimit,
        daytimeMomentLimit,
        undefined,
        '[]'
    );
    const isFinishBetween1stLimitAnd2ndLimit = finishMoment.isBetween(
        nightMomentLimit,
        daytimeMomentLimit,
        undefined,
        '[]'
    );

    const isStartBetween2ndLimitAnd24 = startMoment.isBetween(
        daytimeMomentLimit,
        twentyFourHoursMoment,
        undefined,
        '[]'
    );
    const isFinishBetween2ndLimitAnd24 = finishMoment.isBetween(
        daytimeMomentLimit,
        twentyFourHoursMoment,
        undefined,
        '[]'
    );

    if (isStartBetween0And1stLimit) {
        if (isFinishBetween0And1stLimit) {
            return {number1: 1, number2: 1};
        } else if (isFinishBetween1stLimitAnd2ndLimit) {
            return {number1: 1, number2: 2};
        } else if (isFinishBetween2ndLimitAnd24) {
            return {number1: 1, number2: 3};
        }
    } else if (isStartBetween1stLimitAnd2ndLimit) {
        if (isFinishBetween0And1stLimit) {
            return {number1: 2, number2: 1};
        } else if (isFinishBetween1stLimitAnd2ndLimit) {
            return {number1: 2, number2: 2};
        } else if (isFinishBetween2ndLimitAnd24) {
            return {number1: 2, number2: 3};
        }
    } else if (isStartBetween2ndLimitAnd24) {
        if (isFinishBetween0And1stLimit) {
            return {number1: 3, number2: 1};
        } else if (isFinishBetween1stLimitAnd2ndLimit) {
            return {number1: 3, number2: 2};
        } else if (isFinishBetween2ndLimitAnd24) {
            return {number1: 3, number2: 3};
        }
    }
    throw 'Can not determine the number sequence.';
};

const calculateHoursPerPeriod = (startTime, finishTime) => {
    const {startMoment, finishMoment} = createMoments(startTime, finishTime);

    // Start of the calculation workflow
    verifyRules(startMoment, finishMoment);
    const {letter1, letter2} = determineLetters(startMoment, finishMoment);
    const {number1, number2} = determineNumbers(startMoment, finishMoment);

    // Caculating the daytime hours and night hours
    const functionName = letter1 + number1 + letter2 + number2;
    console.log('functionName', functionName);
    const {daytimeHours, nightHours} = calculate[functionName](
        startMoment,
        finishMoment
    );

    return {
        daytimeHours,
        nightHours,
    };
};

module.exports = {
    calculateHoursPerPeriod,
};
