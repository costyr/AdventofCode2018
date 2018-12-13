var fuelGrid = [];

var gridSize = 300;

var gridSerialNumber = 2568;

for (let x = 0; x < gridSize; x++) {
  if (fuelGrid[x] === undefined)
    fuelGrid[x] = [];
  for (let y = 0; y < gridSize; y++) {
    let rankId = x + 1 + 10;
    let powerLevel = rankId * (y + 1);
    powerLevel += gridSerialNumber;
    powerLevel = powerLevel * rankId;
    powerLevel = Math.floor((powerLevel % 1000) / 100)
    powerLevel -= 5;
    fuelGrid[x][y] = powerLevel;
  }
}

function GetMaxPower(aFuelGrid, aSquareSize) {
  let maxPowerLevel = 0;
  let maxSquareX = 0;
  let maxSquareY = 0;
  for (let x = 0; x < gridSize; x++)
    for (let y = 0; y < gridSize; y++) {
      let squareX = x + aSquareSize;
      let squareY = y + aSquareSize;
      if (squareX > gridSize ||
        squareY > gridSize)
        continue;

      let squarePowerLevel = 0;
      for (let i = x; i < x + aSquareSize; i++)
        for (let j = y; j < y + aSquareSize; j++)
          squarePowerLevel += fuelGrid[i][j];

      if (squarePowerLevel > maxPowerLevel) {
        maxPowerLevel = squarePowerLevel;
        maxSquareX = x;
        maxSquareY = y;
      }
    }
  return { x: maxSquareX, y: maxSquareY, powerLevel: maxPowerLevel };  
}

var squareWithMaxPower = GetMaxPower(fuelGrid, 3);

console.log((squareWithMaxPower.x + 1) + "," + (squareWithMaxPower.y + 1));

let maxSizeMaxPower = 0;
let maxSizeMaxPowerSquare;
let squareSize = 0;
for (let i = 0; i < gridSize; i++) 
{
  let ret = GetMaxPower(fuelGrid, i);
  if (ret.powerLevel > maxSizeMaxPower)
  {
    maxSizeMaxPower = ret.powerLevel;
    maxSizeMaxPowerSquare = ret;
    squareSize = i;
  }
}

console.log((maxSizeMaxPowerSquare.x + 1) + "," + (maxSizeMaxPowerSquare.y + 1) + "," + squareSize);