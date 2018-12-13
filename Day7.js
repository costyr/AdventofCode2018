const fs = require('fs');

var rawDay7Input = fs.readFileSync('./Day7Input.txt');

var day7Input = rawDay7Input.toString().split('\r\n');

var order = [];
var pre = [];
for (let i = 0; i < day7Input.length; i++) {
  let line = day7Input[i].split(' ');
  let first = line[1];
  let second = line[7];

  //console.log(first  + "<" + second);

  if (pre[first] === undefined)
    pre[first] = [];

  if (pre[second] === undefined)
    pre[second] = [];

  pre[second].push(first);
}

function ComputeOrder(aStage, aOrder, aPre) {
  if (aPre[aStage].length == 0)
    aOrder[aStage] = 0;
  else {
    let max = 0;
    max = aPre[aStage].reduce(function (aMax, aValue) {
      if (aOrder[aValue] === undefined)
        ComputeOrder(aValue, aOrder, aPre);

      if (aOrder[aValue] > aMax)
        aMax = aOrder[aValue];
      return aMax;
    }, max);

    aOrder[aStage] = max + 1;
  }
}

for (let key in pre)
  ComputeOrder(key, order, pre);

var gg = [];
for (var key in order) {
  gg.push({ id: key, order: order[key], p: pre[key] });
}

gg.sort(function (aNode1, aNode2) {
  if (aNode1.order == aNode2.order) {
    if (aNode1.id < aNode2.id)
      return -1;
    else if (aNode1.id == aNode2.id)
      return 0;
    else
      return 1;
  }
  else
    return (aNode1.order < aNode2.order) ? -1 : 1;
});

console.log(gg);

var pp = [];
let iOrder = -1;
let group = "";
for (let i = 0; i < gg.length; i++) {
  if (gg[i].order == iOrder)
    group += gg[i].id;
  else {
    if (group.length > 0)
      pp.push(group);
    iOrder = gg[i].order;
    group = gg[i].id;
  }
}

if (group.length > 0)
  pp.push(group);

function NoDeps(aResult, aDeps) {
  for (let k = 0; k < aDeps.length; k++)
    if (aResult.indexOf(aDeps[k]) == -1)
      return false;
  return true;
}

var result = "";
var queue = [];
for (i = 0; i < pp.length; i++) {
  if (queue.length > 0) {
    let hhh = pp[i];
    let ccc = queue.concat(hhh.split(''));
    ccc.sort();

    console.log(ccc);

    let newQueue = [];
    let found = false;
    for (j = 0; j < ccc.length; j++) {
      if (!found && NoDeps(result, pre[ccc[j]])) {
        result += ccc[j]
        found = true;
      }
      else
        newQueue.push(ccc[j]);
    }

    queue = newQueue;
  }
  else {
    result += pp[i][0];
    queue = queue.concat(pp[i].substr(1).split(''));
  }
}

while (queue.length > 0) {
  let newQueue = [];
  let found = false;
  for (j = 0; j < queue.length; j++) {
    if (!found && NoDeps(result, pre[queue[j]])) {
      result += queue[j]
      found = true;
    }
    else
      newQueue.push(queue[j]);
  }

  queue = newQueue;
}

pre.sort();
console.log(pre);
console.log(gg);
console.log(JSON.stringify(pp));
console.log(result);

function WorkerHasDepsInProgress(aWorker, aDeps) {
  let maxIndex = -1;
  if (aDeps === undefined)
    return -1;

  if (aWorker === undefined)
    return -1;

  for (let i = 0; i < aWorker.length; i++) {
    if ((aDeps.indexOf(aWorker[i]) != -1) && (i > maxIndex))
      maxIndex = i;
  }

  return maxIndex;
}

function HasDepsInProgress(aWorkers, aWorkerCount, aDeps) {
  let maxIndex = -1;
  for (let i = 0; i < aWorkerCount; i++) {
    let pos = WorkerHasDepsInProgress(aWorkers[i], aDeps);

    if (pos > maxIndex)
      maxIndex = pos;
  }
  return maxIndex;
}

function GetBestWorker(aWorkers, aWorkerCount, aState, aPre, aUsedWorkers) {
  let minLoad = 100000;
  let index = 0;

  let depFreeIndex = HasDepsInProgress(aWorkers, aWorkerCount, aPre[aState]);

  for (let i = 0; i < aWorkerCount; i++) {
    //if (aUsedWorkers.indexOf(i) != -1)
    //  continue;

    if (aWorkers[i] === undefined) {
      aWorkers[i] = [];
      index = i;
      break;
    }
    else {
      let workerMax = aWorkers[i].length;
      let gap = Math.abs(workerMax - depFreeIndex);
      if (gap < minLoad) {
        minLoad = gap;
        index = i;
      }
    }
  }

  for (let i = aWorkers[index].length; i < depFreeIndex + 1; i++)
    aWorkers[index].push('.');

  return index;
}

