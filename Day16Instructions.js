
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
  Eqrr
}
