const fs = require('fs');
const util= require('./Util.js');

const kInputFilePath = './Day15TestInput3.txt';
const kNeibourghsTransform = [ { x: -1, y: 0}, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1} ];

function ParseInput(aInputFilePath, aMap, aElfs, aGoblins) {

  let rawInput = fs.readFileSync(aInputFilePath);

  let dayInput = rawInput.toString().split('\r\n');

  for (let i = 0; i < dayInput.length; i++) {
    if (aMap[i] === undefined)
      aMap[i] = [];

    aMap[i] = dayInput[i].split('').map(function(aValue) {
      return { g: aValue, c: -1 };
    });

    for (let j = 0; j < aMap[i].length; j++) {
      let mapSymbol = aMap[i][j].g;
      if ((mapSymbol == 'E') || (mapSymbol == 'G')) {

        let elfsOrGoblins = mapSymbol == 'E' ? aElfs : aGoblins;

        elfsOrGoblins.push({ type: mapSymbol, x: j, y: i });
        aMap[i][j].g = '.';
      }
    }
  }
}

function PrintMap(aMap) {
  let rawMap = '';
  for (let x = 0; x < aMap.length; x++) {
    let line = "";
    for (let y = 0; y < aMap[x].length; y++)
      line += aMap[x][y].g;

    rawMap += line;
    rawMap += '\r\n';
  }

  return rawMap;
}

function IsEqual(aUnit1, aUnit2) {
  return (aUnit1.x == aUnit2.x) && (aUnit1.y == aUnit2.y) && (aUnit1.type == aUnit2.type);
}

function PutUnitsOnMap(aMap, aUnits, aExcludeUnit) {
  for (let i = 0; i < aUnits.length; i++)
  {
    let unit = aUnits[i];

    if ((aExcludeUnit !== undefined) && IsEqual(unit, aExcludeUnit))
      continue;

    aMap[unit.y][unit.x].g = unit.type;
  }
}

function GetMapWithUnits(aMap, aElfs, aGoblins) {
  let mapCopy = util.CopyObject(aMap);

  PutUnitsOnMap(mapCopy, aElfs);
  PutUnitsOnMap(mapCopy, aGoblins);

  return mapCopy;
}

function PrintMapWithUnits(aMap, aElfs, aGoblins) {
  let mapCopy = GetMapWithUnits(aMap, aElfs, aGoblins);

  return PrintMap(mapCopy);
}

function SetCost(aMap, aPos, aCost) {
  aMap[aPos.y][aPos.x].c = aCost;
}

function GetCost(aMap, aPos) {
  return aMap[aPos.y][aPos.x].c;
}

function ResetCost(aMap) {
  for (let j = 0; j < aMap.length; j++)
    for (let i = 0; i < aMap[j].length; i++)
      aMap[j][i].c = -1;
}

function GetGround(aMap, aPos) {
  return aMap[aPos.y][aPos.x].g;
}

function IsAccessibleGround(aMap, aPos) {
  if ((aPos.x >= 0) && (aPos.x < aMap[0].length) && 
      (aPos.y >= 0) && (aPos.y < aMap.length))
    return GetGround(aMap, aPos) == '.';
  return false;
}

function GenerateCostMap(aStartPos, aMap) {
  let queue = [];
  queue.push(aStartPos);
  SetCost(aMap, aStartPos, 0);
  while (queue.length > 0)
  {
    let currentPos = queue.pop();
    let currentPosCost = GetCost(aMap, currentPos);

    for (let i = 0; i < kNeibourghsTransform.length; i++)
    {
      let transform = kNeibourghsTransform[i];
      let neighbourPos = { x: currentPos.x + transform.x, y: currentPos.y + transform.y };

      let neighbourCost = GetCost(aMap, neighbourPos);

      if (IsAccessibleGround(aMap, neighbourPos) && (neighbourCost == -1)) {
        SetCost(aMap, neighbourPos, currentPosCost + 1);
        queue.push(neighbourPos);
      }
    }
  }
}

function GetUnitNeibourghs(aMap, aUnit) {

  let unitNeibourghs = [];
  for (let i = 0; i < kNeibourghsTransform.length; i++) {
    let transform = kNeibourghsTransform[i];
    let neighbourPos = { x: aUnit.x + transform.x, y: aUnit.y + transform.y };

    if (GetGround(aMap, neighbourPos) == '.')
      unitNeibourghs.push(neighbourPos);
  }
  
  return unitNeibourghs;
}

function SelectTargets(aUnit, aEnemyUnits) {
              
}

function IsEnemyReachable(aUnit, aEnemyUnit, aMap) {
  let startPos = { x: aUnit.x, y: aUnit.y };
  GenerateCostMap(startPos, aMap);
  let unitNeibourghs = GetUnitNeibourghs(aMap, aEnemyUnit);

  for (let i = 0; i < unitNeibourghs.length; i++) {
    if (GetCost(aMap, unitNeibourghs[i]) > 0)
      return true; 
  }

  return false;
}

var cavesMap = [];
var elfs = [];
var goblins = [];

ParseInput(kInputFilePath, cavesMap, elfs, goblins);

console.log(elfs);
console.log(goblins);
console.log(PrintMapWithUnits(cavesMap, elfs, goblins));

let mapWithUnits = GetMapWithUnits(cavesMap, elfs, goblins);
for (let i = 0; i < goblins.length; i++) {
  let isReachable = IsEnemyReachable(elfs[0], goblins[i], mapWithUnits);

  console.log("Goblin " + i + " is reachable: " + isReachable);

  ResetCost(mapWithUnits);
}