function NormalizeWorkers(aWorkers, aCount, aWorkCount, ) {
  if (aWorkCount >= aCount)
    return;

  let min = 10000;
  for (let i = 0; i < aCount; i++)
    if ((aWorkers[i] !== undefined) && (aWorkers[i].length < min))
      min = aWorkers[i].length;

  for (let i = 0; i < aCount; i++) {
    if (aWorkers[i] === undefined)
      aWorkers[i] = [];
    if (aWorkers[i].length < min) {
      let toAdd = min - aWorkers[i].length;
      for (let j = 0; j < toAdd; j++)
        aWorkers[i].push('.');
    }
  }
}

function MaximizeWorkers(aWorkers, aCount) {
  let max = 0;
  //for (let i = 0; i < aCount; i++)
  // if (aWorkers[i].length > max)
  //   max = aWorkers[i].length;

  max = aWorkers.reduce(function (max, aValue) {
    if (aValue.length > max)
      max = aValue.length;
    return max;
  }, 0);

  for (let i = 0; i < aCount; i++) {
    if (aWorkers[i].length < max) {
      let toAdd = max - aWorkers[i].length;
      for (let j = 0; j < toAdd; j++)
        aWorkers[i].push('.');
    }
  }
}

function PrintWorkers(aWorkers) {
  let secondCount = aWorkers[0].length;
  for (let j = 0; j < secondCount; j++) {
    let second = (j < 10) ? "00" : j < 100 ? "0" : "";
    second += j.toString();
    let line = second + " ";
    for (let i = 0; i < aWorkers.length; i++)
      line += "   " + aWorkers[i][j];
    console.log(line);
  }
}

const workerCount = 5;
var delay_until = [];
for (let i = 0; i < workerCount; i++)
  delay_until.push({ done: '', time: 0 });

function RunStep(aDelayUntil) {
  let done = '';
  for (let i = 0; i < aDelayUntil.length; i++) {
    if (aDelayUntil[i].time > 0) {
      aDelayUntil[i].time--;

      if (aDelayUntil[i].time == 0) {
        done += aDelayUntil[i].done;
        aDelayUntil[i].done = '';
      }
    }
  }

  return done;
}

function Delay(aResult, aStageId, aDeps) {
  if (!NoDeps(aResult, aDeps))
    return false;

  let index = -1;

  for (let i = 0; i < workerCount; i++) {
    if (delay_until[i].time == 0) {
      index = i;
      break;
    }
  }

  if (index >= 0) {
    delay_until[index].done = aStageId;
    delay_until[index].time = (aStageId.toString().charCodeAt(0) - 65) + 1;

    return true;
  }

  return false;
}

var queue = [];
for (let i = 0; i < pp.length; i++) {
  let chunk = pp[i].split('');
  chunk.sort();
  queue = queue.concat(chunk);
}

console.log(queue);

result = "";
var seconds = 0;
while (queue.length > 0) {
  let toRemove = [];
  for (let i = 0; i < queue.length; i++) {

    let stage = queue[i];

    let deps = pre[stage];

    if (Delay(result, stage, deps))
      toRemove.push(stage);
  }

  if (toRemove.length > 0)
    for (let i = 0; i < delay_until.length; i++)
      console.log(JSON.stringify(delay_until[i]));

  for (let j = 0; j < toRemove.length; j++) {
    let pos = queue.indexOf(toRemove[j]);
    queue.splice(pos, 1);
  }

  let doneAtStep = RunStep(delay_until);
  if (doneAtStep.length > 0)
    result += doneAtStep;
  seconds++;

  console.log(result);
}

let max = 0;
for (let i = 0; i < delay_until.length; i++)
  if (delay_until[i].time > max)
    max = delay_until[i].time;

seconds += max;

console.log(result);

for (let i = 0; i < delay_until.length; i++)
  console.log(JSON.stringify(delay_until[i]));

console.log(seconds + pp.length * 60);

/*var seconds = 0;
var workerIndex = 0;
for (let i = 0; i < workers.length; i++)
  if (workers[i].length > seconds) 
  {
    seconds = workers[i].length;
    workerIndex = i;
  }

var cr = workers[workerIndex][0];
var ii = [];
for (let i = 0; i < workers[workerIndex].length; i++)
   if (workers[workerIndex][i] != cr)
   {
     cr = workers[workerIndex][i];
     if (cr != '.')
       ii.push(cr);
   }     

console.log(ii);
console.log(seconds + 1);
console.log(ii.length * 60 + seconds);

MaximizeWorkers(workers, workerCount);

PrintWorkers(workers);*/