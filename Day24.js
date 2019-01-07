const fs = require('fs');

const kInputFilePath = './Day24Input.txt';

const kImmuneToPrefix = 'immune to ';
const kWeakToPrefix = 'weak to ';

function CopyArray(aArray) {
  return JSON.parse(JSON.stringify(aArray));
}

function ParseGroup(aRawGroup) {
  let toParse = aRawGroup.split('units each with');
  let units = parseInt(toParse[0]);
  toParse = toParse[1].split(' hit points ');
  let hitPoints = parseInt(toParse[0]);

  let immuneTo = [];
  let weakTo = [];
  if (toParse[1][0] == '(') {
    let pos = toParse[1].indexOf(')');
    let immuneWeakToStr = toParse[1].substr(1, pos - 1);
    toParse = toParse[1].substr(pos + 1).trim();

    let immuneWeakTo = immuneWeakToStr.split('; ');

    if (immuneWeakTo.length == 1) {
      if (immuneWeakTo[0].startsWith(kImmuneToPrefix))
        immuneTo = immuneWeakTo[0].substr(kImmuneToPrefix.length).split(', ');
      else if (immuneWeakTo[0].startsWith(kWeakToPrefix))
        weakTo = immuneWeakTo[0].substr(kWeakToPrefix.length).split(', ');
    }
    else {
      for (let i = 0; i < immuneWeakTo.length; i++) {
        if (immuneWeakTo[i].startsWith(kImmuneToPrefix))
          immuneTo = immuneWeakTo[i].substr(kImmuneToPrefix.length).split(', ');
        else if (immuneWeakTo[i].startsWith(kWeakToPrefix))
          weakTo = immuneWeakTo[i].substr(kWeakToPrefix.length).split(', ');
      }
    }
  }
  else
    toParse = toParse[1];

  let attackStr = toParse.split(' ');
  let attack = parseInt(attackStr[5]);
  let attackType = attackStr[6];
  let initiative = parseInt(attackStr[10]);

  return { units, hitPoints, immuneTo, weakTo, attack, attackType, initiative };
}

function ParseInput(aInputFilePath, aImmuneSystem, aInfection) {

  let rawInput = fs.readFileSync(aInputFilePath);

  let dayInput = rawInput.toString().split('\r\n');

  var state = -1;
  for (let i = 0; i < dayInput.length; i++) {
    let line = dayInput[i];

    if (state == -1) {
      if (line == 'Immune System:')
        state = 0;
      else if (line == 'Infection:')
        state = 1;
    }
    else if ((state == 0) || (state == 1)) {
      if (line.length > 0) {
        let group = ParseGroup(line);
        if (state == 0) {
          group.id = 'ImmuneSystem' + (aImmuneSystem.length + 1);
          aImmuneSystem.push(group);
        }
        else {
          group.id = 'Infection' + (aInfection.length + 1);
          aInfection.push(group);
        }
      }
      else
        state = -1;
    }
  }
}

function ComputeDamage(aAttackGroup, aDefendingGroup) {
  
  let effectivePower = aAttackGroup.units * aAttackGroup.attack;
  let attackType = aAttackGroup.attackType;

  let damage = 0;
  if (aDefendingGroup.immuneTo.indexOf(attackType) != -1)
    damage = 0;
  else if (aDefendingGroup.weakTo.indexOf(attackType) != -1)
    damage = effectivePower * 2;
  else
    damage = effectivePower;
  return damage;
}

function SelectTargets(aGroup, aDefendingGroups) {
  let targets = [];
  for (let i = 0; i < aDefendingGroups.length; i++) {
    let defendingGroup = aDefendingGroups[i];

    if ((defendingGroup.selected) || (defendingGroup.units <= 0))
      continue;

    let damage = ComputeDamage(aGroup, defendingGroup);

    targets.push({ group: defendingGroup, damage });
  }

  return targets;
}

function CompareTargets(aTarget1, aTarget2) {
  if (aTarget1.damage < aTarget2.damage)
    return 1;
  else if (aTarget1.damage > aTarget2.damage)
    return -1;
  else {
    let target1Power = aTarget1.group.units * aTarget1.group.attack;
    let target2Power = aTarget2.group.units * aTarget2.group.attack;

    if (target1Power < target2Power)
      return 1;
    else if (target1Power > target2Power)
      return -1;
    else {
      let target1Initiative = aTarget1.group.initiative;
      let target2Initiative = aTarget2.group.initiative;

      if (target1Initiative < target2Initiative)
        return 1;
      else if (target1Initiative > target2Initiative)
        return -1;
      else
        return 0;
    }
  }
}

