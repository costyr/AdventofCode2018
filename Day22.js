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

function IsRoutePos(aPos, aRoute) {
  for (let i = 0; i < aRoute.length; i++)
    if ((aPos.x == aRoute[i].x) && (aPos.y == aRoute[i].y))
      return i;
  return -1;
}

class SimpleList {
  constructor() {
    this.mList = [];
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
        (aPos.y == this.mList[i].y) &&
        (aPos.tool == this.mList[i].tool))
        return i;
    return -1;
  }

  IsEmpty() {
    return (this.mList.length == 0);
  }
}

class PriorityList extends SimpleList {
  constructor(aCostMap) {
    super();
    this.mCostMap = aCostMap;
  }

  GetNext() {
    let min = Number.MAX_SAFE_INTEGER;
    let nextPos;
    for (let i = 0; i < this.mList.length; i++) {
      let pos = this.mList[i];
      let nodeCost = this.mCostMap.GetNodeCost(pos).cost[pos.tool];

      let estimate = nodeCost;// + ComputeEstimated(pos, target, j);

      if (estimate < min) {
        min = estimate;
        nextPos = pos;
      }
    }

    return { ...nextPos };
  }
};

function IsVisited(aPos, aCostMap) {
  return aCostMap.GetNodeCost(aPos).visited[aPos.tool];
}

function MarkVisited(aPos, aPriorityList, aCostMap) {
  aPriorityList.Remove(aPos);
  aCostMap.GetNodeCost(aPos).visited[aPos.tool] = true;
}

class CostMap {
  constructor() {
    this.mCostMap = [];
  }

  Init(aWidth, aHeight) {
    for (let i = 0; i < aHeight; i++) {
      if (this.mCostMap[i] === undefined)
        this.mCostMap[i] = [];
      for (let j = 0; j < aWidth; j++)
        this.mCostMap[i][j] = { cost: [], visited: [], cameFrom: [] };
    }

    this.mCostMap[0][0].cost[torch] = 0;
  }

  GetNodeCost(aPos) {
    return this.mCostMap[aPos.y][aPos.x];
  }

  UpdateCost(aPos, aTool, aCost, aCameFrom) {
    let nodeCost = this.GetNodeCost(aPos);
    if (nodeCost.cost[aTool] === undefined) {
      nodeCost.cost[aTool] = aCost;
      nodeCost.cameFrom[aTool] = aCameFrom;
      return true;
    }
    else {
      if (aCost < nodeCost.cost[aTool]) {
        nodeCost.cost[aTool] = aCost;
        nodeCost.cameFrom[aTool] = aCameFrom;
        return true;
      }
    }

    return false;
  }

  GetMinCost(aPos) {
    let cost = this.mCostMap[aPos.y][aPos.x].cost;
    let min = Number.MAX_SAFE_INTEGER;
    for (let i = 0; i < cost.length; i++)
      if ((cost[i] != -1) && (cost[i] < min))
        min = cost[i];
    return min == Number.MAX_SAFE_INTEGER ? -1 : min;
  }

