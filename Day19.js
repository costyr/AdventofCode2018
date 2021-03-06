const fs = require('fs');
const chronal = require('./ChronalConversion.js');

var registers = [0, 0, 0, 0, 0, 0];

var instructionSet = chronal.CreateInstructionSet(registers);

var chronalProgram = new chronal.ChronalProgram(instructionSet, registers);

chronalProgram.Load('./Day19Input.txt');

chronalProgram.DumpProgram();

var dump = chronalProgram.Run();

console.log(registers);

//fs.writeFileSync("./Day19Dump.txt", JSON.stringify(dump));

//registers[0] = 1;

//RunProgram(instructionSet, registers, ipRegister, program);

//console.log(registers[0]);
