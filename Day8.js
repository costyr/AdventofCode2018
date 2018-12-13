const fs = require('fs');

var rawDay8Input = fs.readFileSync('./Day8Input.txt');

var day8Input = rawDay8Input.toString().split(' ');

var parsedInput = [];
for (let i = 0; i < day8Input.length; i++)
  parsedInput.push(parseInt(day8Input[i]));

function VisitNode(aNodes, aIndex) 
{
  let index = aIndex;
  let childCount = aNodes[index++];
  let metadataCount = aNodes[index++];
  let childMetadata = 0;
  if (childCount > 0) 
  {
    for (let i = 0; i < childCount; i++) 
    {
      let ret = VisitNode(aNodes, index);
      index = ret.i;
      childMetadata += ret.m;
    }
  }
  
  if (metadataCount > 0) 
  {
    for (let j = 0; j < metadataCount; j++)
      childMetadata += aNodes[index + j];
    index += metadataCount;
  }
  
  return { i: index, m: childMetadata };
}

function VisitNode2(aNodes, aIndex, aNodeList) 
{
  let index = aIndex;
  let childCount = aNodes[index++];
  let metadataCount = aNodes[index++];
  let childIndex = [];
  if (childCount > 0) 
  {
    for (let i = 0; i < childCount; i++) 
    {
      childIndex.push(index);
      index = VisitNode2(aNodes, index, aNodeList);
    }
  }
  
  let metaDataSum = 0
  let nodeMetadataArray = [];
  if (metadataCount > 0) 
  {
    for (let j = 0; j < metadataCount; j++) 
    {
      let metaDataValue = aNodes[index + j];
      if (childCount == 0)
        metaDataSum += metaDataValue;
      nodeMetadataArray.push(metaDataValue);
    }
    index += metadataCount;
  }
  
  if (childCount == 0)
    aNodeList[aIndex] = { nodeValue: metaDataSum };
  else
    aNodeList[aIndex] = { childs: childIndex, metadata: nodeMetadataArray };

  return index;
}

function GetNodeValue(aNodeList, aNode) 
{
  if (aNode.nodeValue === undefined)
  {
    let nodeValue = 0;
    for (let i = 0; i < aNode.metadata.length; i++)
    {
      let childIndex = aNode.metadata[i] - 1;
      if (childIndex < aNode.childs.length)
      {
        let nodeIndex = aNode.childs[childIndex];
        nodeValue += GetNodeValue(aNodeList, aNodeList[nodeIndex]);
      }
    }
    return nodeValue;      
  }
  else
    return aNode.nodeValue;
}

console.log(VisitNode(parsedInput, 0));

var nodeList = [];

VisitNode2(parsedInput, 0, nodeList);

console.log(JSON.stringify(nodeList));

console.log(GetNodeValue(nodeList, nodeList[0]));