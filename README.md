8-Bit Emulator
==============

Instructions
------------

 Hex Opcode | Assembly               | Memory Layout
------------+------------------------+---------------
 0x00       | `NOP`                  | `00`
 0x10       | `LOAD   [reg] [label]` | `1x
            |                        |  xx`
 0x20       | `STORE  [reg] [label]` | `2x
            |                        |  xx`
 0x30       | `BRANCH [label]`       | `30
            |                        |  xx`
 0x40       | `SET    [reg] [num]`   | `4x
            |                        |  xx`
 0x50       | `ADD    [reg] [num]`   | `5x
            |                        |  xx`
 0x60       | `SUB    [reg] [num]`   | `6x
            |                        |  xx`
 0x70       | `BNZ    [reg] [label]` | `7x
            |                        |  xx`
 0x80       | `EXIT`                 | `80`
