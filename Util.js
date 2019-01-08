
function ComputeMapFilePath(aFilePath) {
  let index = aFilePath.lastIndexOf('.');
  let mapFilePath = aFilePath.substr(0, index);
  mapFilePath += "Map.txt";

  return mapFilePath;
}

function CopyObject(aObject) {
  return JSON.parse(JSON.stringify(aObject));
}

module.exports = {
  ComputeMapFilePath,
  CopyObject
}
