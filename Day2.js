const fs = require('fs');

var rawDay2Input = fs.readFileSync('./Day2Input.txt');

var day2Input = rawDay2Input.toString().split('\r\n');

var twoCount = 0;
var threeCount = 0;

for (i = 0; i < day2Input.length; i++) {
  let word = day2Input[i].split('').sort();

  let pivot = 0;
  let j = pivot + 1;
  let wordTwoCount = 1;
  let wordTwoPos = -1;
  let wordThreeCount = 1;
  let wordThreePos = -1;
  while (((wordTwoCount < 2) && (wordThreeCount < 3)) || (j < word.length)) {
    if (word[pivot] == word[j]) {
      if (wordTwoCount < 2) {
        wordTwoCount++;
        wordTwoPos = pivot;
      }
      if (wordThreeCount < 3) {
        wordThreeCount++;
        if (wordThreeCount == 3) {
          wordThreePos = pivot;
          if (wordTwoPos == wordThreePos) {
            wordTwoPos = -1;
            wordTwoCount = 1;
          }
        }
      }
    }
    else {
      pivot = j;
      if (wordThreeCount == 2)
        wordThreeCount = 1;
    }
    j++;
  }

  if (wordTwoCount == 2)
    twoCount++;
  if (wordThreeCount == 3)
    threeCount++;
}

console.log("Checksum: ", twoCount * threeCount);

// Second problem

for (i = 0; i < day2Input.length; i++) {
  let s1 = day2Input[i];
  let found = false;
  for (j = i + 1; j < day2Input.length; j++) {
    let s2 = day2Input[j];
    let diffCount = 0;
    let pos = 0;
    for (k = 0; k < s1.length; k++) 
    {
      if (s1[k] != s2[k]) 
      {
        diffCount++;
        pos = k;
      }
    }
    if (diffCount == 1) {
      console.log("Max common letters: " + s1.substr(0, pos) + s2.substr(pos + 1, s2.length));
      found = true;
      break;
    }
  }

  if (found)
    break;
}
