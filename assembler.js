var fs = require('fs');

var filename = process.argv[2];
var data = fs.readFileSync(filename);
var prog = data.toString().split('\n');

var map = {
  'NOP':    { opcode: 0x00, format: ''         },
  'LOAD':   { opcode: 0x10, format: 'reg addr' },
  'STORE':  { opcode: 0x20, format: 'reg addr' },
  'BRANCH': { opcode: 0x30, format: 'label'    }
};

var instructions = [];
prog.forEach(function (line) {
  
});
