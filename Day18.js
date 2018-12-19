const fs = require('fs');

var rawDay18Input = fs.readFileSync('./Day18Input.txt');

var day18Input = rawDay18Input.toString().split('\r\n');

var acres = [];
for (let i = 0; i < day18Input.length; i++) {
  acres[i] = day18Input[i].split('');
}

function PrintAcres(aAcres) {
  for (let i = 0; i < aAcres.length; i++) {
    let line = "";
    for (let j = 0; j < aAcres[i].length; j++)
      line += aAcres[i][j];
    console.log(line);
  }
}

PrintAcres(acres);

function GetAdjacents(aX, aY, aAcres) {
  let adjacents = [];

  if (aX - 1 >= 0) {
    adjacents.push(aAcres[aY][aX - 1]); // left

    if (aY - 1 >= 0)
      adjacents.push(aAcres[aY - 1][aX - 1]);

    if (aY + 1 < aAcres.length)
      adjacents.push(aAcres[aY + 1][aX - 1]);
  }

  if (aX + 1 < aAcres.length) {
    adjacents.push(aAcres[aY][aX + 1]); // right

    if (aY - 1 >= 0)
      adjacents.push(aAcres[aY - 1][aX + 1]);

    if (aY + 1 < aAcres.length)
      adjacents.push(aAcres[aY + 1][aX + 1]);
  }

  if (aY - 1 >= 0)
    adjacents.push(aAcres[aY - 1][aX]); // top

  if (aY + 1 < aAcres.length)
    adjacents.push(aAcres[aY + 1][aX]); //down

  return adjacents;
}

function GetAdjacentsCount(aX, aY, aAcres) {
  let open = 0;
  let wooded = 0;
  let lumberyard = 0;

  let adjacents = GetAdjacents(aX, aY, aAcres);

  for (let i = 0; i < adjacents.length; i++)
    if (adjacents[i] == '.')
      open++;
    else if (adjacents[i] == '|')
      wooded++;
    else if (adjacents[i] == '#')
      lumberyard++;

  return { open, wooded, lumberyard };
}

function ComputeWoodResource(aAcres) {
  let woodCount = 0;
  let lumberyardCount = 0;
  for (let i = 0; i < acres.length; i++)
    for (let j = 0; j < acres[i].length; j++)
      if (acres[i][j] == '|')
        woodCount++;
      else if (acres[i][j] == '#')
        lumberyardCount++;
  return woodCount * lumberyardCount
}

var tenMinutesTarget = 10;
var minutesCount = 100000;
var resMap = [];
for (let m = 0; m < minutesCount; m++) {
  let newAcres = [];
  for (let i = 0; i < acres.length; i++) {
    if (newAcres[i] === undefined)
      newAcres[i] = [];

    for (let j = 0; j < acres[i].length; j++) {
      let acre = acres[i][j];
      let adjCount = GetAdjacentsCount(j, i, acres);

      if (acre == '.') {
        if (adjCount.wooded >= 3)
          newAcres[i][j] = '|';
        else
          newAcres[i][j] = '.';
      }
      else if (acre == '|') {
        if (adjCount.lumberyard >= 3)
          newAcres[i][j] = '#'
        else
          newAcres[i][j] = '|'
      }
      else if (acre == '#') {
        if ((adjCount.lumberyard >= 1) &&
          (adjCount.wooded >= 1)) {
          newAcres[i][j] = '#'
        }
        else
          newAcres[i][j] = '.';
      }
    }
  }

  acres = newAcres;

  let resCount = ComputeWoodResource(acres);

  if (m == tenMinutesTarget - 1) 
  {
    console.log();
    PrintAcres(acres);
    console.log("Resource value after 10 minutes: " + resCount);
  }

  let key = resCount;
  if (resMap[key] === undefined)
    resMap[key] = { count: 1, startMinute: m, minute: m, freq: [] };
  else {
    let elem = resMap[key];

    let newMinute = m - elem.minute;

    if (elem.freq.indexOf(newMinute) == -1)
      elem.freq.push(newMinute);

    elem.count++;
    elem.minute = m;

    resMap[key] = elem;
  }
}

let targetMinuteCount = 1000000000;

console.log();
let mapSize = 0;
let resourceCountAfterTarget = 0;
for (let key in resMap)
  if (resMap[key] !== undefined) {
    let freq = resMap[key].freq;
    if ((resMap[key].count >= 100) && (freq.length > 0)) {
      console.log(key + " " + JSON.stringify(resMap[key]));
      
      let rest = (targetMinuteCount - 1) - resMap[key].startMinute;
      for (let i = 0; i < freq.length; i++)
      if ((rest % resMap[key].freq[i]) == 0) 
      {
        resourceCountAfterTarget = parseInt(key);
        break;
      }
    }
    mapSize++;
  }
console.log("Map size: " + mapSize);
console.log();
console.log("Resource value after 1000000000 minutes: " + resourceCountAfterTarget);
