const fs = require('fs');

const kInputFilePath = './Day23Input.txt';

const kSearchDirections = [ { xD: -1, yD: -1, zD: -1 }, 
                            { xD: -1, yD: -1, zD:  1 }, 
                            { xD: -1, yD:  1, zD:  1 },
                            { xD:  1, yD:  1, zD:  1 },
                            { xD:  1, yD:  1, zD: -1 },
                            { xD:  1, yD: -1, zD: -1 },
                            { xD:  1, yD: -1, zD:  1 },
                            { xD: -1, yD:  1, zD: -1 },
                            { xD:  0, yD:  0, zD:  1 },
                            { xD:  0, yD:  1, zD:  0 },
                            { xD:  1, yD:  0, zD:  0 },
                            { xD:  1, yD:  1, zD:  0 },
                            { xD:  0, yD:  1, zD:  1 },
                            { xD:  1, yD:  0, zD:  1 }, ];

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

function GetRandomStep() {
  let seed = Math.floor((Math.random() * 10000) + 1)
  return Math.floor((Math.random() * seed) + 1);
}

function UpdateMin(aMin, aCoordValue, aRadius) {
  let min = Math.min(aCoordValue - aRadius, aMin);

  return min;
}

function UpdateMax(aMax, aCoordValue, aRadius) {
  let max = Math.max(aCoordValue + aRadius, aMax);

  return max;
}

function FindMaxCube(aNanoBots) {

  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = 0;

  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = 0;

  let minZ = Number.MAX_SAFE_INTEGER;
  let maxZ = 0;

  for (let i = 0; i < aNanoBots.length; i++) {
    let nanoBot = aNanoBots[i];

    minX = UpdateMin(minX, nanoBot.x, nanoBot.r);
    maxX = UpdateMax(maxX, nanoBot.x, nanoBot.r);
    minY = UpdateMin(minY, nanoBot.y, nanoBot.r);
    maxY = UpdateMax(maxY, nanoBot.y, nanoBot.r);
    minZ = UpdateMin(minZ, nanoBot.z, nanoBot.r);
    maxZ = UpdateMax(maxZ, nanoBot.z, nanoBot.r);
  }

  return { minX, maxX, minY, maxY, minZ, maxZ };
}

function ComputeHalf(aStart, aEnd) {
  return aStart + Math.round((Math.abs(aEnd) - Math.abs(aStart)) / 2);
}

function SplitCube(aMinMax, aMinMaxArray) {
  let halfX = ComputeHalf(aMinMax.minX, aMinMax.maxX);
  let halfY = ComputeHalf(aMinMax.minY, aMinMax.maxY);
  let halfZ = ComputeHalf(aMinMax.minZ, aMinMax.maxZ);

  console.log( halfX + " " + halfY + " " + halfZ);

  let x = [{ minX: aMinMax.minX, maxX: halfX }, { minX: halfX, maxX: aMinMax.maxX }];
  let y = [{ minY: aMinMax.minY, maxY: halfY }, { minY: halfY, maxY: aMinMax.maxY }];
  let z = [{ minZ: aMinMax.minZ, maxZ: halfZ }, { minZ: halfZ, maxZ: aMinMax.maxZ }];

  for (let i = 0; i < x.length; i++)
    for (let j = 0; j < y.length; j++)
      for (let k = 0; k < z.length; k++)
        aMinMaxArray.push({ ...x[i], ...y[j], ...z[k] });
}

function IsInRange(aMinMax, aNanoBot) {
  let minX = aNanoBot.x;// - aNanoBot.r;
  let maxX = aNanoBot.x;// + aNanoBot.r;
  let minY = aNanoBot.y;// - aNanoBot.r;
  let maxY = aNanoBot.y;// + aNanoBot.r;
  let minZ = aNanoBot.z;// - aNanoBot.r;
  let maxZ = aNanoBot.z;// + aNanoBot.r;

  if ((minX >= aMinMax.minX) && (maxX <= aMinMax.maxX) &&
      (minY >= aMinMax.minY) && (maxY <= aMinMax.maxY) &&
      (minZ >= aMinMax.minZ) && (maxZ <= aMinMax.maxZ))
    return true;
  return false;
}

function CountNanoBotsInCube(aMinMax, aNanoBots) {
  let count = 0;
  for (let i = 0; i < aNanoBots.length; i++) {
    if (IsInRange(aMinMax, aNanoBots[i]))
      count++;
  }

  return count;
}

function IsSize(aMinMax, aSize) {
  let sizeX = Math.abs(aMinMax.maxX - aMinMax.minX);
  let sizeY = Math.abs(aMinMax.maxY - aMinMax.minY);
  let sizeZ = Math.abs(aMinMax.maxZ - aMinMax.minZ);

  //console.log( sizeX + " " + sizeY + " " + sizeZ);

  if ((sizeX < aSize) && (sizeY < aSize) && (sizeZ < aSize))
    return true;
  
  return false;
}

