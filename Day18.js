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

/*let ad = GetAdjacents(0, 0, acres);

console.log(ad);

let ad1 = GetAdjacents(0, 1, acres);

console.log(ad1);

let ad2 = GetAdjacents(0, 9, acres);

console.log(ad2);*/

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

var minutesCount = 15800;
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
  //console.log();
  //PrintAcres(acres);
  let resCount = ComputeWoodResource(acres);
  let key = resCount.toString();
  if (resMap[key] === undefined)
    resMap[key] = 0;
  else 
    resMap[key] ++;
}

let s = 0;
for (let key in resMap)
  if (resMap[key] !== undefined) 
  {
    if (resMap[key] > 0)
  console.log(key + " "+ resMap[key]);
  s++;
  }

console.log("Map size: " + s);

//console.log(JSON.stringify(resMap));