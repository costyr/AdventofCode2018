const util = require('./Util.js');

var max = { "x": 0, "y": 0 };
var parsedInput = util.ParseInput('./Day6Input.txt', util.ParseCoordElem.bind(null, max), '\r\n');

var grid = [];
var gridLength = Math.max(max.x, max.y) + 1;

for (i = 0; i < gridLength; i++) {
    grid[i] = [];
    for (j = 0; j < gridLength; j++)
        grid[i][j] = { "id": -1, "dist": gridLength, "isPt": false };
}

for (i = 0; i < parsedInput.length; i++) {
    let ptX = parsedInput[i].x;
    let ptY = parsedInput[i].y;
    grid[ptX][ptY] = { "id": i, "dist": -1, "isPt": true };
}

for (i = 0; i < parsedInput.length; i++) {
    let ptX = parsedInput[i].x;
    let ptY = parsedInput[i].y;

    for (x = 0; x < gridLength; x++)
        for (y = 0; y < gridLength; y++) {
            let isPt = grid[x][y].isPt;
            if (!isPt) {
                let dist = Math.abs(ptX - x) + Math.abs(ptY - y);
                if (dist < grid[x][y].dist) {
                    grid[x][y].id = i;
                    grid[x][y].dist = dist;
                }
                else if (dist == grid[x][y].dist) {
                    grid[x][y].id = ".";
                }
            }
        }
}

function PrintGrid(aGrid) {
    for (i = 0; i < aGrid.length; i++) {
        let line = "";
        for (j = 0; j < aGrid.length; j++) {
            line += aGrid[j][i].id.toString() + " ";
        }
        console.log(line);
    }

}

PrintGrid(grid);

function IsAtBorder(aX, aY, aLength) {
    if ((aX == 0) || (aX == aLength - 1))
        return true;
    if ((aY == 0) || (aY == aLength - 1))
        return true;

    return false;
}

var maxArea = 0;
var areaId;
var areas = [];
for (i = 0; i < parsedInput.length; i++) {
    let area = 0;
    let hasInfinite = false;
    for (y = 0; y < grid.length; y++)
        for (x = 0; x < grid.length; x++)
            if (grid[x][y].id === i) {
                if (IsAtBorder(x, y, grid.length))
                    hasInfinite = true;
                area++;
            }
    areas.push(area);
    if (!hasInfinite && area > maxArea) {
        areaId = i;
        maxArea = area;
    }
}

const kMinSum = 10000;
let minArea = 0;
for (x = 0; x < grid.length; x++)
    for (y = 0; y < grid.length; y++) {
        let dist = 0;
        for (i = 0; i < parsedInput.length; i++) {
          let ptX = parsedInput[i].x;
          let ptY = parsedInput[i].y;
          dist += Math.abs(ptX - x) + Math.abs(ptY - y);  
        }
        if (dist < kMinSum) 
          minArea ++;
    }

console.log("Area Id: " + areaId + " Max Area:" + maxArea);

console.log("Min area: " + minArea);

