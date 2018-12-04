const fs = require('fs');

var rawDay4Input = fs.readFileSync('./Day4Input.txt');

var day4Input = rawDay4Input.toString().split('\r\n').sort();

function ArrayToString(aArray) {
    let str = "";
    for (i = 0; i < aArray.length; i++)
        str += aArray[i];
    return str;
}

const kMinutesInHour = 60;
var timeTable = [];

var currentGuardId = "";
var startSleep = 0;
for (i = 0; i < day4Input.length; i++) {
    let line = day4Input[i].split('] ');
    let rawDateTime = line[0].substr(1).split(' ');
    let rawTime = rawDateTime[1].split(':');
    let time = parseInt(rawTime[0]) * 100 + parseInt(rawTime[1]);

    let rawDate = rawDateTime[0].substr(5);

    if (line[1].startsWith("Guard")) {
        currentGuardId = line[1].split(' ')[1].substr(1);
    }
    else {
        if (line[1].startsWith("falls asleep"))
            startSleep = time;
        else if (line[1].startsWith("wakes up")) {
            let id = rawDate + ' ' + currentGuardId;
            if ((startSleep >= 0) && (time < kMinutesInHour)) {
                if (timeTable[id] === undefined) {
                    timeTable[id] = [];
                    for (j = 0; j < kMinutesInHour; j++)
                        timeTable[id][j] = '.';
                }
                for (j = startSleep; j < time; j++)
                    timeTable[id][j] = '#';
            }
        }
    }
}

var guardMax = [];
for (var key in timeTable) {
    let guardId = key.split(' ')[1];
    if (guardMax[guardId] === undefined) {
        guardMax[guardId] = [];
        for (i = 0; i < kMinutesInHour; i++)
            guardMax[guardId][i] = 0;
    }

    for (i = 0; i < kMinutesInHour; i++)
        if (timeTable[key][i] == '#')
            guardMax[guardId][i]++;

    console.log(key + ": " + ArrayToString(timeTable[key]));
}

console.log("--------------------------------------------------------------------------------");

var guardWithMax;
var maxTotalSleep = 0
var guardMaxSleepMinute;
var guardWithMaxSleepMinute;
var globalMaxSleepMinute = 0;
var globalSleepMinute = 0;
for (var key in guardMax) {
    let totalSleep = 0;
    let maxSleepMinute = 0;
    let max = 0;
    for (i = 0; i < kMinutesInHour; i++) {
        if (guardMax[key][i] > max) {
            max = guardMax[key][i];
            maxSleepMinute = i;
        }
        totalSleep += guardMax[key][i];
    }

    if (totalSleep > maxTotalSleep) {
        guardWithMax = key;
        guardMaxSleepMinute = maxSleepMinute;
        maxTotalSleep = totalSleep;
    }

    if (guardMax[key][maxSleepMinute] > globalMaxSleepMinute)
    {
      guardWithMaxSleepMinute = key;
      globalMaxSleepMinute = guardMax[key][maxSleepMinute];    
      globalSleepMinute = maxSleepMinute;
    }

    console.log(key + ": " + JSON.stringify(guardMax[key]) + " Total sleep: " + totalSleep + " Max sleep minute: "+ guardMax[key][maxSleepMinute]);
}

console.log("---------------------------------------------------------------------------------");

console.log("Moust sleepy guard: " + guardWithMax);
console.log("Guard total sleep: " + guardMaxSleepMinute);
console.log("Problem 1 solution: " + guardMaxSleepMinute * parseInt(guardWithMax));

console.log();
console.log("Guard with max sleeping minute:" + guardWithMaxSleepMinute);
console.log("Guard max sleeping minute: " + globalSleepMinute);
console.log("Problem 2 solution: " + guardWithMaxSleepMinute * globalSleepMinute);