function FindMaxSignalCoord(aMinMax, aNanoBots) {
  let minMax = aMinMax;

  while (true) {

    console.log();

    let octree = [];
    SplitCube(minMax, octree);

    let max = 0;
    let maxIndex = 0;
    for (let i = 0; i < octree.length; i++) {
      let count = CountNanoBotsInCube(octree[i], aNanoBots);
      console.log(count + " " + JSON.stringify(octree[i]));

      if (count > max) {
        max = count;
        maxIndex = i;
      }

      //console.log(count);
    }

    if (max == 0)
      break;

    minMax = octree[maxIndex];

    //console.log(minMax);

    if (IsSize(minMax, 2))
      return minMax;
  }
}

function ComputeBotCount(aPoint, aNanoBots) {
  let count = 0;
  for (let i = 0; i < aNanoBots.length; i++) {
    let nanoBot = aNanoBots[i];
    let dist = ComputeManhattanDistance(nanoBot, aPoint);

    if (dist <= nanoBot.r)
      count++;
  }

  return count;
}

function ComputeMinMax(aPoint, aStepX, aStepY, aStepZ) {
    let minX = aPoint.x - aStepX;
    let maxX = aPoint.x + aStepX;

    let minY = aPoint.y - aStepY;
    let maxY = aPoint.y + aStepY;

    let minZ = aPoint.z - aStepZ;
    let maxZ = aPoint.z + aStepZ;

    return { minX, maxX, minY, maxY, minZ, maxZ };
}

function GetQueueMax(aQueue) {
  if (aQueue.length > 0)
    return aQueue[0].botCount;
  return 0;
}

function CompareQueueEntry(aEntry1, aEntry2) {
  if (aEntry1.botCount < aEntry2.botCount)
    return 1;
  else if (aEntry1.botCount > aEntry2.botCount) 
    return -1;
  else
    return 0;
}  

function RangeSearch(aMinMax, aNanoBots, aQueue) {
  let xStep = Math.round((aMinMax.maxX - aMinMax.minX) / 10);
  let yStep = Math.round((aMinMax.maxY - aMinMax.minY) / 10);
  let zStep = Math.round((aMinMax.maxZ - aMinMax.minZ) / 10);

  console.log(xStep + " " + yStep + " " + zStep);

  let bestPoint;
  for (let x = aMinMax.minX; x < aMinMax.maxX; x += xStep)
    for (let y = aMinMax.minY; y < aMinMax.maxX; y += yStep)
      for (let z = aMinMax.minZ; z < aMinMax.maxZ; z += zStep) {

        let point = { x, y, z};
        //console.log(point);

        let count = ComputeBotCount(point, aNanoBots);
        let max = GetQueueMax(aQueue);

        if ( count > max)
        {
          max = count;
          bestPoint = point;
          console.log(max);

          let minMax = ComputeMinMax(bestPoint, xStep, yStep, zStep);

          aQueue.push({ botCount: max, point: bestPoint, minMax });
          aQueue.sort(CompareQueueEntry);
        }
      }
  
  /*if (max > 0) {
    console.log(max + " " + JSON.stringify(bestPoint));

    let minMax = ComputeMinMax(bestPoint, xStep, yStep, zStep);

    return { botCount: max, point: bestPoint, minMax };
  }

  return { botCount: 0 };*/
}

function SearchDirections(aPoint, aNanoBots, aRange) { 
  let max = 0;
  let bestPoint;
  for (let i = 0; i < kSearchDirections.length; i++) {
    let s = 0;
    let point = { x: aPoint.x, y: aPoint.y, z: aPoint.z};
    while (s < aRange) {
      let count = ComputeBotCount(point, aNanoBots);
      if (count > max)
      {
        max = count;
        bestPoint =  { x: point.x, y: point.y, z: point.z };
        console.log(max);
      }

      point.x += kSearchDirections[i].xD;
      point.y += kSearchDirections[i].yD;
      point.z += kSearchDirections[i].zD;

      s++;
    }
  }

  console.log(max + " " + JSON.stringify(bestPoint));
}

var nanoBots = [];

ParseInput(kInputFilePath, nanoBots);

console.log(nanoBots);

let maxNanoBots = FindLargestSignalNanoBot(nanoBots);

console.log(maxNanoBots);

let minMax = FindMaxCube(nanoBots);

console.log(minMax);

//let ret = FindMaxSignalCoord(minMax, nanoBots);

//console.log(ret);

let i = 0;
let queue = [];
queue.push( { botCount: 0, minMax });
let max = 0;
let bestPoint;
while ( queue.length > 0) {

  let pp = queue.pop();

  if (pp.botCount > max) {
    max = pp.botCount;
    bestPoint = pp.point;
  }

  RangeSearch(pp.minMax, nanoBots, queue);
}

console.log(max);

//let origin = { x: 0, y: 0, z: 0};

console.log(bestPoint);

//SearchDirections(bestPoint, nanoBots, 10000000);

//929 {"x":26203606,"y":30727476,"z":31297501}

let ff = {x:26203606, y:30727476, z:31297501};

ff = { x: 34574432, y: 27408638, z: 23778473 }

SearchDirections(ff, nanoBots, 10000000);
