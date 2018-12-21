
function ComputeMapFilePath(aFilePath) {
  let index = aFilePath.lastIndexOf('.');
  let mapFilePath = aFilePath.substr(0, index);
  mapFilePath += "Map.txt";

  return mapFilePath;
}

module.exports = {
  ComputeMapFilePath
}
