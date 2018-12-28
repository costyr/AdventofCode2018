const fs = require('fs');

var rawInputFilePath = './Day22Input.txt';

var rawInput = fs.readFileSync(rawInputFilePath);

var dayInput = rawInput.toString().split('\r\n');

const depth = parseInt(dayInput[0].split(': ')[1]);
var rawTarget = dayInput[1].split(': ')[1].split(',');
const target = { x: parseInt(rawTarget[0]), y: parseInt(rawTarget[1]) };

const factor = 20183;
const none = 0;
const torch = 1;
const climbGear = 2;

function ComputeEstimated(aCurrent, aTarget, aTool) {
  let estimate = Math.abs(aTarget.x - aCurrent.x) + Math.abs(aTarget.y - aCurrent.y);

  if (aTool != torch)
    estimate += 7;

  return estimate;
}
 
function IsRoutePos(aPos, aRoute) 
{
  for (let i = 0; i < aRoute.length; i++)
    if ((aPos.x == aRoute[i].x) && (aPos.y == aRoute[i].y))
      return true;
  return false;
}

class PriorityList {
  constructor(aCostMap) {
    this.mList = [];
    this.mCostMap = aCostMap;
  }

  Add(aPos) {
    if (this.IndexOf(aPos) == -1)
      this.mList.push(aPos);
  }

  Remove(aPos) {
    let index = this.IndexOf(aPos);
    if (index != -1)
      this.mList.splice(index, 1);
  }

  IndexOf(aPos) {
    for (let i = 0; i < this.mList.length; i++)
      if ((aPos.x == this.mList[i].x) &&
        (aPos.y == this.mList[i].y))
        return i;
    return -1;
  }

  IsEmpty() {
    return (this.mList.length == 0);
  }

  GetNext() {
    let min = Number.MAX_SAFE_INTEGER;
    let nextPos;
    for (let i = 0; i < this.mList.length; i++) {
      let pos = this.mList[i];
      let nodeCost = this.mCostMap.GetNodeCost(pos);

      let estimate = nodeCost.cost + ComputeEstimated(pos, target, nodeCost.tool);

      if (estimate < min) {
        min = estimate;
        nextPos = pos;
      }
    }

    let n = this.mCostMap.GetNodeCost(nextPos);

    return { ...nextPos, tool: n.tool, cost: n.cost, visited: n.visited };
  }
};

class CostMap {
  constructor() {
    this.mCostMap = [];
  }

  Init(aWidth, aHeight) {
    for (let i = 0; i < aHeight; i++) {
      if (this.mCostMap[i] === undefined)
        this.mCostMap[i] = [];
      for (let j = 0; j < aWidth; j++)
        this.InitAtPos(i, j);
    }

    this.SetAtPos(0, 0, torch, 0, true);
  }

  SetAtPos(aY, aX, aTool, aCost, aVisited) {
    this.mCostMap[aY][aX] = { tool: aTool, cost: aCost, visited: aVisited };
  }

  InitAtPos(aY, aX) {
    this.SetAtPos(aY, aX, -1, -1, false);
  }

  GetNodeCost(aPos) {
    return this.mCostMap[aPos.y][aPos.x];
  }

  IsVisited(aPos) {
    return this.GetNodeCost(aPos).visited;
  }

  MarkVisited(aPos, aPriorityList) {
    aPriorityList.Remove(aPos);
    this.GetNodeCost(aPos).visited = true;
  }

  UpdateCost(aPos, aCost, aCameFrom) {
    let nodeCost = this.GetNodeCost(aPos);
    if (nodeCost.cost == -1) {
      nodeCost.cost = aCost;
      nodeCost.cameFrom = aCameFrom;
      return true;
    }
    else {
      if (aCost < nodeCost.cost) {
        nodeCost.cost = aCost;
        nodeCost.cameFrom = aCameFrom;
        return true;
      }
    }

    return false;
  }

  UpdateTool(aPos, aTool) {
    this.GetNodeCost(aPos).tool = aTool;
  }

