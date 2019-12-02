const fs = require('fs');

function ComputeMapFilePath(aFilePath) {
  let index = aFilePath.lastIndexOf('.');
  let mapFilePath = aFilePath.substr(0, index);
  mapFilePath += "Map.txt";

  return mapFilePath;
}

function CopyObject(aObject) {
  return JSON.parse(JSON.stringify(aObject));
}

function ParseCoordElem(aMax, aElem) 
{
  let coords = aElem.split(', ');

  let x = parseInt(coords[0]);
  let y = parseInt(coords[1]);

  if (x > aMax.x)
    aMax.x = x;

  if (y > aMax.y)
    aMax.y = y;

  return { "x": x, "y": y };
}

function ParseInt(aElem) 
{
  return parseInt(aElem);
}

function ParseInput(aFilePath, aElemFunc, aSep) 
{
  let rawInput = fs.readFileSync(aFilePath);

  let inputArray = rawInput.toString().split(aSep);

  return inputArray.map(aElemFunc);
}

module.exports = {
  ComputeMapFilePath,
  CopyObject,
  ParseCoordElem,
  ParseInt,
  ParseInput
}
