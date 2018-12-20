const fs = require('fs');

var day20Input = fs.readFileSync('./Day20TestInput2.txt');

console.log(day20Input.toString());

let directionsMap = [];

let startPos = { x: 0, y: 0 };

directionsMap.push({ ...startPos, r: 'x' });

function MapDirections(aCurrentPos, aDirections, aDirectionsMap) {

  let x = aCurrentPos.x;
  let y = aCurrentPos.y;
  for (let i = 0; i < aDirections.length; i++) {
    let directions = aDirections[i];

    if (directions.o === undefined) {
      for (let j = 0; j < directions.length; j++) {
        let direction = directions[j];
        if (direction == 'E') {
          x++;
          directionsMap.push({ x: x, y: y, r: '|' });
          x++;
          directionsMap.push({ x: x, y: y, r: '.' });
        }
        else if (direction == 'W') {
          x--;
          directionsMap.push({ x: x, y: y, r: '|' });
          x--;
          directionsMap.push({ x: x, y: y, r: '.' });
        }
        else if (direction == 'N') {
          y++;
          directionsMap.push({ x: x, y: y, r: '-' });
          y++;
          directionsMap.push({ x: x, y: y, r: '.' });
        }
        else if (direction == 'S') {
          y--;
          directionsMap.push({ x: x, y: y, r: '-' });
          y--;
          directionsMap.push({ x: x, y: y, r: '.' });
        }
      }
    }
    else 
    {
      for (let j = 0; j < directions.o.length; j++) 
      {
        let option = directions.o[j];
        MapDirections({ x, y }, option, aDirectionsMap);
      }
    }
  }
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
      var top = stack[stack.length - 1];
      top.push(chunk);
      chunk = "";
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