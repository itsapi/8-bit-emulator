var fs = require('fs');
require('string-format');

var filename = process.argv[2];
var data = fs.readFileSync(filename);
var prog = data.toString().split('\n');

var map = {
  'NOP':    { opcode: 0x00, args: 0, format: '' },
  'LOAD':   { opcode: 0x10, args: 2, format: 'reg addr' },
  'STORE':  { opcode: 0x20, args: 2, format: 'reg addr' },
  'BRANCH': { opcode: 0x30, args: 1, format: 'label' },
  'SET':    { opcode: 0x40, args: 2, format: 'reg num' },
  'ADD':    { opcode: 0x50, args: 2, format: 'reg num' }
};

function hex(str) {
  return '0x' + str.toString(16);
}

var pointer = 0;
var instructions = {};
var labels = {};
prog.forEach(function (line) {

  // Remove comments and trailing spaces, ignore blank lines
  line = line.replace(/;.*/, '').trim();
  if (!line) return;

  if (line.slice(-1) == ':') {
    // Store address of label
    var label = line.slice(0, -1);
    labels[label] = hex(pointer);
    return
  }

  var parts = line.split(/ +/);
  if (!(parts[0] in map)) {
    throw ('ParseError: unknown instruction ' + parts[0]);
  }

  var opcode = map[parts[0]].opcode;
  var args = map[parts[0]].args;

  if (parts.length - 1 != args) {
    throw ('ParseError: {} takes {} arguments'.format(parts[0], args));
  }

  if (parts[0] == 'BRANCH') {
    // Add label to instructions - it will be replaced next pass
    instructions[hex(pointer)] = parts[1];

  } else if (parts.length > 1) {
    // Merge opcode and operand
    instructions[hex(pointer)] = hex(opcode | parts[1].slice(1));

    if (parts.length > 2) {
      // Put address in next memory location
      instructions[hex(++pointer)] = hex(parseInt(parts[2]));
    }
  } else {
    instructions[hex(pointer)] = hex(opcode);
  }

  pointer++;

});

// Replace labels with addresses
Object.keys(instructions).forEach(function (key) {
  var token = instructions[key];
  if (token in labels) {
    instructions[key] = labels[token];
  }
});

console.log(prog)
console.log(instructions);
console.log(labels);
