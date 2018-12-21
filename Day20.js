const fs = require('fs');
const util = require('./Util.js');

var inputFilePath = './Day20Input.txt';
var day20Input = fs.readFileSync(inputFilePath);

console.log(day20Input.toString());

let directionsMap = [];

let startPos = { x: 0, y: 0, c: 0 };

directionsMap.push({ ...startPos, r: 'x' });

function AddDirection(aDirectionsMap, aDirectionEntry) 
{
  let found = false;
  for (let i = 0; i < aDirectionsMap.length; i++)
    if ((aDirectionsMap[i].x == aDirectionEntry.x) && 
        (aDirectionsMap[i].y == aDirectionEntry.y) &&
        (aDirectionsMap[i].r == aDirectionEntry.r)) 
    {
      found = true;
      break;
    }
  
  if (!found)
    aDirectionsMap.push(aDirectionEntry);
}

function MapDirection(aDirection, aCurrentPos, aDirectionsMap) 
{
  let x = aCurrentPos.x;
  let y = aCurrentPos.y;
  let c = aCurrentPos.c;
  if (aDirection == 'E') {
    x++;
    AddDirection(aDirectionsMap, { x: x, y: y, r: '|' });
    x++;
    c++;
    AddDirection(aDirectionsMap, { x: x, y: y, r: '.', c: c });
  }
  else if (aDirection == 'W') {
    x--;
    AddDirection(aDirectionsMap, { x: x, y: y, r: '|' });
    x--;
    c++;
    AddDirection(aDirectionsMap, { x: x, y: y, r: '.', c: c });
  }
  else if (aDirection == 'N') {
    y++;
    AddDirection(aDirectionsMap, { x: x, y: y, r: '-' });
    y++;
    c++;
    AddDirection(aDirectionsMap, { x: x, y: y, r: '.', c: c });
  }
  else if (aDirection == 'S') {
    y--;
    AddDirection(aDirectionsMap, { x: x, y: y, r: '-' });
    y--;
    c++;
    AddDirection(aDirectionsMap, { x: x, y: y, r: '.', c });
  }

  return { x, y, c };
}

function MapOptDirections(aCurrentPos, aOptDirections, aDirectionsMap) {
  let current; 
  let stack = [];
  stack.push(aCurrentPos);
  for (let i = 0; i < aOptDirections.o.length; i++) {
    let directions = aOptDirections.o[i];
    if (directions.o === undefined) {

      if (directions.d === undefined) 
      {
        current = stack[stack.length - 1];
        for (let j = 0; j < directions.length; j++) {
          current = MapDirection(directions[j], current, aDirectionsMap);
        }
        if (stack.length > 1)
          stack.pop();
      }
      else
      {
        stack.push(current);
        let detoor = directions.d;
        let detoorCurrent = current;
        for (let j = 0; j < detoor.length; j++) 
          detoorCurrent = MapDirection(detoor[j], detoorCurrent, aDirectionsMap);
      }
    }
    else 
    {
      MapOptDirections(current, directions, aDirectionsMap);
    }
  }
}

function MapDirections(aCurrentPos, aDirections, aDirectionsMap) {

  let x = aCurrentPos.x;
  let y = aCurrentPos.y;
  let c = aCurrentPos.c;
  for (let i = 0; i < aDirections.length; i++) {
    let directions = aDirections[i];

    if (directions.o === undefined) {
      for (let j = 0; j < directions.length; j++) {
        let newCurrent = MapDirection(directions[j], {x, y, c}, aDirectionsMap);
        x = newCurrent.x;
        y = newCurrent.y;
        c = newCurrent.c;
      }
    }
    else 
    {
      MapOptDirections({ x, y, c}, directions, aDirectionsMap);
    }
  }

  return { x, y, c };
}

