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

var registers = [0, 0, 0, 0];
var instructionSet = [];
instructionSet.push(new Addr(registers));
instructionSet.push(new Addi(registers));
instructionSet.push(new Mulr(registers));
instructionSet.push(new Muli(registers));
instructionSet.push(new Banr(registers));
instructionSet.push(new Bani(registers));
instructionSet.push(new Borr(registers));
instructionSet.push(new Bori(registers));
instructionSet.push(new Setr(registers));
instructionSet.push(new Seti(registers));
instructionSet.push(new Gtir(registers));
instructionSet.push(new Gtri(registers));
instructionSet.push(new Gtrr(registers));
instructionSet.push(new Eqir(registers));
instructionSet.push(new Eqri(registers));
instructionSet.push(new Eqrr(registers));

function LoadSamples(aInputFile) {
  let rawInput = fs.readFileSync(aInputFile);

  let input = rawInput.toString().split('\r\n\r\n');

  let instSamples = [];
  for (let i = 0; i < input.length; i++) {
    let line = input[i].split('\r\n');
    let regBefore = JSON.parse(line[0].split(': ')[1]);
    let instStr = line[1].split(' ');
    let inst = [];
    instStr.map(function (aValue) {
      inst.push(parseInt(aValue));
      return inst;
    }, inst);
    let regAfter = JSON.parse(line[2].split(': ')[1]);
    instSamples.push({ before: regBefore, inst: inst, after: regAfter });
  }

  return instSamples;
}

var samples = LoadSamples("./Day16Input.txt");

var opCodes = [];
let totalCount = 0;
for (let i = 0; i < samples.length; i++) {
  let matchCount = 0;
  for (let j = 0; j < instructionSet.length; j++) {
    instructionSet[j].SetRegisters(samples[i].before);
    if (instructionSet[j].TestInstruction(samples[i].inst, samples[i].after)) {
      if (opCodes[instructionSet[j].mOpCode] === undefined)
        opCodes[instructionSet[j].mOpCode] = [];

      let opCodeList = opCodes[instructionSet[j].mOpCode];
      let instCode = samples[i].inst[0];

      matchCount++;
      if (!opCodeList.includes(instCode))
        opCodeList.push(instCode);
      //console.log(instructionSet[j].mOpCode);
    }
  }

  if (matchCount > 2)
    totalCount++;
}

//console.log(samples);
console.log(opCodes);
console.log(totalCount);

var opCodeMap = [];
while (true) {
  let reduce = [];
  let toRemove = [];
  for (let opCode in opCodes)
    if ((opCodeMap[opCode] === undefined) &&
      (opCodes[opCode].length == 1)) {
      let instCode = opCodes[opCode][0];
      reduce.push(instCode);
      opCodeMap[opCode] = instCode;
      toRemove.push(opCode);
    }

  for (let i = 0; i < toRemove.length; i++)
    delete opCodes[toRemove[i]];

  if (reduce.length == 0)
    break;

  for (let i = 0; i < reduce.length; i++)
    for (let opCode in opCodes) {
      let instIndex = opCodes[opCode].indexOf(reduce[i]);
      if (instIndex != -1)
        opCodes[opCode].splice(instIndex, 1);
    }
}

console.log(opCodeMap);
console.log(opCodes);

var instCodeMap = [];
for (let i = 0; i < instructionSet.length; i++) {
  let instCode = opCodeMap[instructionSet[i].mOpCode];

  instCodeMap[instCode] = instructionSet[i];
}

function GetInst(aOpCode) {
  return instCodeMap[aOpCode];
}

console.log(instCodeMap);

var testFailed = false;
for (let i = 0; i < samples.length; i++) {
  let inst = GetInst(samples[i].inst[0]);

  inst.SetRegisters(samples[i].before);
  if (!inst.TestInstruction(samples[i].inst, samples[i].after)) {
    testFailed = true;
    break;
  }
}

console.log(testFailed);

for (let i = 0; i < registers.length; i++)
  registers[i] = 0;

for (let i = 0; i < instructionSet.length; i++)
  instructionSet[i].SetRegisters(registers);

var rawInput2 = fs.readFileSync("./Day16Input2.txt");

var input2 = rawInput2.toString().split('\r\n');

for (let i = 0; i < input2.length; i++)
{
  let line = input2[i].split(' ');

  let instLine = [];
  for (let j = 0; j < line.length; j++)
    instLine.push(parseInt(line[j]));
  
  console.log(instLine);

  let inst = GetInst(instLine[0]);
 
  inst.TestInstruction(instLine, []);
}

console.log(registers[0]);