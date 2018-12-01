const fs = require('fs');

var rawDay1Input = fs.readFileSync('./Day1Input.txt');

var day1Input = rawDay1Input.toString().split('\r\n');

var day1InputNumeric = [];

var currentFrequency = 0;
for (i = 0; i < day1Input.length; i++) {
  let numericValue = parseInt(day1Input[i], 10);
  day1InputNumeric.push(numericValue);
  currentFrequency += numericValue;
}

console.log("Resulting frequency: " + currentFrequency);

// Second problem

currentFrequency = 0;
var prevFrequency = [];
var foundFirst = false;
while (!foundFirst) {
  for (i = 0; i < day1InputNumeric.length; i++) {
    currentFrequency += day1InputNumeric[i];

    prevFrequency.push(currentFrequency);
    let pivotIndex = prevFrequency.length - 1;
    while ((pivotIndex > 0) && 
           (prevFrequency[pivotIndex - 1] > prevFrequency[pivotIndex]))
    {
      let temp = prevFrequency[pivotIndex - 1];
      prevFrequency[pivotIndex - 1] = prevFrequency[pivotIndex];
      prevFrequency[pivotIndex] = temp;
      pivotIndex -= 1;
    }

    if (prevFrequency[pivotIndex] == prevFrequency[pivotIndex - 1])
    {
      console.log("First frequency device reaches twice: " + prevFrequency[pivotIndex]);
      foundFirst = true;
      break;
    }
  }
}
