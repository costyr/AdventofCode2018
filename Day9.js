class LinkedList {
  constructor() 
  {
    this.mHead = null;
    this.mTail = null;
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
  }

  GetValueAt(aIndex) 
  {
     this.GetNodeAt(aIndex).mValue;
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

  RemoveNode(aNode) 
  {
    if (aNode == this.mHead)
    {
      let next = aNode.mNext;
      if (next)
        next.mPrev = null;
    }
  }

  PrintList() 
  {
    let node = this.mHead;
    while (node)
    {
      console.log(JSON.stringify(node.mValue));
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

var list = new LinkedList();

list.AddTail({ x: 1, y: 2});
list.AddTail({ x: 4, y: 8});
list.AddTail({ x: 10, y: 30});
list.AddTail({ x: 5, y: 14});

list.PrintList();

console.log(JSON.stringify(list.GetValueAt(2)));
