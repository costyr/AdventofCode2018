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

  if (order[first] === undefined) {
    order[first] = 0;
    pre[first] = "";
  }

  if (order[second] === undefined) {
    order[second] = order[first] + 1;
    pre[second] = first;
  }
  else {
    let newOrder = order[first] + 1;
    if (newOrder > order[second]) {
      order[second] = newOrder;
      for (let key in pre) {
        if (pre[key].indexOf(second) != -1)
          order[key]++;
      }
    }
    pre[second] += first;
  }
}

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

function GetBestWorker(aWorkers, aCount) {
  let minLoad = 100000;
  let index = 0;
  for (let w = 0; w < aCount; w++)
    if (aWorkers[w] == undefined) {
      aWorkers[w] = [];
      return w;
    }
    else
      if (aWorkers[w].length < minLoad) {
        minLoad = aWorkers[w].length;
        index = w;
      }
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
    let second = (j < 10) ? "0" : "";
    second += j.toString();
    let line = second + " ";
    for (let i = 0; i < aWorkers.length; i++)
      line += "   " + aWorkers[i][j];
    console.log(line);
  }
}

const workerCount = 5;
var workers = [];
for (let i = 0; i < pp.length; i++) {
  let max = 0;
  let workerIndex = 0;
  for (let j = 0; j < pp[i].length; j++) {
    let step = pp[i].charCodeAt(j) - 65 + 1

    if (step > max)
      max = step;

    workerIndex = GetBestWorker(workers, workerCount);
    for (let k = 0; k < step; k++)
      workers[workerIndex].push(pp[i][j]);
  }

  //if (i < pp.length - 1)
  NormalizeWorkers(workers, workerCount, pp[i].length);
}

MaximizeWorkers(workers, workerCount);

PrintWorkers(workers);

var seconds = 0;
for (let i = 0; i < workers.length; i++)
  if (workers[i].length > seconds)
    seconds = workers[i].length;

console.log(seconds + 1);
