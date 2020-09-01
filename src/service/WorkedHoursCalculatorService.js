var moment = require('moment');

const createMomentFromString = (timeString) => {
    const [hour, minute] = timeString.split(':');
    return createMomentFromHourMinute(hour, minute);
};

const createMoments = (startTime, finishTime) => {
    const startMoment = createMomentFromString(startTime);
    const finishMoment = createMomentFromString(finishTime);

    if (startMoment.isAfter(finishMoment)) {
        startMoment.subtract({days: 1});
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
        return moment().set({hour, minute, second: 0, millisecond: 0});
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

const zeroFilled = (number) => ('00' + Math.ceil(number)).slice(-2);

const calculateDifference = (moment1, moment2) => {
    const differenceInDays = moment1.diff(moment2, 'days');
    const differenceInHours = moment1.diff(moment2, 'hours');
    const differenceInMinutes = moment1.diff(moment2, 'minutes');
    const hours = zeroFilled(
        differenceInHours - Math.ceil(differenceInDays * 24)
    );
    const minutes = zeroFilled(
        differenceInMinutes - Math.ceil(differenceInHours * 60)
    );

    return `${hours}:${minutes}`;
};

const sumCalculatedDifferences = (d1, d2, d3) => {
    const [d1Hour, d1Minute] = d1.split(':');
    const [d2Hour, d2Minute] = d2.split(':');
    const [d3Hour, d3Minute] = d3 ? d2.split(':') : [0, 0];
    const hours = zeroFilled(
        Number.parseInt(d1Hour) +
            Number.parseInt(d2Hour) +
            Number.parseInt(d3Hour)
    );
    const minutes = zeroFilled(
        Number.parseInt(d1Minute) +
            Number.parseInt(d2Minute) +
            Number.parseInt(d3Minute)
    );

    if (Number.parseInt(minutes) >= 60) {
        const newHours = zeroFilled(Number.parseInt(hours) + 1);
        const newMinutes = zeroFilled(Number.parseInt(minutes) - 60);
        return `${newHours}:${newMinutes}`;
    }

    return `${hours}:${minutes}`;
};

const ZERO_HOUR = '00:00';
const ALL_DAY = '17:00';
const ALL_NIGHT = '07:00';
const FIRST_HOURS_NIGHT = '05:00';
const LAST_HOURS_NIGHT = '02:00';

const zeroHourMoment = createMomentFromHourMinute(0, 0);
const zeroHourMomentMinus1Day = createMomentFromHourMinute(0, 0).subtract(
    1,
    'days'
);

const nightMomentLimit = createMomentFromHourMinute(5, 00);
const nightMomentLimitMinus1Day = createMomentFromHourMinute(5, 00).subtract(
    1,
    'days'
);

const daytimeMomentLimit = createMomentFromHourMinute(22, 00);
const daytimeMomentLimitMinus1Day = createMomentFromHourMinute(22, 00).subtract(
    1,
    'days'
);

const twentyFourHoursMoment = createMomentFromHourMinute(24, 00);
const twentyFourHoursMomentMinus1Day = createMomentFromHourMinute(
    24,
    00
).subtract(1, 'days');

const calculate = {
    s1f1: (s1, f1) => ({
        daytimeHours: ZERO_HOUR,
        nightHours: calculateDifference(f1, s1),
    }),
    s1f2: (s1, f2) => ({
        daytimeHours: calculateDifference(f2, nightMomentLimit),
        nightHours: calculateDifference(nightMomentLimit, s1),
    }),
    s1f3: (s1, f3) => ({
        daytimeHours: ALL_DAY,
        nightHours: sumCalculatedDifferences(
            calculateDifference(nightMomentLimit, s1),
            calculateDifference(f3, daytimeMomentLimit)
        ),
    }),
    s2f1: (s2, f1) => ({
        daytimeHours: calculateDifference(daytimeMomentLimit, s2),
        nightHours: sumCalculatedDifferences(
            calculateDifference(twentyFourHoursMoment, daytimeMomentLimit),
            calculateDifference(f1, zeroHourMoment)
        ),
    }),
    s2f2: (s2, f2) => ({
        daytimeHours: calculateDifference(f2, s2),
        nightHours: ZERO_HOUR,
    }),
    s2f3: (s2, f3) => ({
        daytimeHours: calculateDifference(daytimeMomentLimit, s2),
        nightHours: calculateDifference(f3, daytimeMomentLimit),
    }),
    s3f1: (s3, f1) => ({
        daytimeHours: ZERO_HOUR,
        nightHours: sumCalculatedDifferences(
            calculateDifference(twentyFourHoursMoment, s3),
            calculateDifference(f1, zeroHourMoment)
        ),
    }),
    s3f2: (s3, f2) => ({
        daytimeHours: calculateDifference(f2, nightMomentLimit),
        nightHours: sumCalculatedDifferences(
            calculateDifference(twentyFourHoursMoment, s3),
            calculateDifference(nightMomentLimit, zeroHourMoment)
        ),
    }),
    s3f3: (s3, f3) => ({
        daytimeHours: ZERO_HOUR,
        nightHours: calculateDifference(f3, s3),
    }),
};

const determineLetters = (startMoment, finishMoment) => {
    if (startMoment.isBefore(finishMoment)) {
        return {letter1: 's', letter2: 'f'};
    }
    return {letter1: 'f', letter2: 's'};
};

const isBetweenHours = (startMoment, finishMoment) => {
    const isStartBetween0And1stLimit =
        startMoment.isBetween(
            zeroHourMoment,
            nightMomentLimit,
            undefined,
            '[]'
        ) ||
        startMoment.isBetween(
            zeroHourMomentMinus1Day,
            nightMomentLimitMinus1Day,
            undefined,
            '[]'
        );
    const isFinishBetween0And1stLimit = finishMoment.isBetween(
        zeroHourMoment,
        nightMomentLimit,
        undefined,
        '[]'
    );

    const isStartBetween1stLimitAnd2ndLimit =
        startMoment.isBetween(
            nightMomentLimit,
            daytimeMomentLimit,
            undefined,
            '[]'
        ) ||
        startMoment.isBetween(
            nightMomentLimitMinus1Day,
            daytimeMomentLimitMinus1Day,
            undefined,
            '[]'
        );
    const isFinishBetween1stLimitAnd2ndLimit = finishMoment.isBetween(
        nightMomentLimit,
        daytimeMomentLimit,
        undefined,
        '[]'
    );

    const isStartBetween2ndLimitAnd24 =
        startMoment.isBetween(
            daytimeMomentLimit,
            twentyFourHoursMoment,
            undefined,
            '[]'
        ) ||
        startMoment.isBetween(
            daytimeMomentLimitMinus1Day,
            twentyFourHoursMomentMinus1Day,
            undefined,
            '[]'
        );
    const isFinishBetween2ndLimitAnd24 = finishMoment.isBetween(
        daytimeMomentLimit,
        twentyFourHoursMoment,
        undefined,
        '[]'
    );

    return {
        isStartBetween0And1stLimit,
        isFinishBetween0And1stLimit,
        isStartBetween1stLimitAnd2ndLimit,
        isFinishBetween1stLimitAnd2ndLimit,
        isStartBetween2ndLimitAnd24,
        isFinishBetween2ndLimitAnd24,
    };
};

// Eu poderia ter usado algum design patter nessa função para deixar
// ela com menos ifs, mas estou com pouco tempo.
const determineNumbers = (startMoment, finishMoment) => {
    const {
        isStartBetween0And1stLimit,
        isFinishBetween0And1stLimit,
        isStartBetween1stLimitAnd2ndLimit,
        isFinishBetween1stLimitAnd2ndLimit,
        isStartBetween2ndLimitAnd24,
        isFinishBetween2ndLimitAnd24,
    } = isBetweenHours(startMoment, finishMoment);

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
