8-Bit Emulator
==============

Instructions
------------

Registers are written as Rx in the assembly, where x is a register in hex from 0-15. In the machine code a register is 4 bits and a number or address is 1 byte.

Hex Opcode | Assembly               | Memory Layout (hex)
---------- | ---------------------- | -------------------
`0x00`     | `NOP`                  | `00`
`0x10`     | `LOAD   [reg] [label]` | `1x xx`
`0x20`     | `STORE  [reg] [label]` | `2x xx`
`0x30`     | `BRANCH [label]`       | `30 xx`
`0x40`     | `SET    [reg] [num]`   | `4x xx`
`0x50`     | `ADD    [reg] [num]`   | `5x xx`
`0x60`     | `SUB    [reg] [num]`   | `6x xx`
`0x70`     | `BNZ    [reg] [label]` | `7x xx`
`0x80`     | `EXIT`                 | `80`
