const fs = require('fs');
const instruction = require('./Day16Instructions.js');

var registers = [0, 0, 0, 0, 0, 0];

function CreateInstructionSet(aRegisters) {
  let instructionSet = [];
  instructionSet['addr'] = new instruction.Addr(aRegisters);
  instructionSet['addi'] = new instruction.Addi(aRegisters);
  instructionSet['mulr'] = new instruction.Mulr(aRegisters);
  instructionSet['muli'] = new instruction.Muli(aRegisters);
  instructionSet['banr'] = new instruction.Banr(aRegisters);
  instructionSet['bani'] = new instruction.Bani(aRegisters);
  instructionSet['borr'] = new instruction.Borr(aRegisters);
  instructionSet['bori'] = new instruction.Bori(aRegisters);
  instructionSet['setr'] = new instruction.Setr(aRegisters);
  instructionSet['seti'] = new instruction.Seti(aRegisters);
  instructionSet['gtir'] = new instruction.Gtir(aRegisters);
  instructionSet['gtri'] = new instruction.Gtri(aRegisters);
  instructionSet['gtrr'] = new instruction.Gtrr(aRegisters);
  instructionSet['eqir'] = new instruction.Eqir(aRegisters);
  instructionSet['eqri'] = new instruction.Eqri(aRegisters);
  instructionSet['eqrr'] = new instruction.Eqrr(aRegisters);

  return instructionSet;
}

var instructionSet = CreateInstructionSet(registers);

var rawDay19Input = fs.readFileSync('./Day19Input.txt');

var day19Input = rawDay19Input.toString().split('\r\n');

let ipRegister = 0;
let program = [];
for (let i = 0; i < day19Input.length; i++) {
  if (i == 0) {
    ipRegister = parseInt(day19Input[i].split(' ')[1]);
  }
  else {
    let line = day19Input[i].split(' ');

    let instLine = [];
    for (let j = 0; j < line.length; j++)
      if (j == 0)
        instLine.push(line[j]);
      else
        instLine.push(parseInt(line[j]));

    program.push(instLine);
  }
}

console.log("IP Register: " + ipRegister);
console.log(program);

function GetNextInstruction(aIndex, aProgram) {
  if ((aIndex >= 0) && (aIndex < aProgram.length))
    return { ret: true, inst: aProgram[aIndex] };

  return { ret: false };
}

function CompareInst(aInst1, aInst2) 
{
  for (let i = 0; i < aInst1.length; i++) 
  {
    if (aInst1[i] != aInst2[i])
      return false;
  }
  
  return true;
}

function DumpProgramState(aInstIndex, aRegistersBefore, aInst, aRegistersAfter) 
{
  let instStr = aInst[0] + " " + aInst[1] + "," + aInst[2] + "," + aInst[3];
  return aInstIndex + " " + aRegistersBefore + " [" + instStr + "] " + aRegistersAfter;
}

function RunProgram(aInstructionSet, aRegisters, aIPRegister, aProgram) {
  let instIndex = 0;
  let breakAt = 60000;
  let dump = [];
  do {
    aRegisters[aIPRegister] = instIndex;
    let result = GetNextInstruction(instIndex, aProgram);

    if (!result.ret)
      break;

    let inst = aInstructionSet[result.inst[0]];

    if (inst === undefined) {
      console.log("Undefined instruction!");
      break;
    }

    let registersBefore = [];
    for (let i = 0; i < aRegisters.length; i++)
      registersBefore[i] = aRegisters[i];

    if (CompareInst(result.inst, ['addi', 3, 1, 3]))
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
    }

    inst.TestInstruction(result.inst, []);

    //console.log(DumpProgramState(instIndex, registersBefore, result.inst, aRegisters));
    if (aRegisters[0] != registersBefore[0])
      console.log(JSON.stringify(aRegisters));
    //dump.push(aRegisters);

    instIndex = aRegisters[aIPRegister];
    instIndex++;
    if (instIndex >= aProgram.length)
      break;
    
    //breakAt --;
    //if (breakAt <= 0)
    //  break;

  } while (true);

  return dump;
}

//var dump = RunProgram(instructionSet, registers, ipRegister, program);

//console.log(registers);

//fs.writeFileSync("./Day19Dump.txt", JSON.stringify(dump));

//registers[0] = 1;

//RunProgram(instructionSet, registers, ipRegister, program);

//console.log(registers[0]);

let divisors = [ 1, 2, 3, 4, 6, 12, 43, 86, 129, 172, 258, 516, 415823, 831646, 1247469, 1663292, 2494938, 4989876, 17880389, 35760778, 53641167, 71521556, 107282334 ]

let sum = 0;
for (let i = 0; i < divisors.length; i++) 
{
  sum += divisors[i];
  console.log(sum);
}