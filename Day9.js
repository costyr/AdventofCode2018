const list = require('./LinkedList');

/*var list = new LinkedList();

list.AddTail({ x: 1, y: 2});
list.AddTail({ x: 4, y: 8});
list.AddTail({ x: 10, y: 30});
list.AddTail({ x: 5, y: 14});

list.PrintList();

list.RemoveNodeAt(2);

list.PrintList();

let node1 = list.GetNodeAt(1);

list.AddAfter(node1, {x: 99, y: 77});

list.PrintList();

console.log(JSON.stringify(list.GetValueAt(2)));*/

function VisitMarbleNode(aNode, aTotal, aCurrent) 
{
  if (aNode == aCurrent)
    aTotal += " (" + aNode.mValue.marble + ") ";
  else 
    aTotal += " " + aNode.mValue.marble + " ";

  return aTotal;
}

function MarbleToString(aValue, aIsCurrent) 
{
  let marble = aIsCurrent ? "(" : "";
  marble += aValue;
  marble += aIsCurrent ? ")" : "";

  let line = " ";
  line += marble;

  return line;
}

function PrintMarble(aFirstMarble, aCurrent) 
{
  let node = aFirstMarble;
  let line = "";
  while (node)
  {
    line += MarbleToString(node.mValue.marble, (node == aCurrent));
    node = node.mNext;
  }
  console.log(line);
}

var marble = new list.LinkedList();

var playerCount = 429; //429; 9; 
var lastMarbleWorth = 7090100; // 25; // 70901;

var playerScore = [];

for (let i = 0; i < playerCount; i++)
  playerScore.push(0);

marble.AddTail( { marble: 0 } );

var currentMarble = marble.GetHead();
var firstMarble = currentMarble; 

var currentPlayer = 0;

for (let i = 1; i < lastMarbleWorth + 1; i++)
{
  let newMarble = { marble: i };

  if (marble.GetSize() == 1)
    currentMarble = marble.AddTail( newMarble );
  else if (i % 23 == 0)
  {
    let nodeToRemove = marble.GetNodeNthPosBackFromNode(currentMarble, 7);

    //console.log("abcd " + i + " " + JSON.stringify(nodeToRemove.mValue));

    //PrintMarble(firstMarble, currentMarble);

    let bonusMarble = nodeToRemove.mValue.marble;

    playerScore[currentPlayer] += i + bonusMarble;

    currentMarble = nodeToRemove.mNext;
    if (currentMarble == null)
      currentMarble = firstMarble;

    marble.RemoveNode(nodeToRemove);
  }
  else 
  {
    let firstAfter = currentMarble.mNext;

    currentMarble = firstAfter ? marble.AddAfter( firstAfter, newMarble) : marble.AddAfter(firstMarble, newMarble);
  }

  currentPlayer ++;
  if (currentPlayer == playerCount)
    currentPlayer = 0;

  //PrintMarble(firstMarble, currentMarble);
  //console.log(JSON.stringify(playerScore));
} 

let maxScore = 0;
for (let i = 0; i < playerScore.length; i++)
  if (playerScore[i] > maxScore)
    maxScore = playerScore[i];

console.log(JSON.stringify(playerScore));
console.log(maxScore);