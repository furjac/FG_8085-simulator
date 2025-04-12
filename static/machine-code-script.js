// 8085 Instruction Set Data with Machine Code
const instructionSet = [
    // 0x00 - 0x0F
    { opcode: '00', mnemonic: 'NOP', bytes: 1, machineCode: '00', description: 'No operation', category: 'machine-control' },
    { opcode: '01', mnemonic: 'LXI B', bytes: 3, machineCode: '01 lb hb', description: 'Load register pair B-C with immediate data', category: 'data-transfer' },
    { opcode: '02', mnemonic: 'STAX B', bytes: 1, machineCode: '02', description: 'Store accumulator indirect through BC', category: 'data-transfer' },
    { opcode: '03', mnemonic: 'INX B', bytes: 1, machineCode: '03', description: 'Increment register pair B-C', category: 'arithmetic' },
    { opcode: '04', mnemonic: 'INR B', bytes: 1, machineCode: '04', description: 'Increment register B', category: 'arithmetic' },
    { opcode: '05', mnemonic: 'DCR B', bytes: 1, machineCode: '05', description: 'Decrement register B', category: 'arithmetic' },
    { opcode: '06', mnemonic: 'MVI B', bytes: 2, machineCode: '06 dd', description: 'Move immediate to register B', category: 'data-transfer' },
    { opcode: '07', mnemonic: 'RLC', bytes: 1, machineCode: '07', description: 'Rotate accumulator left', category: 'logical' },
    { opcode: '08', mnemonic: '*NOP', bytes: 1, machineCode: '08', description: 'Undocumented NOP', category: 'machine-control' },
    { opcode: '09', mnemonic: 'DAD B', bytes: 1, machineCode: '09', description: 'Add B-C to H-L', category: 'arithmetic' },
    { opcode: '0A', mnemonic: 'LDAX B', bytes: 1, machineCode: '0A', description: 'Load accumulator indirect through BC', category: 'data-transfer' },
    { opcode: '0B', mnemonic: 'DCX B', bytes: 1, machineCode: '0B', description: 'Decrement register pair B-C', category: 'arithmetic' },
    { opcode: '0C', mnemonic: 'INR C', bytes: 1, machineCode: '0C', description: 'Increment register C', category: 'arithmetic' },
    { opcode: '0D', mnemonic: 'DCR C', bytes: 1, machineCode: '0D', description: 'Decrement register C', category: 'arithmetic' },
    { opcode: '0E', mnemonic: 'MVI C', bytes: 2, machineCode: '0E dd', description: 'Move immediate to register C', category: 'data-transfer' },
    { opcode: '0F', mnemonic: 'RRC', bytes: 1, machineCode: '0F', description: 'Rotate accumulator right', category: 'logical' },
    
    // 0x10 - 0x1F
    { opcode: '10', mnemonic: '*NOP', bytes: 1, machineCode: '10', description: 'Undocumented NOP', category: 'machine-control' },
    { opcode: '11', mnemonic: 'LXI D', bytes: 3, machineCode: '11 lb hb', description: 'Load register pair D-E with immediate data', category: 'data-transfer' },
    { opcode: '12', mnemonic: 'STAX D', bytes: 1, machineCode: '12', description: 'Store accumulator indirect through DE', category: 'data-transfer' },
    { opcode: '13', mnemonic: 'INX D', bytes: 1, machineCode: '13', description: 'Increment register pair D-E', category: 'arithmetic' },
    { opcode: '14', mnemonic: 'INR D', bytes: 1, machineCode: '14', description: 'Increment register D', category: 'arithmetic' },
    { opcode: '15', mnemonic: 'DCR D', bytes: 1, machineCode: '15', description: 'Decrement register D', category: 'arithmetic' },
    { opcode: '16', mnemonic: 'MVI D', bytes: 2, machineCode: '16 dd', description: 'Move immediate to register D', category: 'data-transfer' },
    { opcode: '17', mnemonic: 'RAL', bytes: 1, machineCode: '17', description: 'Rotate accumulator left through carry', category: 'logical' },
    { opcode: '18', mnemonic: '*NOP', bytes: 1, machineCode: '18', description: 'Undocumented NOP', category: 'machine-control' },
    { opcode: '19', mnemonic: 'DAD D', bytes: 1, machineCode: '19', description: 'Add D-E to H-L', category: 'arithmetic' },
    { opcode: '1A', mnemonic: 'LDAX D', bytes: 1, machineCode: '1A', description: 'Load accumulator indirect through DE', category: 'data-transfer' },
    { opcode: '1B', mnemonic: 'DCX D', bytes: 1, machineCode: '1B', description: 'Decrement register pair D-E', category: 'arithmetic' },
    { opcode: '1C', mnemonic: 'INR E', bytes: 1, machineCode: '1C', description: 'Increment register E', category: 'arithmetic' },
    { opcode: '1D', mnemonic: 'DCR E', bytes: 1, machineCode: '1D', description: 'Decrement register E', category: 'arithmetic' },
    { opcode: '1E', mnemonic: 'MVI E', bytes: 2, machineCode: '1E dd', description: 'Move immediate to register E', category: 'data-transfer' },
    { opcode: '1F', mnemonic: 'RAR', bytes: 1, machineCode: '1F', description: 'Rotate accumulator right through carry', category: 'logical' },
    
    // 0x20 - 0x2F
    { opcode: '20', mnemonic: '*NOP', bytes: 1, machineCode: '20', description: 'Undocumented NOP', category: 'machine-control' },
    { opcode: '21', mnemonic: 'LXI H', bytes: 3, machineCode: '21 lb hb', description: 'Load register pair H-L with immediate data', category: 'data-transfer' },
    { opcode: '22', mnemonic: 'SHLD', bytes: 3, machineCode: '22 adr adr', description: 'Store H-L direct to memory', category: 'data-transfer' },
    { opcode: '23', mnemonic: 'INX H', bytes: 1, machineCode: '23', description: 'Increment register pair H-L', category: 'arithmetic' },
    { opcode: '24', mnemonic: 'INR H', bytes: 1, machineCode: '24', description: 'Increment register H', category: 'arithmetic' },
    { opcode: '25', mnemonic: 'DCR H', bytes: 1, machineCode: '25', description: 'Decrement register H', category: 'arithmetic' },
    { opcode: '26', mnemonic: 'MVI H', bytes: 2, machineCode: '26 dd', description: 'Move immediate to register H', category: 'data-transfer' },
    { opcode: '27', mnemonic: 'DAA', bytes: 1, machineCode: '27', description: 'Decimal adjust accumulator', category: 'arithmetic' },
    { opcode: '28', mnemonic: '*NOP', bytes: 1, machineCode: '28', description: 'Undocumented NOP', category: 'machine-control' },
    { opcode: '29', mnemonic: 'DAD H', bytes: 1, machineCode: '29', description: 'Add H-L to H-L', category: 'arithmetic' },
    { opcode: '2A', mnemonic: 'LHLD', bytes: 3, machineCode: '2A adr adr', description: 'Load H-L direct from memory', category: 'data-transfer' },
    { opcode: '2B', mnemonic: 'DCX H', bytes: 1, machineCode: '2B', description: 'Decrement register pair H-L', category: 'arithmetic' },
    { opcode: '2C', mnemonic: 'INR L', bytes: 1, machineCode: '2C', description: 'Increment register L', category: 'arithmetic' },
    { opcode: '2D', mnemonic: 'DCR L', bytes: 1, machineCode: '2D', description: 'Decrement register L', category: 'arithmetic' },
    { opcode: '2E', mnemonic: 'MVI L', bytes: 2, machineCode: '2E dd', description: 'Move immediate to register L', category: 'data-transfer' },
    { opcode: '2F', mnemonic: 'CMA', bytes: 1, machineCode: '2F', description: 'Complement accumulator', category: 'logical' },
    
    // 0x30 - 0x3F
    { opcode: '30', mnemonic: '*NOP', bytes: 1, machineCode: '30', description: 'Undocumented NOP', category: 'machine-control' },
    { opcode: '31', mnemonic: 'LXI SP', bytes: 3, machineCode: '31 lb hb', description: 'Load stack pointer with immediate data', category: 'data-transfer' },
    { opcode: '32', mnemonic: 'STA', bytes: 3, machineCode: '32 adr adr', description: 'Store accumulator direct to memory', category: 'data-transfer' },
    { opcode: '33', mnemonic: 'INX SP', bytes: 1, machineCode: '33', description: 'Increment stack pointer', category: 'arithmetic' },
    { opcode: '34', mnemonic: 'INR M', bytes: 1, machineCode: '34', description: 'Increment memory', category: 'arithmetic' },
    { opcode: '35', mnemonic: 'DCR M', bytes: 1, machineCode: '35', description: 'Decrement memory', category: 'arithmetic' },
    { opcode: '36', mnemonic: 'MVI M', bytes: 2, machineCode: '36 dd', description: 'Move immediate to memory', category: 'data-transfer' },
    { opcode: '37', mnemonic: 'STC', bytes: 1, machineCode: '37', description: 'Set carry flag', category: 'logical' },
    { opcode: '38', mnemonic: '*NOP', bytes: 1, machineCode: '38', description: 'Undocumented NOP', category: 'machine-control' },
    { opcode: '39', mnemonic: 'DAD SP', bytes: 1, machineCode: '39', description: 'Add stack pointer to H-L', category: 'arithmetic' },
    { opcode: '3A', mnemonic: 'LDA', bytes: 3, machineCode: '3A adr adr', description: 'Load accumulator direct from memory', category: 'data-transfer' },
    { opcode: '3B', mnemonic: 'DCX SP', bytes: 1, machineCode: '3B', description: 'Decrement stack pointer', category: 'arithmetic' },
    { opcode: '3C', mnemonic: 'INR A', bytes: 1, machineCode: '3C', description: 'Increment accumulator', category: 'arithmetic' },
    { opcode: '3D', mnemonic: 'DCR A', bytes: 1, machineCode: '3D', description: 'Decrement accumulator', category: 'arithmetic' },
    { opcode: '3E', mnemonic: 'MVI A', bytes: 2, machineCode: '3E dd', description: 'Move immediate to accumulator', category: 'data-transfer' },
    { opcode: '3F', mnemonic: 'CMC', bytes: 1, machineCode: '3F', description: 'Complement carry flag', category: 'logical' },
    
    // Data Transfer Group
    { opcode: '40', mnemonic: 'MOV B,B', bytes: 1, machineCode: '40', description: 'Move register B to register B', category: 'data-transfer' },
    { opcode: '41', mnemonic: 'MOV B,C', bytes: 1, machineCode: '41', description: 'Move register C to register B', category: 'data-transfer' },
    { opcode: '42', mnemonic: 'MOV B,D', bytes: 1, machineCode: '42', description: 'Move register D to register B', category: 'data-transfer' },
    { opcode: '43', mnemonic: 'MOV B,E', bytes: 1, machineCode: '43', description: 'Move register E to register B', category: 'data-transfer' },
    { opcode: '44', mnemonic: 'MOV B,H', bytes: 1, machineCode: '44', description: 'Move register H to register B', category: 'data-transfer' },
    { opcode: '45', mnemonic: 'MOV B,L', bytes: 1, machineCode: '45', description: 'Move register L to register B', category: 'data-transfer' },
    { opcode: '46', mnemonic: 'MOV B,M', bytes: 1, machineCode: '46', description: 'Move memory to register B', category: 'data-transfer' },
    { opcode: '47', mnemonic: 'MOV B,A', bytes: 1, machineCode: '47', description: 'Move register A to register B', category: 'data-transfer' },
    { opcode: '48', mnemonic: 'MOV C,B', bytes: 1, machineCode: '48', description: 'Move register B to register C', category: 'data-transfer' },
    { opcode: '49', mnemonic: 'MOV C,C', bytes: 1, machineCode: '49', description: 'Move register C to register C', category: 'data-transfer' },
    { opcode: '4A', mnemonic: 'MOV C,D', bytes: 1, machineCode: '4A', description: 'Move register D to register C', category: 'data-transfer' },
    { opcode: '4B', mnemonic: 'MOV C,E', bytes: 1, machineCode: '4B', description: 'Move register E to register C', category: 'data-transfer' },
    { opcode: '4C', mnemonic: 'MOV C,H', bytes: 1, machineCode: '4C', description: 'Move register H to register C', category: 'data-transfer' },
    { opcode: '4D', mnemonic: 'MOV C,L', bytes: 1, machineCode: '4D', description: 'Move register L to register C', category: 'data-transfer' },
    { opcode: '4E', mnemonic: 'MOV C,M', bytes: 1, machineCode: '4E', description: 'Move memory to register C', category: 'data-transfer' },
    { opcode: '4F', mnemonic: 'MOV C,A', bytes: 1, machineCode: '4F', description: 'Move register A to register C', category: 'data-transfer' },
    { opcode: '50', mnemonic: 'MOV D,B', bytes: 1, machineCode: '50', description: 'Move register B to register D', category: 'data-transfer' },
    { opcode: '51', mnemonic: 'MOV D,C', bytes: 1, machineCode: '51', description: 'Move register C to register D', category: 'data-transfer' },
    { opcode: '52', mnemonic: 'MOV D,D', bytes: 1, machineCode: '52', description: 'Move register D to register D', category: 'data-transfer' },
    { opcode: '53', mnemonic: 'MOV D,E', bytes: 1, machineCode: '53', description: 'Move register E to register D', category: 'data-transfer' },
    { opcode: '54', mnemonic: 'MOV D,H', bytes: 1, machineCode: '54', description: 'Move register H to register D', category: 'data-transfer' },
    { opcode: '55', mnemonic: 'MOV D,L', bytes: 1, machineCode: '55', description: 'Move register L to register D', category: 'data-transfer' },
    { opcode: '56', mnemonic: 'MOV D,M', bytes: 1, machineCode: '56', description: 'Move memory to register D', category: 'data-transfer' },
    { opcode: '57', mnemonic: 'MOV D,A', bytes: 1, machineCode: '57', description: 'Move register A to register D', category: 'data-transfer' },
    { opcode: '58', mnemonic: 'MOV E,B', bytes: 1, machineCode: '58', description: 'Move register B to register E', category: 'data-transfer' },
    { opcode: '59', mnemonic: 'MOV E,C', bytes: 1, machineCode: '59', description: 'Move register C to register E', category: 'data-transfer' },
    { opcode: '5A', mnemonic: 'MOV E,D', bytes: 1, machineCode: '5A', description: 'Move register D to register E', category: 'data-transfer' },
    { opcode: '5B', mnemonic: 'MOV E,E', bytes: 1, machineCode: '5B', description: 'Move register E to register E', category: 'data-transfer' },
    { opcode: '5C', mnemonic: 'MOV E,H', bytes: 1, machineCode: '5C', description: 'Move register H to register E', category: 'data-transfer' },
    { opcode: '5D', mnemonic: 'MOV E,L', bytes: 1, machineCode: '5D', description: 'Move register L to register E', category: 'data-transfer' },
    { opcode: '5E', mnemonic: 'MOV E,M', bytes: 1, machineCode: '5E', description: 'Move memory to register E', category: 'data-transfer' },
    { opcode: '5F', mnemonic: 'MOV E,A', bytes: 1, machineCode: '5F', description: 'Move register A to register E', category: 'data-transfer' },
    { opcode: '60', mnemonic: 'MOV H,B', bytes: 1, machineCode: '60', description: 'Move register B to register H', category: 'data-transfer' },
    { opcode: '61', mnemonic: 'MOV H,C', bytes: 1, machineCode: '61', description: 'Move register C to register H', category: 'data-transfer' },
    { opcode: '62', mnemonic: 'MOV H,D', bytes: 1, machineCode: '62', description: 'Move register D to register H', category: 'data-transfer' },
    { opcode: '63', mnemonic: 'MOV H,E', bytes: 1, machineCode: '63', description: 'Move register E to register H', category: 'data-transfer' },
    { opcode: '64', mnemonic: 'MOV H,H', bytes: 1, machineCode: '64', description: 'Move register H to register H', category: 'data-transfer' },
    { opcode: '65', mnemonic: 'MOV H,L', bytes: 1, machineCode: '65', description: 'Move register L to register H', category: 'data-transfer' },
    { opcode: '66', mnemonic: 'MOV H,M', bytes: 1, machineCode: '66', description: 'Move memory to register H', category: 'data-transfer' },
    { opcode: '67', mnemonic: 'MOV H,A', bytes: 1, machineCode: '67', description: 'Move register A to register H', category: 'data-transfer' },
    { opcode: '68', mnemonic: 'MOV L,B', bytes: 1, machineCode: '68', description: 'Move register B to register L', category: 'data-transfer' },
    { opcode: '69', mnemonic: 'MOV L,C', bytes: 1, machineCode: '69', description: 'Move register C to register L', category: 'data-transfer' },
    { opcode: '6A', mnemonic: 'MOV L,D', bytes: 1, machineCode: '6A', description: 'Move register D to register L', category: 'data-transfer' },
    { opcode: '6B', mnemonic: 'MOV L,E', bytes: 1, machineCode: '6B', description: 'Move register E to register L', category: 'data-transfer' },
    { opcode: '6C', mnemonic: 'MOV L,H', bytes: 1, machineCode: '6C', description: 'Move register H to register L', category: 'data-transfer' },
    { opcode: '6D', mnemonic: 'MOV L,L', bytes: 1, machineCode: '6D', description: 'Move register L to register L', category: 'data-transfer' },
    { opcode: '6E', mnemonic: 'MOV L,M', bytes: 1, machineCode: '6E', description: 'Move memory to register L', category: 'data-transfer' },
    { opcode: '6F', mnemonic: 'MOV L,A', bytes: 1, machineCode: '6F', description: 'Move register A to register L', category: 'data-transfer' },
    { opcode: '70', mnemonic: 'MOV M,B', bytes: 1, machineCode: '70', description: 'Move register B to memory', category: 'data-transfer' },
    { opcode: '71', mnemonic: 'MOV M,C', bytes: 1, machineCode: '71', description: 'Move register C to memory', category: 'data-transfer' },
    { opcode: '72', mnemonic: 'MOV M,D', bytes: 1, machineCode: '72', description: 'Move register D to memory', category: 'data-transfer' },
    { opcode: '73', mnemonic: 'MOV M,E', bytes: 1, machineCode: '73', description: 'Move register E to memory', category: 'data-transfer' },
    { opcode: '74', mnemonic: 'MOV M,H', bytes: 1, machineCode: '74', description: 'Move register H to memory', category: 'data-transfer' },
    { opcode: '75', mnemonic: 'MOV M,L', bytes: 1, machineCode: '75', description: 'Move register L to memory', category: 'data-transfer' },
    { opcode: '77', mnemonic: 'MOV M,A', bytes: 1, machineCode: '77', description: 'Move register A to memory', category: 'data-transfer' },
    { opcode: '78', mnemonic: 'MOV A,B', bytes: 1, machineCode: '78', description: 'Move register B to accumulator', category: 'data-transfer' },
    { opcode: '79', mnemonic: 'MOV A,C', bytes: 1, machineCode: '79', description: 'Move register C to accumulator', category: 'data-transfer' },
    { opcode: '7A', mnemonic: 'MOV A,D', bytes: 1, machineCode: '7A', description: 'Move register D to accumulator', category: 'data-transfer' },
    { opcode: '7B', mnemonic: 'MOV A,E', bytes: 1, machineCode: '7B', description: 'Move register E to accumulator', category: 'data-transfer' },
    { opcode: '7C', mnemonic: 'MOV A,H', bytes: 1, machineCode: '7C', description: 'Move register H to accumulator', category: 'data-transfer' },
    { opcode: '7D', mnemonic: 'MOV A,L', bytes: 1, machineCode: '7D', description: 'Move register L to accumulator', category: 'data-transfer' },
    { opcode: '7E', mnemonic: 'MOV A,M', bytes: 1, machineCode: '7E', description: 'Move memory to accumulator', category: 'data-transfer' },
    { opcode: '7F', mnemonic: 'MOV A,A', bytes: 1, machineCode: '7F', description: 'Move accumulator to accumulator', category: 'data-transfer' },
    
    // Immediate Data Transfer
    { opcode: '06', mnemonic: 'MVI B', bytes: 2, machineCode: '06 dd', description: 'Move immediate data to register B', category: 'data-transfer' },
    { opcode: '0E', mnemonic: 'MVI C', bytes: 2, machineCode: '0E dd', description: 'Move immediate data to register C', category: 'data-transfer' },
    { opcode: '16', mnemonic: 'MVI D', bytes: 2, machineCode: '16 dd', description: 'Move immediate data to register D', category: 'data-transfer' },
    { opcode: '1E', mnemonic: 'MVI E', bytes: 2, machineCode: '1E dd', description: 'Move immediate data to register E', category: 'data-transfer' },
    { opcode: '26', mnemonic: 'MVI H', bytes: 2, machineCode: '26 dd', description: 'Move immediate data to register H', category: 'data-transfer' },
    { opcode: '2E', mnemonic: 'MVI L', bytes: 2, machineCode: '2E dd', description: 'Move immediate data to register L', category: 'data-transfer' },
    { opcode: '36', mnemonic: 'MVI M', bytes: 2, machineCode: '36 dd', description: 'Move immediate data to memory', category: 'data-transfer' },
    { opcode: '3E', mnemonic: 'MVI A', bytes: 2, machineCode: '3E dd', description: 'Move immediate data to accumulator', category: 'data-transfer' },
    
    // Register Pair Instructions
    { opcode: '01', mnemonic: 'LXI B', bytes: 3, machineCode: '01 lb hb', description: 'Load register pair B-C with immediate data', category: 'data-transfer' },
    { opcode: '11', mnemonic: 'LXI D', bytes: 3, machineCode: '11 lb hb', description: 'Load register pair D-E with immediate data', category: 'data-transfer' },
    { opcode: '21', mnemonic: 'LXI H', bytes: 3, machineCode: '21 lb hb', description: 'Load register pair H-L with immediate data', category: 'data-transfer' },
    { opcode: '31', mnemonic: 'LXI SP', bytes: 3, machineCode: '31 lb hb', description: 'Load stack pointer with immediate data', category: 'data-transfer' },
    
    // Direct Addressing Instructions
    { opcode: '32', mnemonic: 'STA', bytes: 3, machineCode: '32 adr adr', description: 'Store accumulator direct to memory', category: 'data-transfer' },
    { opcode: '3A', mnemonic: 'LDA', bytes: 3, machineCode: '3A adr adr', description: 'Load accumulator direct from memory', category: 'data-transfer' },
    { opcode: '22', mnemonic: 'SHLD', bytes: 3, machineCode: '22 adr adr', description: 'Store H-L direct to memory', category: 'data-transfer' },
    { opcode: '2A', mnemonic: 'LHLD', bytes: 3, machineCode: '2A adr adr', description: 'Load H-L direct from memory', category: 'data-transfer' },
    
    // Arithmetic Group
    { opcode: '80', mnemonic: 'ADD B', bytes: 1, machineCode: '80', description: 'Add register B to accumulator', category: 'arithmetic' },
    { opcode: '81', mnemonic: 'ADD C', bytes: 1, machineCode: '81', description: 'Add register C to accumulator', category: 'arithmetic' },
    { opcode: '82', mnemonic: 'ADD D', bytes: 1, machineCode: '82', description: 'Add register D to accumulator', category: 'arithmetic' },
    { opcode: '83', mnemonic: 'ADD E', bytes: 1, machineCode: '83', description: 'Add register E to accumulator', category: 'arithmetic' },
    { opcode: '84', mnemonic: 'ADD H', bytes: 1, machineCode: '84', description: 'Add register H to accumulator', category: 'arithmetic' },
    { opcode: '85', mnemonic: 'ADD L', bytes: 1, machineCode: '85', description: 'Add register L to accumulator', category: 'arithmetic' },
    { opcode: '86', mnemonic: 'ADD M', bytes: 1, machineCode: '86', description: 'Add memory to accumulator', category: 'arithmetic' },
    { opcode: '87', mnemonic: 'ADD A', bytes: 1, machineCode: '87', description: 'Add accumulator to accumulator', category: 'arithmetic' },
    { opcode: 'C6', mnemonic: 'ADI', bytes: 2, machineCode: 'C6 dd', description: 'Add immediate to accumulator', category: 'arithmetic' },
    { opcode: '88', mnemonic: 'ADC B', bytes: 1, machineCode: '88', description: 'Add register B to accumulator with carry', category: 'arithmetic' },
    { opcode: '89', mnemonic: 'ADC C', bytes: 1, machineCode: '89', description: 'Add register C to accumulator with carry', category: 'arithmetic' },
    { opcode: '8A', mnemonic: 'ADC D', bytes: 1, machineCode: '8A', description: 'Add register D to accumulator with carry', category: 'arithmetic' },
    { opcode: '8B', mnemonic: 'ADC E', bytes: 1, machineCode: '8B', description: 'Add register E to accumulator with carry', category: 'arithmetic' },
    { opcode: '8C', mnemonic: 'ADC H', bytes: 1, machineCode: '8C', description: 'Add register H to accumulator with carry', category: 'arithmetic' },
    { opcode: '8D', mnemonic: 'ADC L', bytes: 1, machineCode: '8D', description: 'Add register L to accumulator with carry', category: 'arithmetic' },
    { opcode: '8E', mnemonic: 'ADC M', bytes: 1, machineCode: '8E', description: 'Add memory to accumulator with carry', category: 'arithmetic' },
    { opcode: '8F', mnemonic: 'ADC A', bytes: 1, machineCode: '8F', description: 'Add accumulator to accumulator with carry', category: 'arithmetic' },
    { opcode: 'CE', mnemonic: 'ACI', bytes: 2, machineCode: 'CE dd', description: 'Add immediate to accumulator with carry', category: 'arithmetic' },
    { opcode: '90', mnemonic: 'SUB B', bytes: 1, machineCode: '90', description: 'Subtract register B from accumulator', category: 'arithmetic' },
    { opcode: '91', mnemonic: 'SUB C', bytes: 1, machineCode: '91', description: 'Subtract register C from accumulator', category: 'arithmetic' },
    { opcode: '92', mnemonic: 'SUB D', bytes: 1, machineCode: '92', description: 'Subtract register D from accumulator', category: 'arithmetic' },
    { opcode: '93', mnemonic: 'SUB E', bytes: 1, machineCode: '93', description: 'Subtract register E from accumulator', category: 'arithmetic' },
    { opcode: '94', mnemonic: 'SUB H', bytes: 1, machineCode: '94', description: 'Subtract register H from accumulator', category: 'arithmetic' },
    { opcode: '95', mnemonic: 'SUB L', bytes: 1, machineCode: '95', description: 'Subtract register L from accumulator', category: 'arithmetic' },
    { opcode: '96', mnemonic: 'SUB M', bytes: 1, machineCode: '96', description: 'Subtract memory from accumulator', category: 'arithmetic' },
    { opcode: '97', mnemonic: 'SUB A', bytes: 1, machineCode: '97', description: 'Subtract accumulator from accumulator', category: 'arithmetic' },
    { opcode: 'D6', mnemonic: 'SUI', bytes: 2, machineCode: 'D6 dd', description: 'Subtract immediate from accumulator', category: 'arithmetic' },
    { opcode: '98', mnemonic: 'SBB B', bytes: 1, machineCode: '98', description: 'Subtract register B from accumulator with borrow', category: 'arithmetic' },
    { opcode: '99', mnemonic: 'SBB C', bytes: 1, machineCode: '99', description: 'Subtract register C from accumulator with borrow', category: 'arithmetic' },
    { opcode: '9A', mnemonic: 'SBB D', bytes: 1, machineCode: '9A', description: 'Subtract register D from accumulator with borrow', category: 'arithmetic' },
    { opcode: '9B', mnemonic: 'SBB E', bytes: 1, machineCode: '9B', description: 'Subtract register E from accumulator with borrow', category: 'arithmetic' },
    { opcode: '9C', mnemonic: 'SBB H', bytes: 1, machineCode: '9C', description: 'Subtract register H from accumulator with borrow', category: 'arithmetic' },
    { opcode: '9D', mnemonic: 'SBB L', bytes: 1, machineCode: '9D', description: 'Subtract register L from accumulator with borrow', category: 'arithmetic' },
    { opcode: '9E', mnemonic: 'SBB M', bytes: 1, machineCode: '9E', description: 'Subtract memory from accumulator with borrow', category: 'arithmetic' },
    { opcode: '9F', mnemonic: 'SBB A', bytes: 1, machineCode: '9F', description: 'Subtract accumulator from accumulator with borrow', category: 'arithmetic' },
    { opcode: 'DE', mnemonic: 'SBI', bytes: 2, machineCode: 'DE dd', description: 'Subtract immediate from accumulator with borrow', category: 'arithmetic' },
    { opcode: '04', mnemonic: 'INR B', bytes: 1, machineCode: '04', description: 'Increment register B', category: 'arithmetic' },
    { opcode: '0C', mnemonic: 'INR C', bytes: 1, machineCode: '0C', description: 'Increment register C', category: 'arithmetic' },
    { opcode: '14', mnemonic: 'INR D', bytes: 1, machineCode: '14', description: 'Increment register D', category: 'arithmetic' },
    { opcode: '1C', mnemonic: 'INR E', bytes: 1, machineCode: '1C', description: 'Increment register E', category: 'arithmetic' },
    { opcode: '24', mnemonic: 'INR H', bytes: 1, machineCode: '24', description: 'Increment register H', category: 'arithmetic' },
    { opcode: '2C', mnemonic: 'INR L', bytes: 1, machineCode: '2C', description: 'Increment register L', category: 'arithmetic' },
    { opcode: '34', mnemonic: 'INR M', bytes: 1, machineCode: '34', description: 'Increment memory', category: 'arithmetic' },
    { opcode: '3C', mnemonic: 'INR A', bytes: 1, machineCode: '3C', description: 'Increment accumulator', category: 'arithmetic' },
    { opcode: '05', mnemonic: 'DCR B', bytes: 1, machineCode: '05', description: 'Decrement register B', category: 'arithmetic' },
    { opcode: '0D', mnemonic: 'DCR C', bytes: 1, machineCode: '0D', description: 'Decrement register C', category: 'arithmetic' },
    { opcode: '15', mnemonic: 'DCR D', bytes: 1, machineCode: '15', description: 'Decrement register D', category: 'arithmetic' },
    { opcode: '1D', mnemonic: 'DCR E', bytes: 1, machineCode: '1D', description: 'Decrement register E', category: 'arithmetic' },
    { opcode: '25', mnemonic: 'DCR H', bytes: 1, machineCode: '25', description: 'Decrement register H', category: 'arithmetic' },
    { opcode: '2D', mnemonic: 'DCR L', bytes: 1, machineCode: '2D', description: 'Decrement register L', category: 'arithmetic' },
    { opcode: '35', mnemonic: 'DCR M', bytes: 1, machineCode: '35', description: 'Decrement memory', category: 'arithmetic' },
    { opcode: '3D', mnemonic: 'DCR A', bytes: 1, machineCode: '3D', description: 'Decrement accumulator', category: 'arithmetic' },
    { opcode: '27', mnemonic: 'DAA', bytes: 1, machineCode: '27', description: 'Decimal adjust accumulator', category: 'arithmetic' },
    
    // Logical Group
    { opcode: 'A0', mnemonic: 'ANA B', bytes: 1, machineCode: 'A0', description: 'AND register B with accumulator', category: 'logical' },
    { opcode: 'A1', mnemonic: 'ANA C', bytes: 1, machineCode: 'A1', description: 'AND register C with accumulator', category: 'logical' },
    { opcode: 'A2', mnemonic: 'ANA D', bytes: 1, machineCode: 'A2', description: 'AND register D with accumulator', category: 'logical' },
    { opcode: 'A3', mnemonic: 'ANA E', bytes: 1, machineCode: 'A3', description: 'AND register E with accumulator', category: 'logical' },
    { opcode: 'A4', mnemonic: 'ANA H', bytes: 1, machineCode: 'A4', description: 'AND register H with accumulator', category: 'logical' },
    { opcode: 'A5', mnemonic: 'ANA L', bytes: 1, machineCode: 'A5', description: 'AND register L with accumulator', category: 'logical' },
    { opcode: 'A6', mnemonic: 'ANA M', bytes: 1, machineCode: 'A6', description: 'AND memory with accumulator', category: 'logical' },
    { opcode: 'A7', mnemonic: 'ANA A', bytes: 1, machineCode: 'A7', description: 'AND accumulator with accumulator', category: 'logical' },
    { opcode: 'E6', mnemonic: 'ANI', bytes: 2, machineCode: 'E6 dd', description: 'AND immediate with accumulator', category: 'logical' },
    { opcode: 'B0', mnemonic: 'ORA B', bytes: 1, machineCode: 'B0', description: 'OR register B with accumulator', category: 'logical' },
    { opcode: 'B1', mnemonic: 'ORA C', bytes: 1, machineCode: 'B1', description: 'OR register C with accumulator', category: 'logical' },
    { opcode: 'B2', mnemonic: 'ORA D', bytes: 1, machineCode: 'B2', description: 'OR register D with accumulator', category: 'logical' },
    { opcode: 'B3', mnemonic: 'ORA E', bytes: 1, machineCode: 'B3', description: 'OR register E with accumulator', category: 'logical' },
    { opcode: 'B4', mnemonic: 'ORA H', bytes: 1, machineCode: 'B4', description: 'OR register H with accumulator', category: 'logical' },
    { opcode: 'B5', mnemonic: 'ORA L', bytes: 1, machineCode: 'B5', description: 'OR register L with accumulator', category: 'logical' },
    { opcode: 'B6', mnemonic: 'ORA M', bytes: 1, machineCode: 'B6', description: 'OR memory with accumulator', category: 'logical' },
    { opcode: 'B7', mnemonic: 'ORA A', bytes: 1, machineCode: 'B7', description: 'OR accumulator with accumulator', category: 'logical' },
    { opcode: 'F6', mnemonic: 'ORI', bytes: 2, machineCode: 'F6 dd', description: 'OR immediate with accumulator', category: 'logical' },
    { opcode: 'A8', mnemonic: 'XRA B', bytes: 1, machineCode: 'A8', description: 'XOR register B with accumulator', category: 'logical' },
    { opcode: 'A9', mnemonic: 'XRA C', bytes: 1, machineCode: 'A9', description: 'XOR register C with accumulator', category: 'logical' },
    { opcode: 'AA', mnemonic: 'XRA D', bytes: 1, machineCode: 'AA', description: 'XOR register D with accumulator', category: 'logical' },
    { opcode: 'AB', mnemonic: 'XRA E', bytes: 1, machineCode: 'AB', description: 'XOR register E with accumulator', category: 'logical' },
    { opcode: 'AC', mnemonic: 'XRA H', bytes: 1, machineCode: 'AC', description: 'XOR register H with accumulator', category: 'logical' },
    { opcode: 'AD', mnemonic: 'XRA L', bytes: 1, machineCode: 'AD', description: 'XOR register L with accumulator', category: 'logical' },
    { opcode: 'AE', mnemonic: 'XRA M', bytes: 1, machineCode: 'AE', description: 'XOR memory with accumulator', category: 'logical' },
    { opcode: 'AF', mnemonic: 'XRA A', bytes: 1, machineCode: 'AF', description: 'XOR accumulator with accumulator', category: 'logical' },
    { opcode: 'EE', mnemonic: 'XRI', bytes: 2, machineCode: 'EE dd', description: 'XOR immediate with accumulator', category: 'logical' },
    { opcode: '2F', mnemonic: 'CMA', bytes: 1, machineCode: '2F', description: 'Complement accumulator', category: 'logical' },
    { opcode: '3F', mnemonic: 'CMC', bytes: 1, machineCode: '3F', description: 'Complement carry flag', category: 'logical' },
    { opcode: '37', mnemonic: 'STC', bytes: 1, machineCode: '37', description: 'Set carry flag', category: 'logical' },
    
    // Branch Group
    { opcode: 'C3', mnemonic: 'JMP', bytes: 3, machineCode: 'C3 adr adr', description: 'Jump unconditionally', category: 'branch' },
    { opcode: 'C2', mnemonic: 'JNZ', bytes: 3, machineCode: 'C2 adr adr', description: 'Jump if not zero', category: 'branch' },
    { opcode: 'CA', mnemonic: 'JZ', bytes: 3, machineCode: 'CA adr adr', description: 'Jump if zero', category: 'branch' },
    { opcode: 'D2', mnemonic: 'JNC', bytes: 3, machineCode: 'D2 adr adr', description: 'Jump if no carry', category: 'branch' },
    { opcode: 'DA', mnemonic: 'JC', bytes: 3, machineCode: 'DA adr adr', description: 'Jump if carry', category: 'branch' },
    { opcode: 'E2', mnemonic: 'JPO', bytes: 3, machineCode: 'E2 adr adr', description: 'Jump if parity odd', category: 'branch' },
    { opcode: 'EA', mnemonic: 'JPE', bytes: 3, machineCode: 'EA adr adr', description: 'Jump if parity even', category: 'branch' },
    { opcode: 'F2', mnemonic: 'JP', bytes: 3, machineCode: 'F2 adr adr', description: 'Jump if positive', category: 'branch' },
    { opcode: 'FA', mnemonic: 'JM', bytes: 3, machineCode: 'FA adr adr', description: 'Jump if minus', category: 'branch' },
    { opcode: 'CD', mnemonic: 'CALL', bytes: 3, machineCode: 'CD adr adr', description: 'Call subroutine', category: 'branch' },
    { opcode: 'C4', mnemonic: 'CNZ', bytes: 3, machineCode: 'C4 adr adr', description: 'Call if not zero', category: 'branch' },
    { opcode: 'CC', mnemonic: 'CZ', bytes: 3, machineCode: 'CC adr adr', description: 'Call if zero', category: 'branch' },
    { opcode: 'D4', mnemonic: 'CNC', bytes: 3, machineCode: 'D4 adr adr', description: 'Call if no carry', category: 'branch' },
    { opcode: 'DC', mnemonic: 'CC', bytes: 3, machineCode: 'DC adr adr', description: 'Call if carry', category: 'branch' },
    { opcode: 'E4', mnemonic: 'CPO', bytes: 3, machineCode: 'E4 adr adr', description: 'Call if parity odd', category: 'branch' },
    { opcode: 'EC', mnemonic: 'CPE', bytes: 3, machineCode: 'EC adr adr', description: 'Call if parity even', category: 'branch' },
    { opcode: 'F4', mnemonic: 'CP', bytes: 3, machineCode: 'F4 adr adr', description: 'Call if positive', category: 'branch' },
    { opcode: 'FC', mnemonic: 'CM', bytes: 3, machineCode: 'FC adr adr', description: 'Call if minus', category: 'branch' },
    { opcode: 'C9', mnemonic: 'RET', bytes: 1, machineCode: 'C9', description: 'Return from subroutine', category: 'branch' },
    { opcode: 'C0', mnemonic: 'RNZ', bytes: 1, machineCode: 'C0', description: 'Return if not zero', category: 'branch' },
    { opcode: 'C8', mnemonic: 'RZ', bytes: 1, machineCode: 'C8', description: 'Return if zero', category: 'branch' },
    { opcode: 'D0', mnemonic: 'RNC', bytes: 1, machineCode: 'D0', description: 'Return if no carry', category: 'branch' },
    { opcode: 'D8', mnemonic: 'RC', bytes: 1, machineCode: 'D8', description: 'Return if carry', category: 'branch' },
    { opcode: 'E0', mnemonic: 'RPO', bytes: 1, machineCode: 'E0', description: 'Return if parity odd', category: 'branch' },
    { opcode: 'E8', mnemonic: 'RPE', bytes: 1, machineCode: 'E8', description: 'Return if parity even', category: 'branch' },
    { opcode: 'F0', mnemonic: 'RP', bytes: 1, machineCode: 'F0', description: 'Return if positive', category: 'branch' },
    { opcode: 'F8', mnemonic: 'RM', bytes: 1, machineCode: 'F8', description: 'Return if minus', category: 'branch' },
    { opcode: 'E9', mnemonic: 'PCHL', bytes: 1, machineCode: 'E9', description: 'Load program counter with H-L', category: 'branch' },
    { opcode: 'C7', mnemonic: 'RST 0', bytes: 1, machineCode: 'C7', description: 'Restart at address 0000H', category: 'branch' },
    { opcode: 'CF', mnemonic: 'RST 1', bytes: 1, machineCode: 'CF', description: 'Restart at address 0008H', category: 'branch' },
    { opcode: 'D7', mnemonic: 'RST 2', bytes: 1, machineCode: 'D7', description: 'Restart at address 0010H', category: 'branch' },
    { opcode: 'DF', mnemonic: 'RST 3', bytes: 1, machineCode: 'DF', description: 'Restart at address 0018H', category: 'branch' },
    { opcode: 'E7', mnemonic: 'RST 4', bytes: 1, machineCode: 'E7', description: 'Restart at address 0020H', category: 'branch' },
    { opcode: 'EF', mnemonic: 'RST 5', bytes: 1, machineCode: 'EF', description: 'Restart at address 0028H', category: 'branch' },
    { opcode: 'F7', mnemonic: 'RST 6', bytes: 1, machineCode: 'F7', description: 'Restart at address 0030H', category: 'branch' },
    { opcode: 'FF', mnemonic: 'RST 7', bytes: 1, machineCode: 'FF', description: 'Restart at address 0038H', category: 'branch' },
    
    // Stack Operations
    { opcode: 'C5', mnemonic: 'PUSH B', bytes: 1, machineCode: 'C5', description: 'Push register pair B-C on stack', category: 'stack' },
    { opcode: 'D5', mnemonic: 'PUSH D', bytes: 1, machineCode: 'D5', description: 'Push register pair D-E on stack', category: 'stack' },
    { opcode: 'E5', mnemonic: 'PUSH H', bytes: 1, machineCode: 'E5', description: 'Push register pair H-L on stack', category: 'stack' },
    { opcode: 'F5', mnemonic: 'PUSH PSW', bytes: 1, machineCode: 'F5', description: 'Push processor status word on stack', category: 'stack' },
    { opcode: 'C1', mnemonic: 'POP B', bytes: 1, machineCode: 'C1', description: 'Pop register pair B-C from stack', category: 'stack' },
    { opcode: 'D1', mnemonic: 'POP D', bytes: 1, machineCode: 'D1', description: 'Pop register pair D-E from stack', category: 'stack' },
    { opcode: 'E1', mnemonic: 'POP H', bytes: 1, machineCode: 'E1', description: 'Pop register pair H-L from stack', category: 'stack' },
    { opcode: 'F1', mnemonic: 'POP PSW', bytes: 1, machineCode: 'F1', description: 'Pop processor status word from stack', category: 'stack' },
    { opcode: 'E3', mnemonic: 'XTHL', bytes: 1, machineCode: 'E3', description: 'Exchange H-L with top of stack', category: 'stack' },
    { opcode: 'F9', mnemonic: 'SPHL', bytes: 1, machineCode: 'F9', description: 'Copy H-L register pair to stack pointer', category: 'stack' },
    
    // I/O Operations
    { opcode: 'DB', mnemonic: 'IN', bytes: 2, machineCode: 'DB pp', description: 'Input from port to accumulator', category: 'io' },
    { opcode: 'D3', mnemonic: 'OUT', bytes: 2, machineCode: 'D3 pp', description: 'Output from accumulator to port', category: 'io' },
    
    // Machine Control Instructions
    { opcode: '76', mnemonic: 'HLT', bytes: 1, machineCode: '76', description: 'Halt processor', category: 'machine-control' },
    { opcode: 'F3', mnemonic: 'DI', bytes: 1, machineCode: 'F3', description: 'Disable interrupts', category: 'machine-control' },
    { opcode: 'FB', mnemonic: 'EI', bytes: 1, machineCode: 'FB', description: 'Enable interrupts', category: 'machine-control' }
];

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentPage = 1;
    const itemsPerPage = 50;
    let filteredInstructions = [...instructionSet];
    let currentFilter = 'all';
    let searchTerm = '';

    // Initial render
    renderInstructions();
    updatePaginationInfo();
    
    // Set up event listeners
    setupEventListeners();

    // Filter dropdown functionality
    const filterDropdown = document.getElementById('filterDropdown');
    const filterMenu = document.getElementById('filterMenu');
    
    if (filterDropdown && filterMenu) {
        filterDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            filterMenu.classList.toggle('active');
        });
        
        // Close the menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.filter-dropdown')) {
                filterMenu.classList.remove('active');
            }
        });
    }

    // Search functionality
    function setupEventListeners() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                searchTerm = this.value.trim().toLowerCase();
                filterAndRenderInstructions();
            });
        }
        
        if (searchButton) {
            searchButton.addEventListener('click', function() {
                searchTerm = searchInput.value.trim().toLowerCase();
                filterAndRenderInstructions();
            });
        }
        
        // Filter options
        const filterOptions = document.querySelectorAll('.filter-option');
        filterOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                currentFilter = this.getAttribute('data-filter');
                
                // Update active state
                filterOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                filterMenu.classList.remove('active');
                filterAndRenderInstructions();
            });
        });
        
        // Pagination
        const prevPageBtn = document.getElementById('prev-page');
        const nextPageBtn = document.getElementById('next-page');
        
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', function() {
                if (currentPage > 1) {
                    currentPage--;
                    renderInstructions();
                    updatePaginationInfo();
                }
            });
        }
        
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', function() {
                const maxPages = Math.ceil(filteredInstructions.length / itemsPerPage);
                if (currentPage < maxPages) {
                    currentPage++;
                    renderInstructions();
                    updatePaginationInfo();
                }
            });
        }
    }

    function filterAndRenderInstructions() {
        currentPage = 1; // Reset to first page when applying new filters
        
        // Filter instructions based on category and search term
        filteredInstructions = instructionSet.filter(instruction => {
            const matchesCategory = currentFilter === 'all' || instruction.category === currentFilter;
            const matchesSearch = searchTerm === '' || 
                instruction.mnemonic.toLowerCase().includes(searchTerm) || 
                instruction.opcode.toLowerCase().includes(searchTerm) || 
                instruction.machineCode.toLowerCase().includes(searchTerm) || 
                instruction.description.toLowerCase().includes(searchTerm);
            
            return matchesCategory && matchesSearch;
        });
        
        renderInstructions();
        updatePaginationInfo();
    }

    function renderInstructions() {
        const tableBody = document.getElementById('instruction-table-body');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // Calculate start and end index for current page
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredInstructions.length);
        
        // Get current page data
        const currentPageData = filteredInstructions.slice(startIndex, endIndex);
        
        // Render table rows
        currentPageData.forEach(instruction => {
            const row = document.createElement('tr');
            
            // Opcode cell
            const opcodeCell = document.createElement('td');
            opcodeCell.textContent = instruction.opcode;
            row.appendChild(opcodeCell);
            
            // Mnemonic cell
            const mnemonicCell = document.createElement('td');
            mnemonicCell.textContent = instruction.mnemonic;
            row.appendChild(mnemonicCell);
            
            // Bytes cell
            const bytesCell = document.createElement('td');
            bytesCell.textContent = instruction.bytes;
            row.appendChild(bytesCell);
            
            // Machine code cell
            const machineCodeCell = document.createElement('td');
            const machineCodeSpan = document.createElement('span');
            machineCodeSpan.classList.add('machine-code');
            machineCodeSpan.textContent = instruction.machineCode;
            machineCodeCell.appendChild(machineCodeSpan);
            row.appendChild(machineCodeCell);
            
            // Description cell
            const descriptionCell = document.createElement('td');
            descriptionCell.textContent = instruction.description;
            row.appendChild(descriptionCell);
            
            // Category cell
            const categoryCell = document.createElement('td');
            categoryCell.textContent = formatCategory(instruction.category);
            row.appendChild(categoryCell);
            
            tableBody.appendChild(row);
        });
        
        // Update pagination buttons state
        updatePaginationButtonsState();
    }

    function updatePaginationInfo() {
        const totalItems = filteredInstructions.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, totalItems);
        
        const showingStartElem = document.getElementById('showing-start');
        const showingEndElem = document.getElementById('showing-end');
        const totalInstructionsElem = document.getElementById('total-instructions');
        const currentPageElem = document.getElementById('current-page');
        const totalPagesElem = document.getElementById('total-pages');
        
        if (showingStartElem) showingStartElem.textContent = startItem;
        if (showingEndElem) showingEndElem.textContent = endItem;
        if (totalInstructionsElem) totalInstructionsElem.textContent = totalItems;
        if (currentPageElem) currentPageElem.textContent = currentPage;
        if (totalPagesElem) totalPagesElem.textContent = totalPages;
    }

    function updatePaginationButtonsState() {
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');
        if (!prevButton || !nextButton) return;
        
        const totalPages = Math.ceil(filteredInstructions.length / itemsPerPage);
        
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages || totalPages === 0;
        
        // Add visual indication
        if (prevButton.disabled) {
            prevButton.classList.add('disabled');
        } else {
            prevButton.classList.remove('disabled');
        }
        
        if (nextButton.disabled) {
            nextButton.classList.add('disabled');
        } else {
            nextButton.classList.remove('disabled');
        }
    }

    function formatCategory(category) {
        // Convert hyphenated categories to title case
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
}); 