  Print(aRoute) {
    let lines = "";
    for (let i = 0; i < this.mCostMap.length; i++) {
      let line = "";
      for (let j = 0; j < this.mCostMap[i].length; j++) {
        let cost = this.mCostMap[i][j].cost;
        let isRoutePos = IsRoutePos({ x: j, y: i }, aRoute);
        let node = isRoutePos ? "[" : "";
        node += cost.toString();  
        if (isRoutePos)
          node += "]";
      
        if (node.length == 1)
          line += "    ";
        else if (node.length == 2)
          line += "   ";
        else if (node.length == 3)
          line += "  ";
        else if (node.length == 4)
          line += " ";
        line += node;
        line += " ";
      }
      lines += line;
      lines += "\r\n";
    }

    return lines;
  }

  PrintRouteTo(aTarget) {
    let route = this.ComputeRoute(aTarget);
    return this.Print(route);
  }

  ExtendMap(aPos) {
    if ((aPos.y < this.mCostMap.length) &&
        (aPos.x < this.mCostMap[aPos.y].length))
      return;

    if (aPos.y >= this.mCostMap.length) {
      this.mCostMap[aPos.y] = [];

      for (let i = 0; i < this.mCostMap[aPos.y - 1].length; i++) {
        this.InitAtPos(aPos.y, i);
      }
    }

    if (aPos.x >= this.mCostMap[aPos.y].length) {
      for (let i = 0; i < this.mCostMap.length; i++) {
        this.InitAtPos(i, aPos.x);
      }
    }
  }

  ComputeRoute(aPos) 
  {
    let route = [];
    let cameFrom = aPos;
    while (true)
    {
      route.push(cameFrom);

      if ((cameFrom.x == 0) && (cameFrom.y == 0))  
        break;

      cameFrom = this.mCostMap[cameFrom.y][cameFrom.x].cameFrom;
    }

    return route.reverse();
  }
}

class CaveMap {
  constructor(aTarget, aDepth, aFactor) {
    this.mTarget = aTarget;
    this.mDepth = aDepth;
    this.mFactor = aFactor;
    this.mCaveMap = [];
  }

  Init() {
    let width = this.mTarget.x + 1;
    let height = this.mTarget.y + 1;

    for (let y = 0; y < height; y++) {
      if (this.mCaveMap[y] === undefined)
        this.mCaveMap[y] = [];
      for (let x = 0; x < width; x++) {
        
        let erosionLevel = 0;
        if (((y == 0) && (x == 0)) ||
          ((y == this.mTarget.y) && (x == this.mTarget.x)))
          erosionLevel = (0 + this.mDepth) % this.mFactor;
        else
          erosionLevel = this.ComputeErosionLevel({ x, y });

        this.mCaveMap[y][x] = erosionLevel;
      }
    }
  }

  ComputeErosionLevel(aPos) {
    let erosionLevel = 0;
    if (aPos.y == 0)
      erosionLevel = (aPos.x * 16807 + this.mDepth) % this.mFactor;
    else if (aPos.x == 0)
      erosionLevel = (aPos.y * 48271 + this.mDepth) % this.mFactor;
    else 
    {
      let prevX = this.mCaveMap[aPos.y][aPos.x - 1];
      let prevY = this.mCaveMap[aPos.y - 1][aPos.x];
      erosionLevel = (prevX * prevY + this.mDepth) % this.mFactor;
    }
    return erosionLevel;
  }

  GetWidth() {
    return this.mCaveMap[0].length;
  }

  GetHeight() {
    return this.mCaveMap.length;
  }

  GetTerrainType(aErosionLevel) {
    if ((aErosionLevel % 3) == 0)
      return '.';
    else if ((aErosionLevel % 3) == 1)
      return '=';
    else if ((aErosionLevel % 3) == 2)
      return '|';
  }

  GetRiskLevel() {
    let riskLevel = 0;
    for (let y = 0; y <= this.mTarget.y; y++)
      for (let x = 0; x <= this.mTarget.x; x++) {
        let terrainType = this.GetTerrainType(this.mCaveMap[y][x]);
        if (terrainType == '=')
          riskLevel += 1;
        else if (terrainType == '|')
          riskLevel += 2;
      }
    return riskLevel;
  }

