const fs = require('fs');

var rawInputFilePath = './Day25Input.txt';

var rawInput = fs.readFileSync(rawInputFilePath);

var dayInput = rawInput.toString().split('\r\n');

var parsedInput = [];
for (let i = 0; i < dayInput.length; i++) {
  let line = dayInput[i].split(',');
  parsedInput.push({ x: parseInt(line[0]), y: parseInt(line[1]), z: parseInt(line[2]), t: parseInt(line[3]) });
}

console.log(parsedInput);

var constellations = [];

function ComputeDist(aStar1, aStar2) {
  return Math.abs(aStar1.x - aStar2.x) + Math.abs(aStar1.y - aStar2.y) + Math.abs(aStar1.z - aStar2.z) + Math.abs(aStar1.t - aStar2.t);
}

function AddToConstelletion(aStar, aConstellations) {
  for (let i = 0; i < aConstellations.length; i++) {
    if (aConstellations[i] === undefined)
      continue;

    for (let j = 0; j < aConstellations[i].length; j++) {
      let dist = ComputeDist(aStar, aConstellations[i][j]);
      if (dist <= 3) {
        aConstellations[i].push(aStar);
        return true;
      }
    }
  }

  return false;
}

function MergeConstelletions(aConstellation1, aConstellation2) {
  for (let i = 0; i < aConstellation1.length; i++)
    for (let j = 0; j < aConstellation2.length; j++) {
      let dist = ComputeDist(aConstellation1[i], aConstellation2[j]);
      if (dist <= 3)
        return { ret: true, newConstellation: aConstellation1.concat(aConstellation2) };
    }

  return { ret: false };
}

for (let i = 0; i < parsedInput.length; i++) {
  if (!AddToConstelletion(parsedInput[i], constellations)) {
    let newConstellation = [];
    newConstellation.push(parsedInput[i]);
    constellations.push(newConstellation);
  }
}

while (true) {
  let constellationsAdded = false;
  for (let i = 0; i < constellations.length; i++)
    for (let j = i + 1; j < constellations.length; j++) {
      let d = MergeConstelletions(constellations[i], constellations[j])
      if (d.ret) {
        constellations[i] = d.newConstellation;
        constellations[j] = [];
        constellationsAdded = true;
      }
    }

  if (!constellationsAdded)
    break;
}

var count = 0;
for (let i = 0; i < constellations.length; i++)
  if (constellations[i].length > 0)
    count ++;

console.log(count);