var fs = require('fs');
var input = process.argv[2];
var debug = false;

var BITS = 8;
var N_REG = 0x20;

var PC  = 0x0F; // Program Counter
var CIR = 0x10; // Current Instruction Register
var MDR = 0x12; // Memory Data Register
var CRR = 0x11; // Current Register Register
var IVR = 0x14; // Intermediate Value Register
var MAR = 0x13; // Memory Address Register


function log (s) {
  if (debug)
    console.log(s);
}


function setup_ram () {
  var RAM = [];
  for (var i = 0; i < Math.pow(2, BITS); i++) {
    RAM[i] = 0;
  }
  return RAM;
}


function setup_reg () {
  var REG = [];
  for (var i = 0; i < N_REG; i++) {
    REG[i] = 0;
  }
  return REG;
}


function check_addr (reg, addr) {
  return addr > Math.pow(2, BITS) || reg > N_REG;
}


function load_ (reg, addr) {
  if (check_addr(reg, addr)) {
    return false;
  }
  REG[reg] = RAM[addr];
  return true;
}


function store (reg, addr) {
  if (check_addr(reg, addr)) {
    return false;
  }
  RAM[addr] = REG[reg];
  return true;
}


function execute () {

  switch (REG[CIR]) {
    case 0x00:
      // NOP
      break;

    case 0x01:
      // LOAD
      log('LOAD');
      load_(REG[CRR], REG[MAR]);
      break;

    case 0x02:
      // STORE
      log('STORE');
      store(REG[CRR], REG[MAR]);
      break;

    case 0x03:
      // BRANCH
      log('BRANCH');
      REG[PC] = REG[MAR] - 1;
      break;

    case 0x04:
      // SET
      log('SET');
      log(REG[REG[CRR]], REG[IVR])
      REG[REG[CRR]] = REG[IVR];
      break;

    case 0x05:
      // ADD
      log('ADD');
      log(REG[REG[CRR]], REG[IVR])
      REG[REG[CRR]] += REG[IVR];
      break;

  }
}


function cpu () {
  REG[PC] = 0x0;
  while (REG[PC] >= 0 && REG[PC] < Math.pow(2, BITS)) {

    // Fetch:

    // Put instruction in MDR
    load_(MDR, REG[PC]);

    // Get the opcode
    REG[CIR] = REG[MDR] >> 4;
    // Get the operand
    REG[CRR] = REG[MDR] & 0x0F;

    if (REG[CIR] == 0x01 || REG[CIR] == 0x02 || REG[CIR] == 0x03) {
      // Means a RAM address is in the next memory location
      load_(MAR, ++REG[PC]);
    }
    if (REG[CIR] == 0x04 || REG[CIR] == 0x05) {
      // Means a number literal is in the next memory location
      load_(IVR, ++REG[PC]);
    }

    // Execute:
    execute();

    REG[PC]++;
  }
}


var RAM = setup_ram();
var REG = setup_reg();

RAM[0x00] = 0x41;
RAM[0x01] = 0x05;
RAM[0x02] = 0x51;
RAM[0x03] = 0x15;

if (input) {
  var prog = JSON.parse(fs.readFileSync(input));
  for (key in prog) {
    RAM[parseInt(key)] = parseInt(prog[key]);
  }
}

cpu();

console.log(REG);
console.log(RAM.slice(0, 20));
