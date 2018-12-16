const fs = require('fs');

var rawDay15Input = fs.readFileSync('./Day15TestInput.txt');

var day15Input = rawDay15Input.toString().split('\r\n');

var cavesMap = [];
var elfsAndGoblins = [];
for (let i = 0; i < day15Input.length; i++) {
  if (cavesMap[i] === undefined)
  cavesMap[i] = [];

  cavesMap[i] = day15Input[i].split('');

  for (let j = 0; j < cavesMap[i].length; j++) {
    let mapSymbol = cavesMap[i][j];
    if ((mapSymbol == 'E') || (mapSymbol == 'G')) {
      elfsAndGoblins.push({ type: mapSymbol, x: j, y: i });
        cavesMap[i][j] = '.';
    }
  }
}

function PrintCavesMap(aCavesMap) {
  for (let x = 0; x < aCavesMap.length; x++) {
    let line = "";
    for (let y = 0; y < aCavesMap[x].length; y++)
      line += aCavesMap[x][y];

    console.log(line);
  }
}

console.log(elfsAndGoblins);
PrintCavesMap(cavesMap);