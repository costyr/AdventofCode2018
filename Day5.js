const fs = require('fs');

var rawDay5Input = fs.readFileSync('./Day5Input.txt');

var day5Input = rawDay5Input.toString().split('');

function UnitsReact(aArray, aIndex) {
  if (aIndex + 1 >= aArray.length)
    return false;

  let char1 = aArray[aIndex];
  let char2 = aArray[aIndex + 1]

  if ((char1 != char2) && (char1.toLowerCase() == char2.toLowerCase()))
    return true;

  return false;
}

function UnitsReact2(aArray, aIndex, aUnit) {
  if (aArray[aIndex] == aUnit.toLowerCase())
    return true;

  return false;
}

function FullReact(aInput) {
  let input = aInput;
  let found = true;
  while (found) {
    let newArray = [];
    found = false;
    for (i = 0; i < input.length; i++) {
      if (UnitsReact(input, i)) {
        i++;
        found = true;
      }
      else
        newArray.push(input[i]);
    }
    input = newArray;
  }

  return input;
}

var fullReaction = FullReact(day5Input);

console.log(fullReaction.toString());
console.log(fullReaction.length);

var rawDay5Input = fs.readFileSync('./Day5Input.txt');

var day5Input = rawDay5Input.toString().split('');

var allUnits = 'abcdefghijklmnoprstuvwxyz';
var min = day5Input.length;
for (j = 0; j < allUnits.length; j++) {
  let newArray = [];

  if (!day5Input.find(function(aElem) { return aElem == allUnits[j]}))
    continue;

  for (i = 0; i < day5Input.length; i++) {
    if (day5Input[i].toLowerCase() != allUnits[j])
      newArray.push(day5Input[i]);
  }

  console.log(newArray.toString() + " min: " + min);

  let gg = FullReact(newArray);

  if (gg.length < min)
    min = gg.length;
}

console.log(min);