function CompareGroups(aGroup1, aGroup2) {
  let group1Power = aGroup1.units * aGroup1.attack;
  let group2Power = aGroup2.units * aGroup2.attack;
  if (group1Power < group2Power)
    return 1;
  else if (group1Power > group2Power)
    return -1;
  else {
    if (aGroup1.initiative < aGroup2.initiative)
      return 1;
    else if (aGroup1.initiative > aGroup2.initiative)
      return -1;
    else
      return 0;
  }
}

function CompareInitiative(aGroup1, aGroup2) {
  if (aGroup1.initiative < aGroup2.initiative)
    return 1;
  else if (aGroup1.initiative > aGroup2.initiative)
    return -1;
  else
    return 0;
}

function AssignTargets(aAttackGroups, aDefendGroups) {

  aAttackGroups.sort(CompareGroups);

  for (let i = 0; i < aAttackGroups.length; i++) {

    if (aAttackGroups[i].units == 0)
      continue;

    let targets = SelectTargets(aAttackGroups[i], aDefendGroups);

    targets.sort(CompareTargets);

    if ((targets.length > 0) && (targets[0].damage > 0)) {
      aAttackGroups[i].target = targets[0].group;
      targets[0].group.selected = true;
    }
  }
}

function ResetState(aGroups) {
  for (let i = 0; i < aGroups.length; i++) {
    aGroups[i].target = null;
    aGroups[i].selected = false;
  }
}

function PrintGroupState(aGroup) {
  for (let i = 0; i < aGroup.length; i++)
    console.log(aGroup[i].id + " units: " + aGroup[i].units);
}

function RunBattle(aGroup1, aGroup2, aLogAttacks) {

  let group1RemainingUnits = 0;
  let group2RemainingUnits = 0;
  while (true) {

    if (aLogAttacks) {
      console.log();
      PrintGroupState(aGroup1);
      PrintGroupState(aGroup2);
    }

    ResetState(aGroup1);
    ResetState(aGroup2);

    AssignTargets(aGroup1, aGroup2);
    AssignTargets(aGroup2, aGroup1);

    let allGroups = aGroup1.concat(aGroup2);
    allGroups.sort(CompareInitiative);

    let totalUnitsLost = 0;
    for (let i = 0; i < allGroups.length; i++) {
      let group = allGroups[i];

      if ((group.target === undefined) || (group.target == null))
        continue;

      let damage = ComputeDamage(group, group.target);

      let unitsLost = Math.min(Math.floor(damage / group.target.hitPoints), group.target.units);

      if (aLogAttacks)
        console.log(group.id + " attacks defending " + group.target.id + ", killing " + unitsLost + " units");

      group.target.units -= unitsLost;
      totalUnitsLost += unitsLost;
    }

    if (totalUnitsLost == 0)
      return { winnerGroup: 0 };

    group1RemainingUnits = GetTotalUnits(aGroup1);
    group2RemainingUnits = GetTotalUnits(aGroup2);

    if ((group1RemainingUnits <= 0) || (group2RemainingUnits <= 0))
      break;
  }

  let winnerGroup = group1RemainingUnits > group2RemainingUnits ? 1 : 2;

  return { winnerGroup, remainingUnits: Math.max(group1RemainingUnits, group2RemainingUnits) };
}

function GetTotalUnits(aGroup) {
  let total = 0;
  for (let i = 0; i < aGroup.length; i++)
    total += aGroup[i].units;
  return total;
}

function BoostGroup(aAttackIncrease, aGroupToBoost, aGroup2) {
  for (let i = 0; i < aGroupToBoost.length; i++)
    aGroupToBoost[i].attack += aAttackIncrease;

  return RunBattle(aGroupToBoost, aGroup2, false);
}

function FindMinWinBoost(aGroupToBoost, aGroup2) {
  let minBoost = 1;
  while (true) {
    let ret = BoostGroup(minBoost, CopyArray(aGroupToBoost), CopyArray(aGroup2));
    if (ret.winnerGroup == 1)
      return ret;
    minBoost += 1;
  }
}

var immuneSystem = [];
var infection = [];

ParseInput(kInputFilePath, immuneSystem, infection);

console.log(immuneSystem);
console.log(infection);

var infectionCopy = CopyArray(infection);
var immuneSystemCopy = CopyArray(immuneSystem);

var winner = RunBattle(infectionCopy, immuneSystemCopy, false);

console.log(winner.remainingUnits);

winner = FindMinWinBoost(immuneSystem, infection);

console.log(winner.remainingUnits);
