8-Bit Emulator
==============

Instructions
------------

    0x00  NOP         = 8

    0x10  LOAD [reg]  = 4 4
          [addr]      = 8

    0x20  STORE [reg] = 4 4
          [addr]      = 8

    0x30  BRANCH      = 8
          [addr]      = 8

    0x40  SET [reg]   = 4 4
          [num]       = 8

    0x50  ADD [reg]   = 4 4
          [num]       = 8
