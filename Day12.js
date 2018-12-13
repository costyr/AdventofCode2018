const fs = require('fs');

var rawDay12Input = fs.readFileSync('./Day12Input.txt');

var day12Input = rawDay12Input.toString().split('\r\n');

var defaultStartPadding = "....";
var endPadding = "....";
var initialState = defaultStartPadding;
const kInitialState = "initial state:";
var transforms = [];
for (let i = 0; i < day12Input.length; i++) {
  let line = day12Input[i];

  if (line.length == 0)
    continue;

  if (line.startsWith(kInitialState))
    initialState += line.substr(kInitialState.length).trim();
  else {
    let rawTransform = line.split(" => ");
    transforms[rawTransform[0]] = rawTransform[1];
  }
}

function ComputeSum(aGeneration, aIndexOffset) {
  let sum = 0;
  for (let i = 0; i < aGeneration.length; i++)
    if (aGeneration[i] == '#')
      sum += i - aIndexOffset;
  return sum;
}

console.log(initialState);
console.log(transforms);

var indexOffset = 4;

console.log(" 0: " + initialState);
var currentGeneration = initialState + "....";
var lastSum = 0;
var sumDiff = 0;
var gen20Sum = 0;
var lastPrintedGeneration = "";
let firstConstDiffSum = 0;
let firstConstDiffGen = 0;
for (let gen = 0; gen < 120; gen++) {
  let newGeneration = "";
  let hh = "";
  for (let i = 0; i < currentGeneration.length; i++) {
    let found = false;
    for (let key in transforms)
      if (currentGeneration.startsWith(key, i)) {
        found = true;
        hh = transforms[key];
        break;
      }

    newGeneration += found ? hh : ".";
  }

  let offsetSwitched = newGeneration.startsWith("#");

  currentGeneration = defaultStartPadding + newGeneration + endPadding;
  indexOffset += offsetSwitched ? 1 : 2;

  let firstPos = currentGeneration.indexOf("#");
  let lastPos = currentGeneration.lastIndexOf('#');
  let printedGeneration = currentGeneration.substr(0, lastPos + 3);
  printedGeneration = printedGeneration.substr(firstPos);

  let currentSum = ComputeSum(currentGeneration, indexOffset);
  sumDiff = currentSum - lastSum;

  if (lastPrintedGeneration == printedGeneration) 
  {
    firstConstDiffGen = gen;
    firstConstDiffSum = lastSum;
  }

  lastPrintedGeneration = printedGeneration;
  lastSum = currentSum;

  let padding = "";
  if (gen < 9)
    padding += "  ";
  else if (gen < 99)
    padding += " ";

  if ((gen + 1) == 20)
    gen20Sum = currentSum;

  console.log(padding + (gen + 1) + ": " + printedGeneration + "(" + (gen + 1) + ") Sum: " + currentSum +  " Sum Diff: " + sumDiff);
}

console.log(gen20Sum);

let targetGen = 50000000000;

console.log(firstConstDiffSum + (targetGen - firstConstDiffGen) * sumDiff);