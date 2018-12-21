const fs = require('fs');
const chronal = require('./ChronalConversion.js');

var registers = [0, 0, 0, 0, 0, 0];

var instructionSet = chronal.CreateInstructionSet(registers);

var chronalProgram = new chronal.ChronalProgram(instructionSet, registers);

chronalProgram.Load('./Day21Input.txt');

chronalProgram.DumpProgram();

//registers[0] = 1024276;
var dump = chronalProgram.Run();

console.log(registers);
