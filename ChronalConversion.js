const fs = require('fs');

function RegistersAreEqual(aRegistersBefore, aRegistersAfter) {
  for (let i = 0; i < aRegistersBefore.length; i++)
    if (aRegistersBefore[i] != aRegistersAfter[i])
      return false;
  return true;
}

function InstFromArray(aInstruction) {
  return { op: aInstruction[0], a: aInstruction[1], b: aInstruction[2], c: aInstruction[3] };
}

class Instruction {
  constructor(aRegisters) {
    this.mRegisters = aRegisters;
  }

  SetRegisters(aRegisters) {
    for (let i = 0; i < aRegisters.length; i++)
      this.mRegisters[i] = aRegisters[i];
  }
}

class Addr extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "addr";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a] + registers[inst.b];

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Addi extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "addi";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a] + inst.b;

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Mulr extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "mulr";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a] * registers[inst.b];

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Muli extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "muli";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a] * inst.b;

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Banr extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "banr";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a] & registers[inst.b];

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Bani extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "bani";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a] & inst.b;

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Borr extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "borr";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a] | registers[inst.b];

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Bori extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "bori";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a] | inst.b;

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Setr extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "setr";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a];

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Seti extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "seti";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = inst.a;

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Gtir extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "gtir";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = inst.a > registers[inst.b] ? 1 : 0;

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Gtri extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "gtri";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a] > inst.b ? 1 : 0;

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Gtrr extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "gtrr";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a] > registers[inst.b] ? 1 : 0;

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Eqir extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "eqir";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = inst.a == registers[inst.b] ? 1 : 0;

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Eqri extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "eqri";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a] == inst.b ? 1 : 0;

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

class Eqrr extends Instruction {
  constructor(aRegisters) {
    super(aRegisters);
    this.mOpCode = "eqrr";
  }

  TestInstruction(aInstruction, aRegistersAfter) {

    let inst = InstFromArray(aInstruction);
    let registers = this.mRegisters;
    registers[inst.c] = registers[inst.a] == registers[inst.b] ? 1 : 0;

    return RegistersAreEqual(aRegistersAfter, this.mRegisters);
  }
}

function CreateInstructionSet(aRegisters) {
  let instructionSet = [];
  instructionSet['addr'] = new Addr(aRegisters);
  instructionSet['addi'] = new Addi(aRegisters);
  instructionSet['mulr'] = new Mulr(aRegisters);
  instructionSet['muli'] = new Muli(aRegisters);
  instructionSet['banr'] = new Banr(aRegisters);
  instructionSet['bani'] = new Bani(aRegisters);
  instructionSet['borr'] = new Borr(aRegisters);
  instructionSet['bori'] = new Bori(aRegisters);
  instructionSet['setr'] = new Setr(aRegisters);
  instructionSet['seti'] = new Seti(aRegisters);
  instructionSet['gtir'] = new Gtir(aRegisters);
  instructionSet['gtri'] = new Gtri(aRegisters);
  instructionSet['gtrr'] = new Gtrr(aRegisters);
  instructionSet['eqir'] = new Eqir(aRegisters);
  instructionSet['eqri'] = new Eqri(aRegisters);
  instructionSet['eqrr'] = new Eqrr(aRegisters);

  return instructionSet;
}

class ChronalProgram {
  constructor(aInstructionSet, aRegisters)
  {
    this.mIPRegister = 0;
    this.mProgram = [];
    this.mInstructionSet = aInstructionSet;
    this.mRegisters = aRegisters;
  }
  
  Load(aFilePath) {
    let rawInput = fs.readFileSync(aFilePath);
  
    let input = rawInput.toString().split('\r\n');
  
    for (let i = 0; i < input.length; i++) {
      if (i == 0) {
        this.mIPRegister = parseInt(input[i].split(' ')[1]);
      }
      else {
        let line = input[i].split(' ');
  
        let instLine = [];
        for (let j = 0; j < line.length; j++)
          if (j == 0)
            instLine.push(line[j]);
          else
            instLine.push(parseInt(line[j]));
  
        this.mProgram.push(instLine);
      }
    }
  }

  DumpProgram() 
  {
    console.log("IP Register: " + this.mIPRegister);
    console.log(this.mProgram);
  }

  GetNextInstruction(aIndex) {
    if ((aIndex >= 0) && (aIndex < this.mProgram.length))
      return { ret: true, inst: this.mProgram[aIndex] };
  
    return { ret: false };
  }
  
