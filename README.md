8-Bit Emulator
==============

Instructions
------------

Registers are written as Rx in the assembly, where x is a register from 0-15. In the machine code a register is 4 bits and a number or address is 1 byte.

Hex Opcode | Assembly               | Memory Layout (hex) | Description
---------- | ---------------------- | ------------------- | -----------
`0x00`     | `NOP`                  | `00`                | Null operator
`0x10`     | `LOAD   [reg] [addr]`  | `1x xx`             | Load byte from memory location `addr` into register `reg`
`0x20`     | `STORE  [reg] [addr]`  | `2x xx`             | Store byte from register `reg` into memory location `addr`
`0x30`     | `BRANCH [label]`       | `30 xx`             | Set PC to address of `label`
`0x40`     | `SET    [reg] [byte]`  | `4x xx`             | Store `byte` in register `reg`
`0x50`     | `ADD    [reg] [byte]`  | `5x xx`             | Add `byte` to register `reg`
`0x60`     | `SUB    [reg] [byte]`  | `6x xx`             | Subtract `byte` from register `reg`
`0x70`     | `BNZ    [reg] [label]` | `7x xx`             | Set PC to address of `label` if `reg` is not zero
`0x80`     | `EXIT`                 | `80`                | Stop processing


Assembly Directives
-------------------

Directive     | Assembles to (hex) | Description
------------- | ------------------ | -----------
`DEF [byte]`  | `xx`               | Store `byte` into current memory location


Example Assembly
----------------

```
NOP
bob:
SET     r4   10
loop:   ;this is a label
SUB     r4   1
ADD     r2   1
BNZ     r4   loop
EXIT
BRANCH  bob
```