  Print(aRoute) {
    let lines = "";
    for (let i = 0; i < this.mCostMap.length; i++) {
      let line = "";
      for (let j = 0; j < this.mCostMap[i].length; j++) {
        let cost = this.GetMinCost({ x: j, y: i });
        let isRoutePos = IsRoutePos({ x: j, y: i }, aRoute) != -1;
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

  ComputeRoute(aPos) {
    let route = [];
    let cameFrom = aPos;
    while (true) {
      route.push(cameFrom);

      if ((cameFrom.x == 0) && (cameFrom.y == 0))
        break;

      cameFrom = this.mCostMap[cameFrom.y][cameFrom.x].cameFrom[cameFrom.tool];
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
    let width = 100; //this.mTarget.x + 1;
    let height = 1000; //this.mTarget.y + 1;

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
    else {
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

  Print(aRoute, aCostMap) {
    let mapAsString = "";
    let routeTerrain = "";
    let toolRoute = "";
    for (let y = 0; y < this.mCaveMap.length; y++) {
      let line = "";
      for (let x = 0; x < this.mCaveMap[y].length; x++) {
        let terrainType = this.GetTerrainType(this.mCaveMap[y][x]);
        //let nodeCost = aCostMap.GetNodeCost({x , y});
        let routeIndex = IsRoutePos({ x, y }, aRoute);
        if (routeIndex != -1) {
          line += 'x'
          routeTerrain += terrainType;
          toolRoute += aRoute[routeIndex].tool.toString();
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
    for (let i = 0; i < aRoute.length; i++) {
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
    this.mVisitedList = null;
    this.mCostMap = null;
  }

  TargetReached() {
    return IsVisited({ ...this.mTarget, tool: torch }, this.mCostMap) && 
           IsVisited({ ...this.mTarget, tool: climbGear }, this.mCostMap);
  }

  GetToolsForGround(aGroundType) {
    if (aGroundType == '.')
      return [torch, climbGear];
    else if (aGroundType == '=')
      return [none, climbGear];
    else if (aGroundType == '|')
      return [none, torch];
  }

  ProcessNode(aPos, aCurrent) {
    let groundType = this.mCaveMap.GetGroundAtPos(aPos);

    let toolsNext = this.GetToolsForGround(groundType);

    let costNodeCurrent = this.mCostMap.GetNodeCost(aCurrent);

    let currentCost = costNodeCurrent.cost[aCurrent.tool];

    if (toolsNext.indexOf(aCurrent.tool) == -1)
      return;

    for (let i = 0; i < toolsNext.length; i++) {

      let nextTool = toolsNext[i];

      if (IsVisited({ ...aPos, tool: nextTool }, this.mCostMap))
        continue;

      let nextCost = currentCost + 1;

      if (aCurrent.tool != nextTool)
        nextCost += 7;

      this.mCostMap.UpdateCost(aPos, nextTool, nextCost, { x: aCurrent.x, y: aCurrent.y, tool: aCurrent.tool });

      this.mPriorityList.Add({ ...aPos, tool: nextTool });
    }
  }

  VisitNeighbors(aPos) {
    let x = aPos.x;
    let y = aPos.y;

    let leftPos = { x: x - 1, y };
    if (leftPos.x >= 0) {
      this.ProcessNode(leftPos, aPos);
    }

    let topPos = { x, y: y - 1 };
    if (topPos.y >= 0) {
      this.ProcessNode(topPos, aPos);
    }

    let rightPos = { x: x + 1, y };
    if (rightPos.x < 100)
      this.ProcessNode(rightPos, aPos);

    let bottomPos = { x, y: y + 1 };
    if (bottomPos.y < 1000)
      this.ProcessNode(bottomPos, aPos);
  }

  ComputeDuration() {
    this.mCostMap = new CostMap();
    this.mCostMap.Init(this.mCaveMap.GetWidth(), this.mCaveMap.GetHeight());

    this.mPriorityList = new PriorityList(this.mCostMap);
    let currentPos = { x: 0, y: 0, tool: torch };
    while (true) {
      this.VisitNeighbors(currentPos);

      MarkVisited(currentPos, this.mPriorityList, this.mCostMap);

      if (this.TargetReached())
        break;

      currentPos = this.GetNextCurrent();
    }
    let targetCost = this.mCostMap.GetNodeCost(currentPos);
    targetCost.cost[climbGear] += 7;
    console.log(Math.min(targetCost.cost[torch], targetCost.cost[climbGear]));

    let route = this.mCostMap.ComputeRoute( { ...this.mTarget, tool: torch });

    fs.writeFileSync("CostMap.txt", this.mCostMap.Print(route));
    fs.writeFileSync("CaveMap.txt", this.mCaveMap.Print(route, this.mCostMap));
  }

  GetNextCurrent() {
    if (!this.mPriorityList.IsEmpty())
      return this.mPriorityList.GetNext();
  }
}

console.log(depth);
console.log(target);

var caveMap = new CaveMap(target, depth, factor);
caveMap.Init();

console.log(caveMap.GetRiskLevel());

var fastestRoute = new FastestRoute(target, caveMap);
fastestRoute.ComputeDuration();