  GetGroundAtPos(aPos) {
    return this.GetTerrainType(this.mCaveMap[aPos.y][aPos.x]);
  }

  ExtendMap(aPos) {
    if ((aPos.y < this.mCaveMap.length) &&
      (aPos.x < this.mCaveMap[aPos.y].length))
      return;

    if (aPos.y >= this.mCaveMap.length) {
      this.mCaveMap[aPos.y] = [];

      for (let i = 0; i < this.mCaveMap[aPos.y - 1].length; i++) {
        this.mCaveMap[aPos.y][i] = this.ComputeErosionLevel({ x: i, y: aPos.y });
      }
    }

    if (aPos.x >= this.mCaveMap[aPos.y].length) {
      for (let i = 0; i < this.mCaveMap.length; i++) {
        this.mCaveMap[i][aPos.x] = this.ComputeErosionLevel({ x: aPos.x, y: i });
      }
    }
  }

  Print(aRoute, aCostMap) {
    let mapAsString = "";
    let routeTerrain = "";
    let toolRoute = "";
    for (let y = 0; y < this.mCaveMap.length; y++) {
      let line = "";
      for (let x = 0; x < this.mCaveMap[y].length; x++) {
        let terrainType = this.GetTerrainType(this.mCaveMap[y][x]);
        let nodeCost = aCostMap.GetNodeCost({x , y});
        if (IsRoutePos({ x, y}, aRoute)) 
        {
          line += 'x'
          routeTerrain += terrainType;
          toolRoute += nodeCost.tool.toString();
        }
        else
          line += terrainType;
      }
  
      mapAsString += line + "\r\n";
    }
  
    mapAsString += "\r\n";
    mapAsString += routeTerrain;
    mapAsString += "\r\n";
    mapAsString += toolRoute;
    return mapAsString;
  }

  PrintRoute(aRoute) {
    for (let i = 0; i < aRoute.length; i++)
    {
      console.log(this.mCaveMap[aRoute[i].y][aRoute[i].x]);
    }
  }
}

function RenderMapWithPos(aPos, aMap) {
  let map = JSON.parse(JSON.stringify(aMap));
  map[aPos.y][aPos.x] = 'X';
  return RenderMap(map);
}

class FastestRoute {
  constructor(aTarget, aCaveMap) {
    this.mTarget = aTarget;
    this.mCaveMap = aCaveMap;
    this.mPriorityList = null;
    this.mCostMap = null;
  }

  TargetReached(aPos) {
    return (aPos.x == this.mTarget.x) && (aPos.y == this.mTarget.y);
  }

  SwitchTool(aPos, aTool, aToolSet) {
    let groundType = this.mCaveMap.GetGroundAtPos(aPos);

    if (groundType == '.') {
      if (aTool == none)
        return { s: true, t: aToolSet.rocky };
    }
    else if (groundType == '|') {
      if (aTool == climbGear)
        return { s: true, t: aToolSet.narrow };
    }
    else if (groundType == '=') {
      if (aTool == torch)
        return { s: true, t: aToolSet.wet };
    }

    return { s: false, t: aTool };
  }

  ProcessNode(aPos, aCurrent, aToolSet) {
    if (!this.mCostMap.IsVisited(aPos)) {
      let ret = this.SwitchTool(aPos, aCurrent.tool, aToolSet);
      let cost = aCurrent.cost + 1 + (ret.s ? 7 : 0);
      if (this.mCostMap.UpdateCost(aPos, cost, { x: aCurrent.x, y: aCurrent.y }))
        this.mCostMap.UpdateTool(aPos, ret.t);
      this.mPriorityList.Add(aPos);
    }
  }

  VisitNeighbors(aPos, aToolSet) {
    let x = aPos.x;
    let y = aPos.y;

    let leftPos = { x: x - 1, y };
    if (leftPos.x >= 0) {
      this.ProcessNode(leftPos, aPos, aToolSet);
    }

    let topPos = { x, y: y - 1 };
    if (topPos.y >= 0) {
      this.ProcessNode(topPos, aPos, aToolSet);
    }

    let rightPos = { x: x + 1, y };
    this.ExtendMap(rightPos);
    this.ProcessNode(rightPos, aPos, aToolSet);

    let bottomPos = { x, y: y + 1 };
    this.ExtendMap(bottomPos);
    this.ProcessNode(bottomPos, aPos, aToolSet);
  }

