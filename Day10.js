const fs = require('fs');

var rawDay10Input = fs.readFileSync('./Day10Input.txt');

var day10Input = rawDay10Input.toString().split('\r\n');

var parsedInput = [];
var originalInput = [];
for (let i = 0; i < day10Input.length; i++) {
  let line = day10Input[i].split("> ");

  let position = line[0].split("=<")[1].split(",");

  let velocity = line[1].split("=<")[1].split(",");

  let transform = { x: parseInt(position[0]), y: parseInt(position[1]), v_x: parseInt(velocity[0]), v_y: parseInt(velocity[1].substr(0, velocity[1].length - 1)) };
  parsedInput.push(transform);
  originalInput.push( { x: parseInt(position[0]), y: parseInt(position[1]), v_x: parseInt(velocity[0]), v_y: parseInt(velocity[1].substr(0, velocity[1].length - 1)) });
}

function PrintRawInput(aParsedInput) {
  console.log("----------------------------------------------------------");
  for (let i = 0; i < aParsedInput.length; i++)
    console.log(JSON.stringify(aParsedInput[i]));
}

PrintRawInput(parsedInput);

function FindLeftPoint(aParsedInput) {
  let minX = 100000;
  let index = 0;
  for (let j = 0; j < aParsedInput.length; j++) {
    if (parsedInput[j].x < minX) {
      minX = parsedInput[j].x;
      index = j;
    }
  }

  return { x: parsedInput[index].x, y: parsedInput[index].y };
}

function FindTopPoint(aParsedInput) {
  let maxY = -1000000;
  let index = 0;
  for (let j = 1; j < aParsedInput.length; j++) {
    if (parsedInput[j].y > maxY) {
      maxY = parsedInput[j].y;
      index = j;
    }
  }

  return { x: parsedInput[index].x, y: parsedInput[index].y };
}

function FindRightPoint(aParsedInput) {
  let maxX = -100000;
  let index = 0;
  for (let j = 1; j < aParsedInput.length; j++) {
    if (parsedInput[j].x > maxX) {
      maxX = parsedInput[j].x;
      index = j;
    }
  }

  return { x: parsedInput[index].x, y: parsedInput[index].y };
}

function FindBottomPoint(aParsedInput) {
  let minY = 1000000;
  let index = 0;
  for (let j = 0; j < aParsedInput.length; j++) {
    if (parsedInput[j].y < minY) {
      minY = parsedInput[j].y;
      index = j;
    }
  }

  return { x: parsedInput[index].x, y: parsedInput[index].y };
}

let minArea = 100000;
let step = 0;
for (let i = 0; i < 20000; i++) {
  for (let j = 0; j < parsedInput.length; j++) {
    parsedInput[j].x += parsedInput[j].v_x;
    parsedInput[j].y += parsedInput[j].v_y;
  }

  let left = FindLeftPoint(parsedInput);
  let right = FindRightPoint(parsedInput);
  let top = FindTopPoint(parsedInput);
  let bottom = FindBottomPoint(parsedInput);

  let area = Math.abs(left.x - right.x) + Math.abs(top.y - bottom.y);
  if (area < minArea) {
    minArea = area;
    step = i;
  }

  //PrintRawInput(parsedInput);
}

console.log(step);

for (let i = 0; i < step + 1; i++)
  for (let j = 0; j < originalInput.length; j++) {
    originalInput[j].x = originalInput[j].x + originalInput[j].v_x;
    originalInput[j].y = originalInput[j].y + originalInput[j].v_y;
  }

PrintRawInput(originalInput);

var matrix = [];
var screenSize = 300;

for (let x = 0; x < screenSize; x++) {
  if (matrix[x] === undefined)
    matrix[x] = [];
  for (let y = 0; y < screenSize; y++) 
    matrix[x][y] = ".";
}

for (let i = 0; i < originalInput.length; i++)
{
  let screenX = originalInput[i].x;
  let screenY = originalInput[i].y;

  matrix[screenX][screenY] = "#";
}

function PrintMatrix(aMatrix) 
{
  for (let y = 0; y < screenSize; y++) 
  {
    let line = "";
    for (let x = 0; x < screenSize; x++)
      line += aMatrix[x][y];
    console.log(line);
  }
}

PrintMatrix(matrix);