function ParseDirections(aDirections) {
  let parsedDirections = [];

  let chunk = "";
  let stack = [];
  for (let i = 0; i < aDirections.length; i++) {
    let current = aDirections[i];
    if (current == '(') {
      if (stack.length > 0) {
        var top = stack[stack.length - 1];
        top.push(chunk);
      }
      else
        parsedDirections.push(chunk);
      stack.push([]);
      chunk = "";
    }
    else if (current == ')') {
      let opt = stack.pop();
      if (chunk.length > 0) {
        opt.push(chunk);
        chunk = "";
      }
      if (stack.length > 0) {
        var top = stack[stack.length - 1];
        top.push({ o: opt });
      }
      else
        parsedDirections.push({ o: opt });
    }
    else if (current == '|') {
      if (aDirections[i + 1] == ')') {
        stack.pop();
        var top = stack[stack.length - 1];
        top.push({ d: chunk});
        chunk = "";
        i++;
      }
      else {
        var top = stack[stack.length - 1];
        top.push(chunk);
        chunk = "";
      }
    }
    else if (current == '$') {

    }
    else {
      if (current != '^')
        chunk += current;
    }
  }

  console.log(JSON.stringify(parsedDirections));

  return parsedDirections;
}

var pathDirections = day20Input.toString().substr(1);
pathDirections = pathDirections.substr(0, pathDirections.length - 1);

console.log(pathDirections);

var parsedDirections = ParseDirections(day20Input.toString().split(''));

MapDirections(startPos, parsedDirections, directionsMap);

console.log(directionsMap);

function GetMinMax(aDirectionsMap) {
  let minX = 100000;
  let maxX = 0;
  let minY = 100000;
  let maxY = 0;

  for (let i = 0; i < aDirectionsMap.length; i++) {
    if (aDirectionsMap[i].x < minX)
      minX = aDirectionsMap[i].x;
    if (aDirectionsMap[i].x > maxX)
      maxX = aDirectionsMap[i].x;
    if (aDirectionsMap[i].y < minY)
      minY = aDirectionsMap[i].y;
    if (aDirectionsMap[i].y > maxY)
      maxY = aDirectionsMap[i].y;
  }

  return { minX, maxX, minY, maxY };
}

function CreateAreaMap(aDirectionsMap) {
  let minMax = GetMinMax(aDirectionsMap);

  let width = Math.abs(minMax.maxX - minMax.minX) + 3;
  let height = Math.abs(minMax.maxY - minMax.minY) + 3;

  let areaMap = [];
  for (let j = 0; j < height; j++) {
    if (areaMap[j] === undefined)
      areaMap[j] = [];
    for (let i = 0; i < width; i++)
      areaMap[j][i] = '#';
  }

  for (let i = 0; i < aDirectionsMap.length; i++) {
    let x = Math.abs(minMax.minX) + aDirectionsMap[i].x + 1;
    let y = minMax.maxY - aDirectionsMap[i].y + 1;
    areaMap[y][x] = aDirectionsMap[i].r;
  }

  return areaMap;
}

function PrintMap(aAreaMap) {
  let printedMap = "";
  for (let j = 0; j < aAreaMap.length; j++) {
    let line = "";
    for (let i = 0; i < aAreaMap[j].length; i++)
      line += aAreaMap[j][i];
    printedMap += line;
    printedMap += "\r\n";
  }

  return printedMap;
}

var areaMap = CreateAreaMap(directionsMap);

console.log(PrintMap(areaMap));
fs.writeFileSync(util.ComputeMapFilePath(inputFilePath), PrintMap(areaMap));

var maxDoors = 0;
var above100DoorsCount  = 0;
for (let i = 0; i < directionsMap.length; i++) 
{
  if ((directionsMap[i].c !== undefined) && (directionsMap[i].c > maxDoors))
    maxDoors = directionsMap[i].c;
  if (directionsMap[i].c >= 1000)
    above100DoorsCount ++;
}

console.log(maxDoors);
console.log(above100DoorsCount);
