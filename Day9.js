class LinkedList {
  constructor() 
  {
    this.mHead = null;
    this.mTail = null;
  }

  AddTail(aListNode) 
  {
    if (this.mTail == null) {
      this.mTail = aListNode;
      this.mHead = aListNode;
    }
    else
    {
      this.mTail.mNext = aListNode;
      aListNode.mPrev = this.mTail;
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

list.AddTail(new ListNode({ x: 1, y: 2}));
list.AddTail(new ListNode({ x: 4, y: 8}));

list.PrintList();
