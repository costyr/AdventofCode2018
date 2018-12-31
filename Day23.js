const fs = require('fs');

var rawInputFilePath = './Day23Input.txt';

var rawInput = fs.readFileSync(rawInputFilePath);

var dayInput = rawInput.toString().split('\r\n');

var parsedInput = [];

for (let i = 0; i < dayInput.length; i++) {
  let line = dayInput[i].split('>, r=');
  let rawPos = line[0].split('=<')[1].split(',');
  let x = parseInt(rawPos[0]);
  let y = parseInt(rawPos[1]);
  let z = parseInt(rawPos[2]);
  let r = parseInt(line[1]);

  parsedInput.push({ x, y, z, r });
}

console.log(parsedInput);

let nanoBotPos;
let max = 0;
let bb = 0;
for (let i = 0; i < parsedInput.length; i++) {
  let pt1 = parsedInput[i];
  let r = parsedInput[i].r;
  let count = 0;
  let dist = 0;
  let maxDist = 0;
  for (let j = 0; j < parsedInput.length; j++) {
    let pt2 = parsedInput[j];
    dist = Math.abs(pt1.x - pt2.x) + Math.abs(pt1.y - pt2.y) + Math.abs(pt1.z - pt2.z);

    if (dist <= r) 
    {
      count++;
      if (dist > maxDist)
        maxDist = dist;
    }
  }

  if (count > max) {
    nanoBotPos = i;
    max = count;
    bb = maxDist;
    console.log(max + " " + i + " " + JSON.stringify(parsedInput[i]) + " " + maxDist);
  } 
}

function AddPt(aArray, aValue) 
{
  let found = false;
  for (let i = 0; i < aArray.length; i++)
    if (aValue == aArray[i]) 
    {
      found = true
      break;
    }
  if (!found)
    aArray.push(aValue);
}

function GetRandomStep() 
{
  let seed = Math.floor((Math.random() * 100000) + 1) 
  return Math.floor((Math.random() * seed) + 1);
}

console.log(parsedInput[nanoBotPos]);
console.log(parsedInput[nanoBotPos].r);
console.log(max - 1);
console.log(bb);

let b = parsedInput[nanoBotPos];

let rr = parsedInput[nanoBotPos].r / 2;

let maxX = b.x + rr;
let minX = b.x;
let maxY = b.y + rr;
let minY = b.y;
let maxZ = b.z + rr;
let minZ = b.z;

/*let xPts = [];
let yPts = [];
let zPts = [];
for (let i = 0; i < parsedInput.length; i++) {
  let pt = parsedInput[i];

  AddPt(xPts, pt.x);
  AddPt(yPts, pt.y);
  AddPt(zPts, pt.z);

  if (pt.x > maxX)
    maxX = pt.x
  if (pt.x < minX)
    minX = pt.x;
  if (pt.y > maxY)
    maxY = pt.y;
  if (pt.y < minY)
    minY = pt.y;
  if (pt.z > maxZ)
    maxZ = pt.z;
  if (pt.z < minZ)
    minZ = pt.z;
}*/

console.log(minX + "..." + maxX);
console.log(minY + "..." + maxY);
console.log(minZ + "..." + maxZ);
/*
console.log(xPts.length);
console.log(yPts.length);
console.log(zPts.length);

xPts.sort();
yPts.sort();
zPts.sort();*/

let maxInRange = 0;
let ptWithMaxInRange;
let minDist = Number.MAX_SAFE_INTEGER;
//minX = 26336981;
//maxX = minX + 10000;

//minZ = 30949237;
//maxZ = minZ + 10000;
//z = minZ;
//x = 26336380;
//y = 31209117;
//minY = 31209117;
//maxY = minY + 2000;
//for (let x = minX; x < maxX; x += Math.floor((Math.random() * 1000000) + 1))
for (let y = minY; y < maxY; y += GetRandomStep()) 
 for (let z = minZ; z < maxZ; z += GetRandomStep())
  for (let x = minX; x < maxX; x += GetRandomStep()) { 
      //console.log(x + " " + y + " " + z);
      let count = 0;
      let pt1 = {x: x, y: y, z: z };
      for (let j = 0; j < parsedInput.length; j++) {
        let pt = parsedInput[j];
        let dist = Math.abs(pt.x - pt1.x) + Math.abs(pt.y - pt1.y) + Math.abs(pt.z - pt1.z);

        if (dist <= pt.r)
          count++;
      }

      if (count >= maxInRange) {
        ptWithMaxInRange = { x: pt1.x, y: pt1.y, z: pt1.z };
        minDist = Math.abs(pt1.x) + Math.abs(pt1.y) + Math.abs(pt1.z);
        maxInRange = count;
        console.log(JSON.stringify(ptWithMaxInRange) + ": " + maxInRange + " " + minDist);
      }
    }

console.log(ptWithMaxInRange);