  ExtendMap(aPos) {
    this.mCaveMap.ExtendMap(aPos);
    this.mCostMap.ExtendMap(aPos);
  }

  ComputeDuration(aToolSet) {
    this.mPriorityList = new PriorityList(this.mCostMap);
    let currentPos = { x: 0, y: 0, cost: 0, tool: torch, visited: false };
    while (true) {
      //console.log(RenderMapWithPos(currentPos, aCaveMap));
      this.VisitNeighbors(currentPos, aToolSet);

      this.mCostMap.MarkVisited(currentPos, this.mPriorityList);

      if (this.TargetReached(currentPos))
        break;

      currentPos = this.GetNextCurrent();
    }
    if (currentPos.tool != torch) {
      let targetCost = this.mCostMap.GetNodeCost(currentPos);
      targetCost.tool = torch;
      targetCost.cost += 7;
    }
  }

  Compute() {
    let rockyTool = [torch, climbGear];
    let narrowTool = [none, torch];
    let wetTool = [climbGear, none];

    let minCost = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < rockyTool.length; i++)
      for (let j = 0; j < narrowTool.length; j++)
        for (let k = 0; k < wetTool.length; k++) {
          this.mCostMap = new CostMap();
          this.mCostMap.Init(this.mCaveMap.GetWidth(), this.mCaveMap.GetHeight());
          let toolSet = { rocky: rockyTool[i], wet: wetTool[k], narrow: narrowTool[j] };
          this.ComputeDuration(toolSet);

          let targetCost = this.mCostMap.GetNodeCost(this.mTarget);
          if (targetCost.cost < minCost) {
            console.log(JSON.stringify(targetCost.cost));

            let route = this.mCostMap.ComputeRoute(this.mTarget);

            fs.writeFileSync("CostMap.txt", this.mCostMap.Print(route));
            fs.writeFileSync("CaveMap.txt", this.mCaveMap.Print(route, this.mCostMap));

            let rubyTerrain = "";
            let rubyTool = "";
            let rr = JSON.parse(fs.readFileSync("./RubyRoute2.txt"));
            let rubyMap = this.mCaveMap.Print(rr, this.mCostMap)

            for (let m = 0; m < rr.length; m++) 
            {
              if (rr[m].terrain == 0)
                rubyTerrain += '.';
              else if (rr[m].terrain == 1)
                rubyTerrain += '=';
              else if (rr[m].terrain == 2)
                rubyTerrain += '|';
              rubyTool += rr[m].tool.toString();
            }
            
            rubyMap += "\r\n";
            rubyMap += rubyTerrain;
            rubyMap += "\r\n";
            rubyMap += rubyTool;

            fs.writeFileSync("CaveMap2.txt", rubyMap);

            minCost = targetCost.cost;
          }
        }
    let route = this.mCostMap.ComputeRoute(this.mTarget);
    console.log(route);

    //this.mCaveMap.PrintRoute(route);
  }

  GetNextCurrent() {
    if (!this.mPriorityList.IsEmpty())
      return this.mPriorityList.GetNext();

    let min = Number.MAX_SAFE_INTEGER;
    let pos;
    for (let i = 0; i < this.mCostMap.length; i++)
      for (let j = 0; j < this.mCostMap[i].length; j++) {
        let nodeCost = this.mCostMap.GetNodeCost({ x: j, y: i });

        if (nodeCost.visited)
          continue;

        if ((nodeCost.cost != -1) && (nodeCost.cost < min)) {
          min = nodeCost.cost;
          pos = { x: j, y: i, tool: nodeCost.tool, cost: nodeCost.cost };
        }
      }
    return pos;
  }
}

console.log(depth);
console.log(target);

var caveMap = new CaveMap(target, depth, factor);
caveMap.Init();

console.log(caveMap.GetRiskLevel());

var fastestRoute = new FastestRoute(target, caveMap);
fastestRoute.Compute();

//console.log(RenderMap(caveMap));

//console.log(costMap.length + " " + costMap[0].length);