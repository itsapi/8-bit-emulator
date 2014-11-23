var fs = require('fs');

var filename = process.argv[2];
var data = fs.readFileSync(filename);
var prog = data.toString().split('\n');

var map = {
  'NOP':    { opcode: 0x00, args: 0 },
  'LOAD':   { opcode: 0x10, args: 2 },
  'STORE':  { opcode: 0x20, args: 2 },
  'BRANCH': { opcode: 0x30, args: 1 },
  'SET':    { opcode: 0x40, args: 2 },
  'ADD':    { opcode: 0x50, args: 2 }
};

var instructions = [];
prog.forEach(function (line) {

  if (line.slice(-1) == ':') {
    // Line is a label
    var label = line.slice(0, -1);

  } else {

    var parts = line.split(' ');
    if (!(parts[0] in map)) throw ('ParseError: unknown instruction ' + parts[0]);

    var opcode = map[parts[0]].opcode;
    var args = map[parts[0]].args;

    if (parts.length - 1 != args) throw ('ParseError: ' + parts[0] + ' takes ' + args + ' arguments');

    if (parts.length > 1) {
      // Merge opcode and operand
      instructions.push('0x' + (opcode | parts[1].slice(1)).toString(16));
    } else {
      instructions.push('0x' + opcode.toString(16));
    }

  }
});

console.log(instructions);
