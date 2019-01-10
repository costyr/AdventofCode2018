const fs = require('fs');
const util = require('./Util.js');

const kInputFilePath = './Day15Input.txt';
const kNeibourghsTransform = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];

function ParseInput(aInputFilePath, aMap, aElfs, aGoblins) {

  let rawInput = fs.readFileSync(aInputFilePath);

  let dayInput = rawInput.toString().split('\r\n');

  for (let i = 0; i < dayInput.length; i++) {
    if (aMap[i] === undefined)
      aMap[i] = [];

    aMap[i] = dayInput[i].split('').map(function (aValue) {
      return { g: aValue, c: -1 };
    });

    for (let j = 0; j < aMap[i].length; j++) {
      let mapSymbol = aMap[i][j].g;
      if ((mapSymbol == 'E') || (mapSymbol == 'G')) {

        let elfsOrGoblins = mapSymbol == 'E' ? aElfs : aGoblins;

        elfsOrGoblins.push({ type: mapSymbol, x: j, y: i, hitpoints: 200, attack: 3 });
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

function IsPointEqual(aPos1, aPos2) {
  return (aPos1.x == aPos2.x) && (aPos1.y == aPos2.y);
}

function IsEqual(aUnit1, aUnit2) {
  return IsPointEqual(aUnit1, aUnit2) && (aUnit1.type == aUnit2.type);
}

function PutUnitsOnMap(aMap, aUnits, aExcludeUnit) {
  for (let i = 0; i < aUnits.length; i++) {
    let unit = aUnits[i];

    if (unit.hitpoints <= 0)
      continue;

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
  while (queue.length > 0) {
    let currentPos = queue.pop();
    let currentPosCost = GetCost(aMap, currentPos);

    for (let i = 0; i < kNeibourghsTransform.length; i++) {
      let transform = kNeibourghsTransform[i];
      let neighbourPos = { x: currentPos.x + transform.x, y: currentPos.y + transform.y };

      let neighbourCost = GetCost(aMap, neighbourPos);
      let newCost = currentPosCost + 1;

      if (IsAccessibleGround(aMap, neighbourPos)) {
        if ((neighbourCost == -1) || (newCost < neighbourCost)) {
          SetCost(aMap, neighbourPos, newCost);
          queue.push(neighbourPos);
        }
      }
    }
  }
}

function GetUnitNeibourghs(aMap, aUnit, aForAttack) {

  let unitNeibourghs = [];
  for (let i = 0; i < kNeibourghsTransform.length; i++) {
    let transform = kNeibourghsTransform[i];
    let neighbourPos = { x: aUnit.x + transform.x, y: aUnit.y + transform.y };

    let groundAtPos = GetGround(aMap, neighbourPos);

    if ((aForAttack != undefined) && aForAttack) {
      if (groundAtPos != '#')
        unitNeibourghs.push(neighbourPos);
    }
    else
    {
      if (groundAtPos == '.')
        unitNeibourghs.push(neighbourPos);
    }
  }

  return unitNeibourghs;
}

function CompareMapPositions(aPos1, aPos2) {
  if (aPos1.y < aPos2.y)
    return -1;
  else if (aPos1.y > aPos2.y)
    return 1;
  else {
    if (aPos1.x < aPos2.x)
      return -1;
    else if (aPos1.x > aPos2.x)
      return 1;
    else
      return 0;
  }
}

function CompareCostAndMapPositions(aPos1, aPos2) {
  if (aPos1.c < aPos2.c)
    return -1;
  else if (aPos1.c > aPos2.c)
    return 1;
  else
    return CompareMapPositions(aPos1, aPos2);
}

function CompareHitPointsAndMapPositions(aUnit1, aUnit2) {
  if (aUnit1.hitpoints < aUnit2.hitpoints)
    return -1;
  else if (aUnit1.hitpoints > aUnit2.hitpoints)
    return 1;
  else
    return CompareMapPositions(aUnit1, aUnit2);
}

function AppendPointIfNotExist(aArray, aPoint) {
  for (let i = 0; i < aArray.length; i++)
    if (IsEqual(aPoint, aArray[i]))
      return;
  aArray.push(aPoint);
}

function GetUnitAtPosition(aPos, aUnits) {
  for (let i = 0; i < aUnits.length; i++)
    if (IsPointEqual(aPos, aUnits[i]))
      return aUnits[i];
  return null;
}

function AttackEnemy(aUnit, aEnemyUnits, aMap) {
  let movePositions = GetUnitNeibourghs(aMap, aUnit, true);

  let targetsInRange = [];
  for (let i = 0; i < movePositions.length; i++)
  {
    let enemy = GetUnitAtPosition(movePositions[i], aEnemyUnits);

    if ((enemy != null) && (enemy.hitpoints > 0))
      targetsInRange.push(enemy);
  }

  if (targetsInRange.length > 0)
  {
    targetsInRange.sort(CompareHitPointsAndMapPositions);
    let enemyTarget = targetsInRange[0];

    enemyTarget.hitpoints -= aUnit.attack;

    return true;
  }
  
  return false;
}

function AddCostToMovePositions(aMovePositions, aMap) {
  
  let movePositionsWithCost = [];
  for (let i = 0; i < aMovePositions.length; i++)
  {
    let movePosition = aMovePositions[i];
    let cost = GetCost(aMap, movePosition);

    movePositionsWithCost.push({ ...movePosition, c: cost });
  }

  return movePositionsWithCost;
}

function MoveUnit(aUnit, aEnemyUnits, aMap) {

  let startPos = { x: aUnit.x, y: aUnit.y };
  ResetCost(aMap);
  GenerateCostMap(startPos, aMap);

  let targetsNeibourghs = [];
  for (let j = 0; j < aEnemyUnits.length; j++) {

    if (aEnemyUnits[j].hitpoints <= 0)
      continue;

    let unitNeibourghs = GetUnitNeibourghs(aMap, aEnemyUnits[j]);

    for (let i = 0; i < unitNeibourghs.length; i++) {
      let unitNeighbour = unitNeibourghs[i];
      let cost = GetCost(aMap, unitNeighbour);
      if (cost > 0)
        AppendPointIfNotExist(targetsNeibourghs, { ...unitNeighbour, c: cost });
    }
  }

  if (targetsNeibourghs.length == 0)
    return false;

  targetsNeibourghs.sort(CompareCostAndMapPositions);

  startPos = { x: targetsNeibourghs[0].x, y: targetsNeibourghs[0].y };

  ResetCost(aMap);
  aMap[aUnit.y][aUnit.x].g = '.';
  GenerateCostMap(startPos, aMap);
  aMap[aUnit.y][aUnit.x].g = aUnit.type;

  let movePositions = GetUnitNeibourghs(aMap, aUnit);

  let movePositionsWithCost = AddCostToMovePositions(movePositions, aMap);

  movePositionsWithCost.sort(CompareCostAndMapPositions);

  aUnit.x = movePositionsWithCost[0].x;
  aUnit.y = movePositionsWithCost[0].y;

  return true;
}

function CountRemaining(aUnitsGroup) {
  let remaningHitPoints = 0;
  let remaningUnits = 0;
  for (let i = 0; i < aUnitsGroup.length; i++)
    if (aUnitsGroup[i].hitpoints > 0) {
      remaningHitPoints += aUnitsGroup[i].hitpoints;
      remaningUnits ++;
    }
  
  return { remaningHitPoints, remaningUnits, unitsLost: aUnitsGroup.length - remaningUnits };
}

function BoostAttackPower(aUnitsGroup,  aAttackBoost) {
  for (let i = 0; i < aUnitsGroup.length; i++)
    aUnitsGroup[i].attack += aAttackBoost;
}

function RunBattle(aElfs, aElfAttackBoost, aGoblins, aMap, aLogBattle) {
  
  let elfs = util.CopyObject(aElfs);

  if (aElfAttackBoost > 0)
    BoostAttackPower(elfs, aElfAttackBoost);

  let goblins = util.CopyObject(aGoblins);
  
  let units = elfs.concat(goblins);

  let rounds = 0;
  while (true) {
    units.sort(CompareMapPositions);
     
    for (let i = 0; i < units.length; i++)
    {
      let unit = units[i];

      if (unit.hitpoints <= 0)
        continue;

      let enemyUnits = (unit.type == 'E') ? goblins : elfs;

      let mapWithUnits = GetMapWithUnits(aMap, elfs, goblins);

      let ret = AttackEnemy(unit, enemyUnits, mapWithUnits);
      if (!ret) {
        ret = MoveUnit(unit, enemyUnits, mapWithUnits);
        if (ret)
          ret = AttackEnemy(unit, enemyUnits, mapWithUnits);
      }

      if (!ret) {
        let elfStats = CountRemaining(elfs);
        let goblinStats = CountRemaining(goblins);
    
        if ((elfStats.remaningHitPoints == 0) || (goblinStats.remaningHitPoints == 0))
        {
          let winnerStats = (elfStats.remaningHitPoints > 0) ? elfStats : goblinStats;
          let winner = (elfStats.remaningHitPoints > 0) ? 'elf' : 'goblin';
          return { winner: winner, score: rounds * winnerStats.remaningHitPoints, unitsLost: winnerStats.unitsLost };   
        }
      }
    }

    rounds ++;

    if (aLogBattle) {
      console.log(rounds);
      console.log(PrintMapWithUnits(aMap, elfs, goblins));
      console.log(elfs);
      console.log(goblins);
    }
  }
}

function FindMinElfBoost(aElfs, aGoblins, aMap, aLogBattle) {
  let attackBoost = 1;
  while(true) {
    let ret = RunBattle(aElfs, attackBoost, aGoblins, aMap, aLogBattle);
    if ((ret.winner == 'elf') && (ret.unitsLost == 0))
      return ret;
    
    if (aLogBattle)
      console.log("Elf attack boost: " + attackBoost + " " + JSON.stringify(ret));

    attackBoost ++;
  }  
}

var cavesMap = [];
var elfs = [];
var goblins = [];

ParseInput(kInputFilePath, cavesMap, elfs, goblins);

console.log(elfs);
console.log(goblins);
console.log(PrintMapWithUnits(cavesMap, elfs, goblins));

let ret = RunBattle(elfs, 0, goblins, cavesMap, true);

console.log(ret);

ret = FindMinElfBoost(elfs, goblins, cavesMap, false);

console.log(ret);