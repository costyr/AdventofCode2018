const fs = require('fs');
const util = require('./Util.js');

var rawDay17InputFilePath = './Day17Input.txt';

var rawDay17Input = fs.readFileSync(rawDay17InputFilePath);

var day17Input = rawDay17Input.toString().split('\r\n');

var waterStart = { x: 500, y: 0 };

var xMin = 1000000;
var xMax = 0;
var yMin = 1000000;
var yMax = 0;
function ParseXY(aRawText) {
  let parsed = aRawText.split('=');

  let interval = parsed[1].split('..');
  let start;
  let end;
  if (interval.length > 1) {
    start = parseInt(interval[0]);
    end = parseInt(interval[1]);
  }
  else
    start = parseInt(interval[0]);

  return (parsed[0] == 'x') ?
    (end == undefined) ? { x: start } : { x: start, xEnd: end } :
    (end == undefined) ? { y: start } : { y: start, yEnd: end };
}

var parsedInput = [];
for (let i = 0; i < day17Input.length; i++) {
  let line = day17Input[i].split(', ');
  let first = ParseXY(line[0]);
  let second = ParseXY(line[1]);

  let entry = { ...first, ...second };

  if (entry.x < xMin)
    xMin = entry.x;

  if (entry.x > xMax)
    xMax = entry.x;

  if ((entry.xEnd !== undefined) && entry.xEnd > xMax)
    xMax = entry.xEnd;

  if (entry.y < yMin)
    yMin = entry.y;

  if (entry.y > yMax)
    yMax = entry.y;

  if ((entry.yEnd !== undefined) && entry.yEnd > yMax)
    yMax = entry.yEnd;

  parsedInput.push(entry);
}

console.log(parsedInput);
console.log(xMin + " " + xMax + " " + yMin + " " + yMax);

var width = xMax - xMin + 3;
var height = yMax + 1;

var groundMap = [];
for (let y = 0; y < height; y++) {
  groundMap[y] = [];
  for (let x = 0; x < width; x++)
    groundMap[y][x] = '.';
}

groundMap[waterStart.y][waterStart.x - xMin + 1] = '+';

for (let i = 0; i < parsedInput.length; i++) {
  let clayBatch = parsedInput[i];

  if (clayBatch.xEnd !== undefined) {
    for (let x = clayBatch.x; x <= clayBatch.xEnd; x++)
      groundMap[clayBatch.y][x - xMin + 1] = '#';
  }
  else if (clayBatch.yEnd !== undefined) {
    for (let y = clayBatch.y; y <= clayBatch.yEnd; y++)
      groundMap[y][clayBatch.x - xMin + 1] = '#';
  }
  else
    groundMap[clayBatch.y][clayBatch.x - xMin + 1] = '#';
}

function RenderMap(aGroundMap) {
  let mapAsString = "";
  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++)
      line += aGroundMap[y][x];

    mapAsString += line + "\r\n";
  }

  return mapAsString;
}

function RenderMapToFile(aGroundMap, aFilePath) {
  fs.writeFileSync(aFilePath, RenderMap(aGroundMap));
}

console.log(RenderMap(groundMap));

var mapFilePath = util.ComputeMapFilePath(rawDay17InputFilePath);

console.log(mapFilePath);
RenderMapToFile(groundMap, mapFilePath);

function CanFlowDown(aGroundMap, aX, aY) {
  if (aY + 1 > yMax)
    return false;

  let xMap = aX - xMin + 1;
  let down = aGroundMap[aY + 1][xMap];

  return (down == '.');
}

function CanFlowRight(aGroundMap, aX, aY, aTestDown) {

  if (aY + 1 > yMax)
    return false;

  let xMap = aX - xMin + 1;
  let right = aGroundMap[aY][xMap + 1];

  if (right == '.') {
    if (!aTestDown)
      return true;

    let down = aGroundMap[aY + 1][xMap];
    if ((down == '#') || (down == '~'))
      return true;
  }

  return false;
}

function CanFlowLeft(aGroundMap, aX, aY, aTestDown) {
  if (aY + 1 > yMax)
    return false;

  let xMap = aX - xMin + 1;
  let left = aGroundMap[aY][xMap - 1];

  if (left == '.') {
    if (!aTestDown)
      return true;

    let down = aGroundMap[aY + 1][xMap];
    if ((down == '#') || (down == '~'))
      return true;
  }

  return false;
}