  CompareInst(aInst1, aInst2) 
  {
    for (let i = 0; i < aInst1.length; i++) 
    {
      if (aInst1[i] != aInst2[i])
        return false;
    }
    
    return true;
  }

  DumpProgramState(aInstIndex, aRegistersBefore, aInst, aRegistersAfter) 
  {
    let instStr = aInst[0] + " " + aInst[1] + "," + aInst[2] + "," + aInst[3];
    return aInstIndex + " " + aRegistersBefore + " [" + instStr + "] " + aRegistersAfter;
  }

  FindLoop(aInstOrder, aLoop) 
  {
    if (aLoop.length < aInstOrder.length) 
    {
      let startIndex = aInstOrder.length - aLoop.length;
      for (let i = startIndex; i < aInstOrder.length; i++)
        if (aLoop[i - startIndex] != aInstOrder[i])
          return false;     
      return true;
    }

    return false;
  }

  AddInstToList(aInst, aInstList) 
  {
    let found = false;
    for (let i = 0; i < aInstList.length; i++)
      if (aInst == aInstList[i]) 
      {
        found = true;
        break;
      }
    if (!found)
      aInstList.push(aInst);
  }

  CoollectReg5Values(aValue, aValueList) 
  {
    let found = false;
    for (let i = 0; i < aValueList.length; i++)
      if (aValue == aValueList[i]) 
      {
        found = true;
        break;
      }
    if (!found)
      aValueList.push(aValue);
  }

  Run() {
    let instIndex = 0;
    let breakAt = 60000;
    let dump = [];
    let instOrder = [];
    let findFirstLoopCount = 0;
    let minReg5 = 100000000;
    let instList = [];
    let reg5Values = [];
    let minHaltValue = 100000000000;
    do {
      this.mRegisters[this.mIPRegister] = instIndex;
      let result = this.GetNextInstruction(instIndex);
  
      if (!result.ret)
        break;
  
      let inst = this.mInstructionSet[result.inst[0]];

      if (inst === undefined) {
        console.log("Undefined instruction!");
        break;
      }
  
      let registersBefore = [];
      for (let i = 0; i < this.mRegisters.length; i++)
        registersBefore[i] = this.mRegisters[i];
  
      /*if (CompareInst(result.inst, ['addi', 3, 1, 3]))
      {
        if ((aRegisters[3] == 40) && (aRegisters[2] == 214564646)) 
        {
          aRegisters[3] = 214564645;
          //console.log("Accelarate loop!");
        }
  
        if ((aRegisters[3] == 17) && (aRegisters[2] == 986)) 
        {
          aRegisters[3] = 985; 
          //console.log("Accelarate loop!");
        }
      }*/

      if (this.CompareInst(result.inst, ['eqrr', 5, 0, 4]))
      {
        //if (this.mRegisters[5] != registersBefore[5])
        //console.log(JSON.stringify(this.mRegisters));

        if ((reg5Values.length >= 10995) && (this.mRegisters[5] < minHaltValue))
        {
          minHaltValue = this.mRegisters[5];
          console.log(this.mRegisters[5]);
        } 

        this.CoollectReg5Values(this.mRegisters[5], reg5Values);
        if (reg5Values.length < 10996)
          console.log(reg5Values.length);
      }

      instOrder.push(instIndex);
      this.AddInstToList(instIndex, instList);
  
      inst.TestInstruction(result.inst, []);

      //console.log(JSON.stringify(instList));
  
      //{
      //  console.log(this.DumpProgramState(instIndex, registersBefore, result.inst, this.mRegisters));
      //}
     
      //dump.push(aRegisters);

      if (this.FindLoop(instOrder, [18, 19, 20, 21, 22, 24, 25])) 
      {
        findFirstLoopCount ++;
      }

      if (instOrder.length > 1000)
        instOrder = [];
  
      instIndex = this.mRegisters[this.mIPRegister];
      instIndex++;
      if (instIndex >= this.mProgram.length)
        break;
      
      //breakAt --;
      //if (breakAt <= 0)
      //  break;
  
    } while (true);
  
    return dump;
  }

}

module.exports = {
  Addr,
  Addi,
  Mulr,
  Muli,
  Banr,
  Bani,
  Borr,
  Bori,
  Setr,
  Seti,
  Gtir,
  Gtri,
  Gtrr,
  Eqir,
  Eqri,
  Eqrr,
  CreateInstructionSet,
  ChronalProgram
}
