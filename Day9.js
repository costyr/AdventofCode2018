class LinkedList {
  constructor() 
  {
    this.mHead = null;
    this.mTail = null;
    this.mSize = 0;
  }

  GetTail() 
  {
    return this.mTail;
  }

  GetHead() 
  {
    return this.mHead;
  }

  GetSize() 
  {
    return this.mSize;
  }

  AddTail(aValue) 
  {
    let listNode = new ListNode(aValue);

    if (this.mTail == null) {
      this.mTail = listNode;
      this.mHead = listNode;
    }
    else
    {
      this.mTail.mNext = listNode;
      listNode.mPrev = this.mTail;
      this.mTail = listNode;
    }

    this.mSize ++;

    return listNode;
  }

  AddHead(aValue) 
  {
    let listNode = new ListNode(aValue);
   
    if (this.mTail == null) {
      this.mTail = listNode;
      this.mHead = listNode;
    }
    else 
    {
      listNode.mNext = this.mHead;
      this.mHead.mPrev = listNode;
      this.mHead = listNode;
    }

    this.mSize ++;

    return listNode;
  }

  AddAfter(aNode, aValue) 
  {
    let listNode = new ListNode(aValue);

    if (aNode)
    {
      let next = aNode.mNext;
      if (next) 
        next.mPrev = listNode;

      aNode.mNext = listNode;
      listNode.mNext = next;
      listNode.mPrev = aNode;
    }

    this.mSize ++;

    return listNode;
  }

  GetValueAt(aIndex) 
  {
    let node = this.GetNodeAt(aIndex)
    if (node)
      return node.mValue;
    return null;
  }

  GetNodeAt(aIndex) 
  {
    let i = 0;
    let node = this.mHead;
    while (node)
    {
      if (aIndex == i)
        return node;
      node = node.mNext;
      i++;
    }

    return null;
  }

  GetNodeNthPosBackFromNode(aNode, aPosNumber) 
  {
    let node = aNode;
    let count = aPosNumber;
    while (count > 0)
    {
      if (node == null)
        node = this.mTail;
      else
        node = node.mPrev;
      count --;
    }
    
    return node;
  }

  RemoveNode(aNode) 
  {
    if (aNode == this.mHead)
    {
      let next = aNode.mNext;
      if (next)
        next.mPrev = null;
      aNode.mNext = null;
      this.mHead = next;
    }
    else if (aNode == this.mTail)  
    {
      let prev = aNode.mPrev;
      if (prev)
        prev.mNext = null;
      aNode.mPrev = null;
      this.mTail = prev;   
    }
    else 
    {
      let prev = aNode.mPrev;
      prev.mNext = aNode.mNext;
      aNode.mNext.mPrev = prev;
      aNode.mNext = null;
      aNode.mPrev = null;
    }

    this.mSize --;
  }

  RemoveNodeAt(aIndex) 
  {
    let node = this.GetNodeAt(aIndex);
    if (node)
      this.RemoveNode(node);
    return node;
  }

  PrintList() 
  {
    console.log();
    let node = this.mHead;
    while (node)
    {
      console.log(JSON.stringify(node.mValue));
      node = node.mNext;
    }
  }

  VisitList(aFunction, aTotal) 
  {
    let node = this.mHead;
    while (node)
    {
      aFunction(node, aTotal);
      node = node.mNext;
    }
  }
}

class ListNode {
  constructor(aValue) 
  {
    this.mValue = aValue;
    this.mNext = null;
    this.mPrev = null;
  }
}

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
}

function PrintMarble(aMarble, aCurrent) 
{
  let line = "";
  aMarble.VisitList(VisitMarbleNode.bind(aCurrent), line);
  console.log(line);
}

var marble = new LinkedList();

var playerCount = 429;
var lastMarbleWorth = 70902;

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

  if (i % 23 == 0)
  {
    playerScore[currentPlayer] += i;
    
    let nodeToRemove = marble.GetNodeNthPosBackFromNode(currentMarble, 7);

    playerScore[currentPlayer] += nodeToRemove.mValue.marble;
    
    marble.RemoveNode(nodeToRemove);
  }

  if (marble.GetSize() == 1)
    currentMarble = marble.AddTail( newMarble );
  else 
  {
    let firstAfter = currentMarble.mNext;

    currentMarble = firstAfter ? marble.AddAfter( firstAfter, newMarble) : marble.AddAfter(firstMarble, newMarble);
  }

  currentPlayer ++;
  if (currentPlayer == playerCount)
    currentPlayer = 0;

  PrintMarble(marble, currentMarble);
} 

console.log(JSON.stringify(playerScore));