function QueueLeft(aQueue, aGroundMap, aX, aY) {
  if (CanFlowLeft(aGroundMap, aX, aY, false)) {
    let x = aX;
    x--;
    aQueue.push({ x, y: aY });
  }
}

function QueueRight(aQueue, aGroundMap, aX, aY) {
  if (CanFlowRight(aGroundMap, aX, aY, false)) {
    let x = aX;
    x++;
    aQueue.push({ x, y: aY });
  }
}

function IsValidQueuePos(aWatherPos, aGroundMap) {
  let xMap = aWatherPos.x - xMin + 1;
  let current = aGroundMap[aWatherPos.y][xMap];
  let down = aWatherPos.y < yMax ? aGroundMap[aWatherPos.y + 1][xMap] : '.';

  let leftWaterCount = 0;
  for (let i = xMap - 1; i > 0; i--)
    if (aGroundMap[aWatherPos.y][i] == '|')
      leftWaterCount++;
    else
      break;

  let rightWaterCount = 0;
  for (let i = xMap + 1; i < width; i++)
    if (aGroundMap[aWatherPos.y][i] == '|')
      rightWaterCount++;
    else
      break;

  let hasGround = (down == '#') || (down == '~');
  let hasPressure = false;

  if (leftWaterCount > 1)
    hasPressure = (aGroundMap[aWatherPos.y - 1][xMap - 1] == '|');
  else if (rightWaterCount > 1)
    hasPressure = (aGroundMap[aWatherPos.y - 1][xMap + 1] == '|');;

  return (current == '.') && (hasGround || hasPressure);
}

function GetWatherNextPos(aWatherPos, aGroundMap, aQueue) {
  let x = aWatherPos.x;
  let y = aWatherPos.y;

  if (CanFlowDown(aGroundMap, x, y)) {
    QueueLeft(aQueue, aGroundMap, x, y);
    QueueRight(aQueue, aGroundMap, x, y);
    y++;
  }
  else if (CanFlowRight(aGroundMap, x, y, true)) {
    QueueLeft(aQueue, aGroundMap, x, y);
    x++;
  }
  else if (CanFlowLeft(aGroundMap, x, y, true)) {
    QueueRight(aGroundMap, aQueue, x, y);
    x--;
  }
  else {
    StabilizeWater({ x, y }, aGroundMap);

    let queuePos;
    do {
      queuePos = aQueue.pop();
      if (queuePos === undefined)
        break;

      x = queuePos.x;
      y = queuePos.y;
    } while (!IsValidQueuePos(queuePos, aGroundMap));

    if (aQueue.length == 0) {
      x = -1;
      y = -1;
    }
  }

  return { x, y };
}

function StabilizeWater(aWatherPos, aGroundMap) {
  let y = aWatherPos.y;
  let x = aWatherPos.x - xMin + 1;

  let clayRightPos = -1;
  for (let i = x; i < width; i++)
    if (aGroundMap[y][i] == '#') {
      clayRightPos = i;
      break;
    }

  let clayLeftPos = -1;
  for (let i = x; i > 0; i--)
    if (aGroundMap[y][i] == '#') {
      clayLeftPos = i;
      break;
    }

  if ((clayLeftPos == -1) ||
    (clayRightPos == -1))
    return false;

  let hasSand = false;
  for (let i = clayLeftPos + 1; i < clayRightPos; i++)
    if (aGroundMap[y][i] == '.')
      hasSand = true;

  if (hasSand)
    return false;

  for (let i = clayLeftPos + 1; i < clayRightPos; i++)
    aGroundMap[y][i] = '~';

  return true;
}

function GetWatherCount(aGroundMap) {
  let count = 0;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if ((aGroundMap[y][x] == '~') ||
        (aGroundMap[y][x] == '|'))
        count++;

  return count;
}

function FillWithWater(aWaterStart, aGroundMap) {
  let queue = [];
  let pos = { x: aWaterStart.x, y: aWaterStart.y, d: 0 };
  do {
    pos = GetWatherNextPos(pos, aGroundMap, queue);

    if (pos.y == -1)
      break;

    let mapX = pos.x - xMin + 1;
    let mapY = pos.y;
    aGroundMap[mapY][mapX] = '|';

  } while (true);

  console.log(RenderMap(aGroundMap));
  console.log(GetWatherCount(aGroundMap));
  RenderMapToFile(groundMap, mapFilePath);
}

FillWithWater(waterStart, groundMap);
