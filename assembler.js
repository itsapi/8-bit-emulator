var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
require('string-format');

if (argv.h || argv.help || !argv._[0]) {
  console.log('Usage: {} input [-o|--out output] [-h|--help]'.format(__filename));
  process.exit();
}

var input = argv._[0];
var output = argv.o || argv.out;
var data = fs.readFileSync(input);
var prog = data.toString().split('\n');

var map = {
  'NOP':    { opcode: 0x00, args: 0},
  'LOAD':   { opcode: 0x10, args: 2},
  'STORE':  { opcode: 0x20, args: 2},
  'BRANCH': { opcode: 0x30, args: 1},
  'SET':    { opcode: 0x40, args: 2},
  'ADD':    { opcode: 0x50, args: 2},
  'SUB':    { opcode: 0x60, args: 2},
  'BNZ':    { opcode: 0x70, args: 2},
  'EXIT':   { opcode: 0x80, args: 0},
  'DEF':    { opcode: 0x00, args: 1}
};

var pointer = 0;
var instructions = [];
var labels = {};
prog.forEach(function (line) {

  // Remove comments and trailing spaces, ignore blank lines
  line = line.replace(/;.*/, '').trim();
  if (!line) return;

  if (line.slice(-1) == ':') {
    // Store address of label
    var label = line.slice(0, -1);
    labels[label] = pointer;
    return
  }

  var parts = line.split(/ +/);
  if (!(parts[0] in map)) {
    throw 'ParseError: unknown instruction ' + parts[0];
  }

  var opcode = map[parts[0]].opcode;
  var args = map[parts[0]].args;

  if (parts.length - 1 != args) {
    throw 'ParseError: {} takes {} arguments'.format(parts[0], args);
  }

  if (parts.length > 1) {
    // Merge opcode and operand
    instructions[pointer] = opcode | parts[1].slice(1);

    if (parts.length > 2) {
      // Put address in next memory location
      instructions[++pointer] = parts[0] == 'BNZ' ? parts[2] : parseInt(parts[2]);
    }
  } else {
    instructions[pointer] = opcode;
  }

  if (parts[0] == 'DEF') {
    // Set this location to the value specified
    instructions[pointer] = parts[1];
  }

  if (parts[0] == 'BRANCH') {
    // Add label to instructions - it will be replaced next pass
    instructions[++pointer] = parts[1];
  }

  pointer++;

});

// Replace labels with addresses
if (Object.keys(labels).length) {
  Object.keys(instructions).forEach(function (key) {
    var token = instructions[key];
    if (token in labels) {
      instructions[key] = labels[token];
    }
  });
}

if (output) {
  var stream = fs.createWriteStream(output);
  stream.write(new Buffer(instructions));
  stream.end();

} else if (!process.stdout.isTTY) {
  process.stdout.write(new Buffer(instructions));

} else {
  console.log(labels)
  console.log(instructions);
}
