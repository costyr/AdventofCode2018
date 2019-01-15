const fs = require('fs');

const kInputFilePath = './Day23Input.txt';

function ParseInput(aInputFilePath, aNanoBots) {

  let rawInput = fs.readFileSync(aInputFilePath);

  let dayInput = rawInput.toString().split('\r\n');

  for (let i = 0; i < dayInput.length; i++) {
    let line = dayInput[i].split('>, r=');
    let rawPos = line[0].split('=<')[1].split(',');
    let x = parseInt(rawPos[0]);
    let y = parseInt(rawPos[1]);
    let z = parseInt(rawPos[2]);
    let r = parseInt(line[1]);

    aNanoBots.push({ x, y, z, r });
  }
}

function ComputeManhattanDistance(aPoint1, aPoint2) {
  return Math.abs(aPoint1.x - aPoint2.x) + Math.abs(aPoint1.y - aPoint2.y) + Math.abs(aPoint1.z - aPoint2.z);
}

function FindLargestSignalNanoBot(aNanoBots) {

  let max = 0;
  for (let i = 0; i < aNanoBots.length; i++) {
    let nanoBot1 = aNanoBots[i];
    let count = 0;
    for (let j = 0; j < aNanoBots.length; j++) {
      let nanoBot2 = aNanoBots[j];
      let dist = ComputeManhattanDistance(nanoBot1, nanoBot2);

      if (dist <= nanoBot1.r)
        count++;
    }

    if (count > max)
      max = count;
  }

  return max - 1;
}

function SolveUsingSegments(aNanoBots) {

  let segments = [];

  let origin = { x: 0, y: 0, z: 0 };
  for (let i = 0; i < aNanoBots.length; i++) {
    let nanoBot = aNanoBots[i];
    let manhattanDistance = ComputeManhattanDistance(nanoBot, origin);

    let entry1 = { dist: Math.max(manhattanDistance - nanoBot.r, 0), marker: 1 };
    let entry2 = { dist: manhattanDistance + nanoBot.r, marker: -1 };

    segments.push(entry1);
    segments.push(entry2);
  }

  segments.sort(function(aEntry1, aEntry2) {
    if (aEntry1.dist < aEntry2.dist)
      return -1;
    else if (aEntry1.dist > aEntry2.dist)
      return 1;
    else
      return 0;
  });

  let total = { max: 0, count: 0 };
  segments.reduce(function(aTotal, aEntry) {
    aTotal.count += aEntry.marker;
    if (aTotal.count > aTotal.max) {
      aTotal.max = aTotal.count;
      aTotal.dist = aEntry.dist;
    }
    return aTotal;
  }, total);

  return total.dist;
}

var nanoBots = [];

ParseInput(kInputFilePath, nanoBots);

//console.log(nanoBots);

let maxNanoBots = FindLargestSignalNanoBot(nanoBots);

console.log(maxNanoBots);

let minDistMaxSignalPoint = SolveUsingSegments(nanoBots);

console.log(minDistMaxSignalPoint);
