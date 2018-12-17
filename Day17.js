const fs = require('fs');

var rawDay17InputFilePath = './Day17TestInput.txt';

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

function ComputeMapFilePath(aFilePath) {
  let index = aFilePath.lastIndexOf('.');
  let mapFilePath = aFilePath.substr(0, index);
  mapFilePath += "Map.txt";

  return mapFilePath;
}

console.log(RenderMap(groundMap));

var mapFilePath = ComputeMapFilePath(rawDay17InputFilePath);

console.log(mapFilePath);
RenderMapToFile(groundMap, mapFilePath);

function CanFlowDown(aDownSymbol) {
  return (aDownSymbol == '.');
}

function CanFlowRight(aLeftSymbol, aRightSymbol, aDirection) {
  if (aRightSymbol == '.')
    return true;

  if (aRightSymbol == '|') {
    if (aLeftSymbol == '.')
      return false;

    if ((aDirection == 0) && (aLeftSymbol == '#'))
      return false;

    return true;
  }

  return false;
}

function CanFlowLeft(aLeftSymbol, aRightSymbol, aDirection) {
  if (aLeftSymbol == '.')
    return true;

  if (aLeftSymbol == '|') {
    if (aRightSymbol == '.')
      return false;

    if ((aDirection == 0) && (aRightSymbol == '#'))
      return false;

    return true;
  }

  return false;
}



function GetWatherNextPos(aWatherPos, aGroundMap, aQueue) {
  let x = aWatherPos.x;
  let y = aWatherPos.y;
  let d = aWatherPos.d;

  let xMap = x - xMin + 1;

  let down = aGroundMap[y + 1][xMap];
  let right = aGroundMap[y][xMap + 1];
  let left = aGroundMap[y][xMap - 1];

  if (CanFlowDown(down)) {
    y++;
    d = 0;
  }
  else if (CanFlowRight(left, right, d)) {
    if (CanFlowLeft(left, right, d)) {
      let lx = x;
      lx--;
      aQueue.push({ x: lx, y, d });
    }
    x++;
  }
  else if (CanFlowLeft(left, right, d)) {
    if (CanFlowRight(left, right, d)) {
      let rx = x;
      rx--;
      aQueue.push({ rx, y, d });
    }
    x--;
  }
  else {
    y--;
    d = 1;
  }

  let elem = aQueue.find(function(aValue) {
    if (aValue.x = x && aValue.y == y)
      return true;
    return false;    
  });

  if (elem !== undefined)
  {
    let elemPos = aQueue.indexOf(elem);
    aQueue.splice(elemPos, 1);
  }

  return { x, y };
}

function StabilizeWater(aWatherPos, aGroundMap) {
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if ((aWatherPos.y < y) && (aGroundMap[y][x - xMin + 1] == '|'))
        aGroundMap[y][x - xMin + 1] == '~';
}

function FillWithWater(aWaterStart, aGroundMap) {
  let count = 100;
  let queue = [];
  queue.push({ x: aWaterStart.x, y: aWaterStart.y, d: 0 });
  while (queue.length > 0) {
    let pos = queue.pop();
    while (pos.y < yMax && count > 0) {
      pos = GetWatherNextPos(pos, aGroundMap, queue);

      let mapX = pos.x - xMin + 1;
      let mapY = pos.y;

      if (aGroundMap[mapY][mapX] == '|')
        aGroundMap[mapY][mapX] = '~'
      else
        aGroundMap[mapY][mapX] = '|';

      StabilizeWater(pos, aGroundMap);

      console.log(RenderMap(aGroundMap));
      count--;
    }
  }
}

FillWithWater(waterStart, groundMap);