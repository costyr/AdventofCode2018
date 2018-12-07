const fs = require('fs');

var rawDay7Input = fs.readFileSync('./Day7TestInput.txt');

var day7Input = rawDay7Input.toString().split('\r\n');

var order = [];
var pre = [];
for (i = 0; i < day7Input.length; i++) {
    let line = day7Input[i].split(' ');
    let first = line[1];
    let second = line[7];

    //console.log(first  + "<" + second);

    if (order[first] === undefined) 
    {
        order[first] = 0;
        pre[first] = "";
    }

    if (order[second] === undefined) 
    {
        order[second] = order[first] + 1;
        pre[second] = first;
    }
    else 
    {
        let newOrder = order[first] + 1;
        if (newOrder > order[second])
          order[second] = newOrder;
        pre[second] += first;  
    }
}

var gg = [];
for (var key in order) {
    gg.push({ id: key, order: order[key], p: pre[key] });
}

gg.sort(function (aNode1, aNode2) { 
    if (aNode1.order == aNode2.order) 
    {
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

var pp = [];
for (i = 0; i < gg.length; i++)
{
  for (j = 0; j < gg.length; j++)
    if (gg[j].order == i)
    {
      if (pp[i] === undefined)
        pp[i] = "";
      pp[i] += gg[j].id;
    }
}

function NoDeps(aResult, aDeps) 
{
  for (let k = 0; k < aDeps.length; k++)
    if (aResult.indexOf(aDeps[k]) == -1)
      return false;
  return true;      
}

var result = "";
var queue = [];
for (i = 0; i < pp.length; i++) 
{
  if (queue.length > 0) 
  {
    let hhh = pp[i];
    let ccc = queue.concat(hhh.split(''));
    ccc.sort();

    console.log(ccc);

    let newQueue = [];
    let found = false;
    for (j = 0; j < ccc.length; j++) 
    {
      if (!found && NoDeps(result, pre[ccc[j]])) 
      {
        result += ccc[j]
        found = true;
      }
      else
        newQueue.push(ccc[j]);
    }

    queue = newQueue;
  }
  else
  {
    result += pp[i][0];
    queue = queue.concat(pp[i].substr(1).split(''));    
  }
}
  
while(queue.length > 0)
{
    let newQueue = [];
    let found = false;
    for (j = 0; j < queue.length; j++) 
    {
      if (!found && NoDeps(result, pre[queue[j]])) 
      {
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

function GetBestWorker(aWorkers, aCount) 
{
  let minLoad = 100000;  
  let index = 0;
  for (let w = 0; w < aCount; w++)
    if (aWorkers[w] == undefined) 
    {
      aWorkers[w] = [];
      return w;
    }
    else
      if (aWorkers[w].length < minLoad) 
      {
        minLoad = aWorkers[w].length;
        index = w;    
      }
  return index;      
}

const workerCount = 2;
var workers = [];
for (i = 0; i < pp.length; i++) 
{
  let max = 0;
  let workerIndex = 0;
  for (j = 0; j < pp[i].length; j++) 
  {
    let step = pp[i].charCodeAt(j) - 65 + 1

    if (step > max)
      max = step;

    workerIndex = GetBestWorker(workers, workerCount); 
    for (k = 0; k < step; k++)  
      workers[workerIndex].push(pp[i][j]);    
  }

  for (l = workerIndex + 1; l < workerCount; l++)
  {
    if (workers[l] === undefined)
      workers[l] = [];
    for (k = 0; k < max; k++)  
      workers[l].push('.');
  }
}

console.log(JSON.stringify(workers));

var seconds = 0;
for (i = 0; i < workers.length; i++)
  if (workers[i].length > seconds)
    seconds = workers[i].length;
  
console.log(seconds);
  