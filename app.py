from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

class Microprocessor8085:
    def __init__(self):
        # Initialize registers
        self.registers = {
            'A': 0x00,  # Accumulator
            'B': 0x00,
            'C': 0x00,
            'D': 0x00,
            'E': 0x00,
            'H': 0x00,
            'L': 0x00,
            'PC': 0x0000,  # Program Counter
            'SP': 0xFFFF,  # Stack Pointer
        }
        self.flags = {
            'S': False,  # Sign
            'Z': False,  # Zero
            'AC': False,  # Auxiliary Carry
            'P': False,  # Parity
            'CY': False,  # Carry
        }
        self.memory = [0x00] * 65536  # 64KB memory
        self.is_running = False

    def reset(self):
        self.__init__()

    def load_program(self, program, start_address=0):
        """Load a program into memory starting at the specified address"""
        for i, byte in enumerate(program):
            self.memory[start_address + i] = byte
        self.registers['PC'] = start_address

    def get_state(self):
        """Return the current state of the microprocessor"""
        # Make sure memory is properly initialized
        if not hasattr(self, 'memory') or not self.memory or len(self.memory) != 65536:
            self.memory = [0x00] * 65536
        
        # Make sure registers are properly initialized
        if not hasattr(self, 'registers') or not self.registers:
            self.registers = {
                'A': 0x00,  # Accumulator
                'B': 0x00,
                'C': 0x00,
                'D': 0x00,
                'E': 0x00,
                'H': 0x00,
                'L': 0x00,
                'PC': 0x0000,  # Program Counter
                'SP': 0xFFFF,  # Stack Pointer
            }
        
        # Make sure flags are properly initialized
        if not hasattr(self, 'flags') or not self.flags:
            self.flags = {
                'S': False,  # Sign
                'Z': False,  # Zero
                'AC': False,  # Auxiliary Carry
                'P': False,  # Parity
                'CY': False,  # Carry
            }
        
        return {
            'registers': self.registers,
            'flags': self.flags,
            'memory': self.memory,  # Return the entire memory
            'pc': self.registers['PC']
        }
    
    def goto_address(self, address):
        """Set the program counter to a specific address"""
        if 0 <= address <= 0xFFFF:
            self.registers['PC'] = address
            return True
        return False
    
    def write_to_memory(self, address, value):
        """Write a value to a specific memory address"""
        if 0 <= address <= 0xFFFF and 0 <= value <= 0xFF:
            self.memory[address] = value
            return True
        return False
    
    def execute_instruction(self):
        """Execute the instruction at the current program counter"""
        # Get the current instruction
        opcode = self.memory[self.registers['PC']]
        
        # Helper function to get HL address
        def get_hl_address():
            return (self.registers['H'] << 8) | self.registers['L']
        
        # Helper function to set HL address
        def set_hl(value):
            self.registers['H'] = (value >> 8) & 0xFF
            self.registers['L'] = value & 0xFF
        
        # Helper function to get BC address
        def get_bc_address():
            return (self.registers['B'] << 8) | self.registers['C']
        
        # Helper function to get DE address
        def get_de_address():
            return (self.registers['D'] << 8) | self.registers['E']
        
        # Helper function to update flags for arithmetic operations
        def update_flags_arithmetic(result, carry=None):
            self.flags['S'] = (result & 0x80) != 0
            self.flags['Z'] = (result & 0xFF) == 0
            if carry is not None:
                self.flags['CY'] = carry
            # Calculate parity
            temp = result & 0xFF
            parity = True
            while temp:
                parity = not parity
                temp = temp & (temp - 1)
            self.flags['P'] = parity
        
        # Helper function to push value onto stack
        def push(value):
            self.registers['SP'] = (self.registers['SP'] - 1) & 0xFFFF
            self.memory[self.registers['SP']] = (value >> 8) & 0xFF
            self.registers['SP'] = (self.registers['SP'] - 1) & 0xFFFF
            self.memory[self.registers['SP']] = value & 0xFF
        
        # Helper function to pop value from stack
        def pop():
            value = self.memory[self.registers['SP']]
            self.registers['SP'] = (self.registers['SP'] + 1) & 0xFFFF
            value |= self.memory[self.registers['SP']] << 8
            self.registers['SP'] = (self.registers['SP'] + 1) & 0xFFFF
            return value
        
        # Execute the instruction based on opcode
        if opcode == 0x00:  # NOP
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
            
        elif opcode == 0x07:  # RLC
            # Get the current value in accumulator
            a = self.registers['A']
            # Get the most significant bit
            msb = (a & 0x80) != 0
            # Rotate left by 1 bit
            a = ((a << 1) | (1 if msb else 0)) & 0xFF
            # Update accumulator
            self.registers['A'] = a
            # Update carry flag with the old MSB
            self.flags['CY'] = msb
            # Update other flags
            self.flags['S'] = (a & 0x80) != 0
            self.flags['Z'] = (a & 0xFF) == 0
            # Calculate parity
            temp = a & 0xFF
            parity = True
            while temp:
                parity = not parity
                temp = temp & (temp - 1)
            self.flags['P'] = parity
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        elif opcode == 0x0F:  # RRC (Rotate Right through Carry)
            # Get the current value in accumulator
            a = self.registers['A']
            # Get the least significant bit
            lsb = (a & 0x01) != 0
            # Rotate right by 1 bit
            a = ((a >> 1) | (0x80 if lsb else 0)) & 0xFF
            # Update accumulator
            self.registers['A'] = a
            # Update carry flag with the old LSB
            self.flags['CY'] = lsb
            # Update other flags
            self.flags['S'] = (a & 0x80) != 0
            self.flags['Z'] = (a & 0xFF) == 0
            # Calculate parity
            temp = a & 0xFF
            parity = True
            while temp:
                parity = not parity
                temp = temp & (temp - 1)
            self.flags['P'] = parity
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        elif opcode == 0x17:  # RAL (Rotate Left through Accumulator)
            # Get the current value in accumulator
            a = self.registers['A']
            # Get the most significant bit
            msb = (a & 0x80) != 0
            # Get the current carry
            cy = self.flags['CY']
            # Rotate left by 1 bit
            a = ((a << 1) | (1 if cy else 0)) & 0xFF
            # Update accumulator
            self.registers['A'] = a
            # Update carry flag with the old MSB
            self.flags['CY'] = msb
            # Update other flags
            self.flags['S'] = (a & 0x80) != 0
            self.flags['Z'] = (a & 0xFF) == 0
            # Calculate parity
            temp = a & 0xFF
            parity = True
            while temp:
                parity = not parity
                temp = temp & (temp - 1)
            self.flags['P'] = parity
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        elif opcode == 0x1F:  # RAR (Rotate Right through Accumulator)
            # Get the current value in accumulator
            a = self.registers['A']
            # Get the least significant bit
            lsb = (a & 0x01) != 0
            # Get the current carry
            cy = self.flags['CY']
            # Rotate right by 1 bit
            a = ((a >> 1) | (0x80 if cy else 0)) & 0xFF
            # Update accumulator
            self.registers['A'] = a
            # Update carry flag with the old LSB
            self.flags['CY'] = lsb
            # Update other flags
            self.flags['S'] = (a & 0x80) != 0
            self.flags['Z'] = (a & 0xFF) == 0
            # Calculate parity
            temp = a & 0xFF
            parity = True
            while temp:
                parity = not parity
                temp = temp & (temp - 1)
            self.flags['P'] = parity
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        elif opcode == 0x27:  # DAA
            # Get the current value in accumulator
            a = self.registers['A']
            # Get the current flags
            ac = self.flags['AC']
            cy = self.flags['CY']
            
            # Adjust for decimal arithmetic
            if ((a & 0x0F) > 9) or ac:
                a += 0x06
                self.flags['AC'] = True
            else:
                self.flags['AC'] = False
                
            if ((a & 0xF0) > 0x90) or cy:
                a += 0x60
                self.flags['CY'] = True
            else:
                self.flags['CY'] = False
                
            # Update accumulator with adjusted value
            self.registers['A'] = a & 0xFF
            # Update other flags
            self.flags['S'] = (a & 0x80) != 0
            self.flags['Z'] = (a & 0xFF) == 0
            # Calculate parity
            temp = a & 0xFF
            parity = True
            while temp:
                parity = not parity
                temp = temp & (temp - 1)
            self.flags['P'] = parity
            
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # MOV instructions (register to register)
        elif 0x40 <= opcode <= 0x7F:
            src_reg = "BCDEHLMA"[(opcode & 0x07)]
            dst_reg = "BCDEHLMA"[((opcode >> 3) & 0x07)]
            
            # Skip HLT opcode (0x76)
            if opcode == 0x76:
                return {'success': True, 'halt': True}
            
            # Special handling for MOV B,A (0x47) which is often problematic
            if opcode == 0x47:  # MOV B,A
                self.registers['B'] = self.registers['A']
                self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
                return {'success': True}
                
            # Handle memory access
            if src_reg == 'M':
                value = self.memory[get_hl_address()]
            else:
                value = self.registers[src_reg]
                
            if dst_reg == 'M':
                self.memory[get_hl_address()] = value
            else:
                self.registers[dst_reg] = value
                
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # XCHG instruction
        elif opcode == 0xEB:  # XCHG
            # Exchange H and L with D and E
            h_val = self.registers['H']
            l_val = self.registers['L']
            self.registers['H'] = self.registers['D']
            self.registers['L'] = self.registers['E']
            self.registers['D'] = h_val
            self.registers['E'] = l_val
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # MVI instructions (immediate to register)
        elif opcode in [0x06, 0x0E, 0x16, 0x1E, 0x26, 0x2E, 0x36, 0x3E]:
            reg = "BCDEHLMA"[(opcode >> 3) & 0x07]
            value = self.memory[self.registers['PC'] + 1]
            
            if reg == 'M':
                self.memory[get_hl_address()] = value
            else:
                self.registers[reg] = value
            self.registers['PC'] = (self.registers['PC'] + 2) & 0xFFFF
        
        # LXI instructions (immediate to register pair)
        elif opcode in [0x01, 0x11, 0x21, 0x31]:
            low = self.memory[self.registers['PC'] + 1]
            high = self.memory[self.registers['PC'] + 2]
            
            if opcode == 0x01:  # LXI B
                self.registers['B'] = high
                self.registers['C'] = low
            elif opcode == 0x11:  # LXI D
                self.registers['D'] = high
                self.registers['E'] = low
            elif opcode == 0x21:  # LXI H
                self.registers['H'] = high
                self.registers['L'] = low
            else:  # LXI SP
                self.registers['SP'] = (high << 8) | low
            self.registers['PC'] = (self.registers['PC'] + 3) & 0xFFFF
        
        # Direct Addressing Instructions
        elif opcode == 0x32:  # STA addr
            addr_low = self.memory[self.registers['PC'] + 1]
            addr_high = self.memory[self.registers['PC'] + 2]
            addr = (addr_high << 8) | addr_low
            self.memory[addr] = self.registers['A']
            self.registers['PC'] = (self.registers['PC'] + 3) & 0xFFFF
            
        elif opcode == 0x3A:  # LDA addr
            # Get the operand bytes
            addr_low = self.memory[self.registers['PC'] + 1]
            addr_high = self.memory[self.registers['PC'] + 2]
            
            # Calculate the address
            addr = (addr_high << 8) | addr_low
            
            # Load from memory into accumulator
            self.registers['A'] = self.memory[addr]
            
            # Increment PC by 3 (one for opcode, two for address)
            self.registers['PC'] = (self.registers['PC'] + 3) & 0xFFFF
            return {'success': True}
        
        elif opcode == 0x22:  # SHLD addr
            addr_low = self.memory[self.registers['PC'] + 1]
            addr_high = self.memory[self.registers['PC'] + 2]
            addr = (addr_high << 8) | addr_low
            self.memory[addr] = self.registers['L']
            self.memory[addr + 1] = self.registers['H']
            self.registers['PC'] = (self.registers['PC'] + 3) & 0xFFFF
            
        elif opcode == 0x2A:  # LHLD addr
            addr_low = self.memory[self.registers['PC'] + 1]
            addr_high = self.memory[self.registers['PC'] + 2]
            addr = (addr_high << 8) | addr_low
            self.registers['L'] = self.memory[addr]
            self.registers['H'] = self.memory[addr + 1]
            self.registers['PC'] = (self.registers['PC'] + 3) & 0xFFFF
        
        # STAX and LDAX instructions
        elif opcode in [0x02, 0x12, 0x0A, 0x1A]:
            if opcode == 0x02:  # STAX B
                self.memory[get_bc_address()] = self.registers['A']
            elif opcode == 0x12:  # STAX D
                self.memory[get_de_address()] = self.registers['A']
            elif opcode == 0x0A:  # LDAX B
                self.registers['A'] = self.memory[get_bc_address()]
            else:  # LDAX D
                self.registers['A'] = self.memory[get_de_address()]
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # ADD instructions
        elif 0x80 <= opcode <= 0x87:
            reg = "BCDEHLMA"[opcode & 0x07]
            if reg == 'M':
                value = self.memory[get_hl_address()]
            else:
                value = self.registers[reg]
            
            result = self.registers['A'] + value
            self.registers['A'] = result & 0xFF
            update_flags_arithmetic(result, result > 0xFF)
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # ADC instructions
        elif 0x88 <= opcode <= 0x8F:
            reg = "BCDEHLMA"[opcode & 0x07]
            if reg == 'M':
                value = self.memory[get_hl_address()]
            else:
                value = self.registers[reg]
            
            result = self.registers['A'] + value + (1 if self.flags['CY'] else 0)
            self.registers['A'] = result & 0xFF
            update_flags_arithmetic(result, result > 0xFF)
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # SUB instructions
        elif 0x90 <= opcode <= 0x97:
            reg = "BCDEHLMA"[opcode & 0x07]
            if reg == 'M':
                value = self.memory[get_hl_address()]
            else:
                value = self.registers[reg]
            
            result = self.registers['A'] - value
            self.registers['A'] = result & 0xFF
            update_flags_arithmetic(result, result < 0)
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # SBB instructions
        elif 0x98 <= opcode <= 0x9F:
            reg = "BCDEHLMA"[opcode & 0x07]
            if reg == 'M':
                value = self.memory[get_hl_address()]
            else:
                value = self.registers[reg]
            
            result = self.registers['A'] - value - (1 if self.flags['CY'] else 0)
            self.registers['A'] = result & 0xFF
            update_flags_arithmetic(result, result < 0)
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # ANA instructions
        elif 0xA0 <= opcode <= 0xA7:
            reg = "BCDEHLMA"[opcode & 0x07]
            if reg == 'M':
                value = self.memory[get_hl_address()]
            else:
                value = self.registers[reg]
            
            result = self.registers['A'] & value
            self.registers['A'] = result
            update_flags_arithmetic(result)
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF

        # ANI instruction
        elif opcode == 0xE6:
            value = self.memory[self.registers['PC'] + 1]
            result = self.registers['A'] & value
            self.registers['A'] = result
            update_flags_arithmetic(result)
            self.registers['PC'] = (self.registers['PC'] + 2) & 0xFFFF
        
        # XRA instructions
        elif 0xA8 <= opcode <= 0xAF:
            reg = "BCDEHLMA"[opcode & 0x07]
            if reg == 'M':
                value = self.memory[get_hl_address()]
            else:
                value = self.registers[reg]
            
            result = self.registers['A'] ^ value
            self.registers['A'] = result
            update_flags_arithmetic(result)
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # ORA instructions
        elif 0xB0 <= opcode <= 0xB7:
            reg = "BCDEHLMA"[opcode & 0x07]
            if reg == 'M':
                value = self.memory[get_hl_address()]
            else:
                value = self.registers[reg]
            
            result = self.registers['A'] | value
            self.registers['A'] = result
            update_flags_arithmetic(result)
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF

        # ORI instruction
        elif opcode == 0xF6:
            value = self.memory[self.registers['PC'] + 1]
            result = self.registers['A'] | value
            self.registers['A'] = result
            update_flags_arithmetic(result)
            self.registers['PC'] = (self.registers['PC'] + 2) & 0xFFFF

        # XRI instruction
        elif opcode == 0xEE:
            value = self.memory[self.registers['PC'] + 1]
            result = self.registers['A'] ^ value
            self.registers['A'] = result
            update_flags_arithmetic(result)
            self.registers['PC'] = (self.registers['PC'] + 2) & 0xFFFF
        
        # CMP instructions
        elif 0xB8 <= opcode <= 0xBF:
            reg = "BCDEHLMA"[opcode & 0x07]
            if reg == 'M':
                value = self.memory[get_hl_address()]
            else:
                value = self.registers[reg]
            
            result = self.registers['A'] - value
            update_flags_arithmetic(result, result < 0)
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # INX instructions
        elif opcode in [0x03, 0x13, 0x23, 0x33]:
            if opcode == 0x03:  # INX B
                bc = get_bc_address() + 1
                self.registers['B'] = (bc >> 8) & 0xFF
                self.registers['C'] = bc & 0xFF
            elif opcode == 0x13:  # INX D
                de = get_de_address() + 1
                self.registers['D'] = (de >> 8) & 0xFF
                self.registers['E'] = de & 0xFF
            elif opcode == 0x23:  # INX H
                hl = get_hl_address() + 1
                self.registers['H'] = (hl >> 8) & 0xFF
                self.registers['L'] = hl & 0xFF
            else:  # INX SP
                self.registers['SP'] = (self.registers['SP'] + 1) & 0xFFFF
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # DCR instructions
        elif 0x05 <= opcode <= 0x3D and opcode % 8 == 5:
            reg = "BCDEHLMA"[(opcode >> 3) & 0x07]
            if reg == 'M':
                addr = get_hl_address()
                value = self.memory[addr]
                result = (value - 1) & 0xFF
                self.memory[addr] = result
            else:
                result = (self.registers[reg] - 1) & 0xFF
                self.registers[reg] = result
            update_flags_arithmetic(result)
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # INR instructions
        elif 0x04 <= opcode <= 0x3C and opcode % 8 == 4:
            reg = "BCDEHLMA"[(opcode >> 3) & 0x07]
            if reg == 'M':
                addr = get_hl_address()
                value = self.memory[addr]
                result = (value + 1) & 0xFF
                self.memory[addr] = result
            else:
                result = (self.registers[reg] + 1) & 0xFF
                self.registers[reg] = result
            update_flags_arithmetic(result)
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # DCX instructions
        elif opcode in [0x0B, 0x1B, 0x2B, 0x3B]:
            if opcode == 0x0B:  # DCX B
                bc = get_bc_address() - 1
                self.registers['B'] = (bc >> 8) & 0xFF
                self.registers['C'] = bc & 0xFF
            elif opcode == 0x1B:  # DCX D
                de = get_de_address() - 1
                self.registers['D'] = (de >> 8) & 0xFF
                self.registers['E'] = de & 0xFF
            elif opcode == 0x2B:  # DCX H
                hl = get_hl_address() - 1
                self.registers['H'] = (hl >> 8) & 0xFF
                self.registers['L'] = hl & 0xFF
            else:  # DCX SP
                self.registers['SP'] = (self.registers['SP'] - 1) & 0xFFFF
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # DAD instructions
        elif opcode in [0x09, 0x19, 0x29, 0x39]:
            if opcode == 0x09:  # DAD B
                hl = get_hl_address()
                bc = get_bc_address()
                result = hl + bc
                self.registers['H'] = (result >> 8) & 0xFF
                self.registers['L'] = result & 0xFF
                self.flags['CY'] = result > 0xFFFF
            elif opcode == 0x19:  # DAD D
                hl = get_hl_address()
                de = get_de_address()
                result = hl + de
                self.registers['H'] = (result >> 8) & 0xFF
                self.registers['L'] = result & 0xFF
                self.flags['CY'] = result > 0xFFFF
            elif opcode == 0x29:  # DAD H
                hl = get_hl_address()
                result = hl + hl
                self.registers['H'] = (result >> 8) & 0xFF
                self.registers['L'] = result & 0xFF
                self.flags['CY'] = result > 0xFFFF
            else:  # DAD SP
                hl = get_hl_address()
                result = hl + self.registers['SP']
                self.registers['H'] = (result >> 8) & 0xFF
                self.registers['L'] = result & 0xFF
                self.flags['CY'] = result > 0xFFFF
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # PUSH instructions
        elif opcode in [0xC5, 0xD5, 0xE5, 0xF5]:
            if opcode == 0xC5:  # PUSH B
                push((self.registers['B'] << 8) | self.registers['C'])
            elif opcode == 0xD5:  # PUSH D
                push((self.registers['D'] << 8) | self.registers['E'])
            elif opcode == 0xE5:  # PUSH H
                push((self.registers['H'] << 8) | self.registers['L'])
            else:  # PUSH PSW
                psw = (self.registers['A'] << 8) | (
                    (1 if self.flags['S'] else 0) << 7 |
                    (1 if self.flags['Z'] else 0) << 6 |
                    (1 if self.flags['AC'] else 0) << 4 |
                    (1 if self.flags['P'] else 0) << 2 |
                    (1 if self.flags['CY'] else 0)
                )
                push(psw)
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # POP instructions
        elif opcode in [0xC1, 0xD1, 0xE1, 0xF1]:
            value = pop()
            if opcode == 0xC1:  # POP B
                self.registers['B'] = (value >> 8) & 0xFF
                self.registers['C'] = value & 0xFF
            elif opcode == 0xD1:  # POP D
                self.registers['D'] = (value >> 8) & 0xFF
                self.registers['E'] = value & 0xFF
            elif opcode == 0xE1:  # POP H
                self.registers['H'] = (value >> 8) & 0xFF
                self.registers['L'] = value & 0xFF
            else:  # POP PSW
                self.registers['A'] = (value >> 8) & 0xFF
                self.flags['S'] = (value & 0x80) != 0
                self.flags['Z'] = (value & 0x40) != 0
                self.flags['AC'] = (value & 0x10) != 0
                self.flags['P'] = (value & 0x04) != 0
                self.flags['CY'] = (value & 0x01) != 0
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # JMP instructions
        elif opcode == 0xC3:  # JMP addr
            addr_low = self.memory[self.registers['PC'] + 1]
            addr_high = self.memory[self.registers['PC'] + 2]
            self.registers['PC'] = (addr_high << 8) | addr_low
            return {'success': True}  # Return immediately to prevent PC modification
        
        # Conditional Jump instructions
        elif opcode in [0xC2, 0xCA, 0xD2, 0xDA, 0xE2, 0xEA, 0xF2, 0xFA]:
            addr_low = self.memory[self.registers['PC'] + 1]
            addr_high = self.memory[self.registers['PC'] + 2]
            addr = (addr_high << 8) | addr_low
            
            if opcode == 0xC2:  # JNZ addr
                if not self.flags['Z']:
                    self.registers['PC'] = addr
                    return
            elif opcode == 0xCA:  # JZ addr
                if self.flags['Z']:
                    self.registers['PC'] = addr
                    return
            elif opcode == 0xD2:  # JNC addr
                if not self.flags['CY']:
                    self.registers['PC'] = addr
                    return
            elif opcode == 0xDA:  # JC addr
                if self.flags['CY']:
                    self.registers['PC'] = addr
                    return
            elif opcode == 0xE2:  # JPO addr
                if not self.flags['P']:
                    self.registers['PC'] = addr
                    return
            elif opcode == 0xEA:  # JPE addr
                if self.flags['P']:
                    self.registers['PC'] = addr
                    return
            elif opcode == 0xF2:  # JP addr
                if not self.flags['S']:
                    self.registers['PC'] = addr
                    return
            else:  # JM addr
                if self.flags['S']:
                    self.registers['PC'] = addr
                    return
            
            self.registers['PC'] = (self.registers['PC'] + 3) & 0xFFFF
        
        # CALL instructions
        elif opcode == 0xCD:  # CALL addr
            addr_low = self.memory[self.registers['PC'] + 1]
            addr_high = self.memory[self.registers['PC'] + 2]
            addr = (addr_high << 8) | addr_low
            push(self.registers['PC'] + 3)
            self.registers['PC'] = addr
        
        # Conditional CALL instructions
        elif opcode in [0xC4, 0xCC, 0xD4, 0xDC, 0xE4, 0xEC, 0xF4, 0xFC]:
            addr_low = self.memory[self.registers['PC'] + 1]
            addr_high = self.memory[self.registers['PC'] + 2]
            addr = (addr_high << 8) | addr_low
            
            if opcode == 0xC4:  # CNZ addr
                if not self.flags['Z']:
                    push(self.registers['PC'] + 3)
                    self.registers['PC'] = addr
                    return
            elif opcode == 0xCC:  # CZ addr
                if self.flags['Z']:
                    push(self.registers['PC'] + 3)
                    self.registers['PC'] = addr
                    return
            elif opcode == 0xD4:  # CNC addr
                if not self.flags['CY']:
                    push(self.registers['PC'] + 3)
                    self.registers['PC'] = addr
                    return
            elif opcode == 0xDC:  # CC addr
                if self.flags['CY']:
                    push(self.registers['PC'] + 3)
                    self.registers['PC'] = addr
                    return
            elif opcode == 0xE4:  # CPO addr
                if not self.flags['P']:
                    push(self.registers['PC'] + 3)
                    self.registers['PC'] = addr
                    return
            elif opcode == 0xEC:  # CPE addr
                if self.flags['P']:
                    push(self.registers['PC'] + 3)
                    self.registers['PC'] = addr
                    return
            elif opcode == 0xF4:  # CP addr
                if not self.flags['S']:
                    push(self.registers['PC'] + 3)
                    self.registers['PC'] = addr
                    return
            else:  # CM addr
                if self.flags['S']:
                    push(self.registers['PC'] + 3)
                    self.registers['PC'] = addr
                    return
            
            self.registers['PC'] = (self.registers['PC'] + 3) & 0xFFFF
        
        # RET instructions
        elif opcode == 0xC9:  # RET
            self.registers['PC'] = pop()
        
        # Conditional RET instructions
        elif opcode in [0xC0, 0xC8, 0xD0, 0xD8, 0xE0, 0xE8, 0xF0, 0xF8]:
            if opcode == 0xC0:  # RNZ
                if not self.flags['Z']:
                    self.registers['PC'] = pop()
                    return
            elif opcode == 0xC8:  # RZ
                if self.flags['Z']:
                    self.registers['PC'] = pop()
                    return
            elif opcode == 0xD0:  # RNC
                if not self.flags['CY']:
                    self.registers['PC'] = pop()
                    return
            elif opcode == 0xD8:  # RC
                if self.flags['CY']:
                    self.registers['PC'] = pop()
                    return
            elif opcode == 0xE0:  # RPO
                if not self.flags['P']:
                    self.registers['PC'] = pop()
                    return
            elif opcode == 0xE8:  # RPE
                if self.flags['P']:
                    self.registers['PC'] = pop()
                    return
            elif opcode == 0xF0:  # RP
                if not self.flags['S']:
                    self.registers['PC'] = pop()
                    return
            else:  # RM
                if self.flags['S']:
                    self.registers['PC'] = pop()
                    return
            
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # RST instructions
        elif 0xC7 <= opcode <= 0xFF and opcode % 8 == 7:
            push(self.registers['PC'] + 1)
            self.registers['PC'] = opcode & 0x38
        
        # I/O Instructions
        elif opcode == 0xDB:  # IN port
            port = self.memory[self.registers['PC'] + 1]
            # In a real 8085, this would read from the specified I/O port
            # For simulation, we'll just set a default value
            self.registers['A'] = 0xFF  # Default value for simulation
            self.registers['PC'] = (self.registers['PC'] + 2) & 0xFFFF
            
        elif opcode == 0xD3:  # OUT port
            port = self.memory[self.registers['PC'] + 1]
            # In a real 8085, this would write to the specified I/O port
            # For simulation, we'll just acknowledge the operation
            self.registers['PC'] = (self.registers['PC'] + 2) & 0xFFFF
        
        # Interrupt Instructions
        elif opcode == 0xF3:  # DI (Disable Interrupts)
            # In a real 8085, this would disable interrupts
            # For simulation, we'll just acknowledge the operation
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
            
        elif opcode == 0xFB:  # EI (Enable Interrupts)
            # In a real 8085, this would enable interrupts
            # For simulation, we'll just acknowledge the operation
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
            
        elif opcode == 0xF0:  # SIM (Set Interrupt Mask)
            # In a real 8085, this would set the interrupt mask
            # For simulation, we'll just acknowledge the operation
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
            
        elif opcode == 0x20:  # RIM (Read Interrupt Mask)
            # In a real 8085, this would read the interrupt mask
            # For simulation, we'll just set a default value
            self.registers['A'] = 0x00  # Default value for simulation
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # Special Instructions
        elif opcode == 0x2F:  # CMA (Complement Accumulator)
            self.registers['A'] = (~self.registers['A']) & 0xFF
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
            
        elif opcode == 0xC6:  # ADI (Add Immediate)
            value = self.memory[self.registers['PC'] + 1]
            result = self.registers['A'] + value
            self.registers['A'] = result & 0xFF
            update_flags_arithmetic(result, result > 0xFF)
            self.registers['PC'] = (self.registers['PC'] + 2) & 0xFFFF
            
        elif opcode == 0xCE:  # ACI (Add Immediate with Carry)
            value = self.memory[self.registers['PC'] + 1]
            result = self.registers['A'] + value + (1 if self.flags['CY'] else 0)
            self.registers['A'] = result & 0xFF
            update_flags_arithmetic(result, result > 0xFF)
            self.registers['PC'] = (self.registers['PC'] + 2) & 0xFFFF
            
        elif opcode == 0xD6:  # SUI (Subtract Immediate)
            value = self.memory[self.registers['PC'] + 1]
            result = self.registers['A'] - value
            self.registers['A'] = result & 0xFF
            update_flags_arithmetic(result, result < 0)
            self.registers['PC'] = (self.registers['PC'] + 2) & 0xFFFF
            
        elif opcode == 0x3F:  # CMC (Complement Carry)
            self.flags['CY'] = not self.flags['CY']
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
            
        elif opcode == 0x37:  # STC (Set Carry)
            self.flags['CY'] = True
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
        
        # HLT instruction
        elif opcode == 0x76:  # HLT
            self.is_running = False
            self.registers['PC'] = (self.registers['PC'] + 1) & 0xFFFF
            return {'success': True, 'halt': True}
        
        else:
            # Unknown opcode - implement more instructions here
            pass
        
        # Return success
        return {'success': True}

    def run_until_halt(self):
        """Execute instructions until HLT is encountered"""
        self.is_running = True
        while self.is_running:
            self.execute_instruction()
        return self.get_state()

# Create a global instance of the microprocessor
microprocessor = Microprocessor8085()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/help')
def help():
    return render_template('help.html')

@app.route('/machine-code')
def machine_code():
    return render_template('machine_code.html')

@app.route('/donate')
def donate():
    return render_template('donate.html')

@app.route('/api/reset', methods=['POST'])
def reset():
    microprocessor.reset()
    return jsonify(microprocessor.get_state())

@app.route('/api/load', methods=['POST'])
def load_program():
    data = request.get_json()
    program = [int(x, 16) for x in data['program'].split()]
    start_address = int(data.get('start_address', 0))  # Default to 0 if not provided
    microprocessor.load_program(program, start_address)
    return jsonify(microprocessor.get_state())

@app.route('/api/step', methods=['POST'])
def step():
    microprocessor.execute_instruction()
    return jsonify(microprocessor.get_state())

@app.route('/api/goto', methods=['POST'])
def goto():
    data = request.get_json()
    address = data.get('address', 0)
    
    # Ensure address is an integer
    try:
        address = int(address)
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid address format'}), 400
    
    success = microprocessor.goto_address(address)
    if not success:
        return jsonify({'error': 'Invalid address'}), 400
    
    # Get the current state
    state = microprocessor.get_state()
    
    # Ensure memory is properly initialized
    if not state.get('memory'):
        state['memory'] = [0x00] * 65536
    
    return jsonify(state)

@app.route('/api/write', methods=['POST'])
def write():
    data = request.get_json()
    address = data.get('address', 0)
    value = data.get('value', 0)
    
    # Ensure address and value are integers
    try:
        address = int(address)
        value = int(value)
    except (TypeError, ValueError):
        return jsonify({'error': 'Invalid address or value format'}), 400
    
    success = microprocessor.write_to_memory(address, value)
    if not success:
        return jsonify({'error': 'Invalid address or value'}), 400
    
    # Get the current state
    state = microprocessor.get_state()
    
    # Ensure memory is properly initialized
    if not state.get('memory'):
        state['memory'] = [0x00] * 65536
    
    return jsonify(state)

@app.route('/api/execute', methods=['POST'])
def execute():
    try:
        microprocessor.execute_instruction()
    except Exception as e:
        return jsonify({'error': f'Error executing instruction: {str(e)}'}), 500
    
    # Get the current state
    state = microprocessor.get_state()
    
    # Ensure memory is properly initialized
    if not state.get('memory'):
        state['memory'] = [0x00] * 65536
    
    return jsonify(state)

@app.route('/api/run', methods=['POST'])
def run():
    try:
        state = microprocessor.run_until_halt()
        return jsonify(state)
    except Exception as e:
        return jsonify({'error': f'Error running program: {str(e)}'}), 500

@app.route('/execute_instruction', methods=['POST'])
def execute_instruction():
    try:
        data = request.get_json()
        address = data.get('address')
        
        # If a specific address is provided, set the PC to that address
        if address is not None:
            microprocessor.registers['PC'] = address
            print(f"Setting PC to: {address:04X}")
        
        # Get the current program counter
        pc = microprocessor.registers['PC']
        print(f"Current PC: {pc:04X}")
            
        # Check if we have a valid instruction at the current address
        if pc >= len(microprocessor.memory):
            return jsonify({
                'success': False,
                'error': 'Program counter out of bounds'
            })
            
        # Get the opcode
        opcode = microprocessor.memory[pc]
        print(f"Opcode at PC: {opcode:02X}")
        
        # Get instruction info for history
        mnemonic, operand = get_instruction_info(opcode, microprocessor.memory, pc)
        machine_code = format_machine_code(opcode, microprocessor.memory, pc)
        print(f"Executing: {mnemonic} {operand} (Machine Code: {machine_code})")
        
        # Store the original PC to verify it changes properly
        original_pc = pc
        
        # Execute the instruction
        result = microprocessor.execute_instruction()
        
        # Check if the PC was updated
        new_pc = microprocessor.registers['PC']
        print(f"New PC after instruction: {new_pc:04X}")
        
        # Verify PC moved forward as expected
        if new_pc == original_pc:
            print("Warning: PC did not change after execution!")
        
        if not result.get('success'):
            return jsonify({
                'success': False,
                'error': result.get('error', 'Failed to execute instruction')
            })
        
        # Get the updated state
        state = microprocessor.get_state()
        
        # Add instruction to history
        instruction_history = [{
            'address': pc,
            'opcode': opcode,
            'mnemonic': mnemonic,
            'operand': operand,
            'machine_code': machine_code,
            'registers': state['registers'],
            'flags': state['flags']
        }]
        
        # Return the current state with instruction history
        return jsonify({
            'success': True,
            'state': state,
            'instruction_history': instruction_history
        })
        
    except Exception as e:
        print(f"Exception during instruction execution: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Error executing instruction: {str(e)}'
        })

@app.route('/run_program', methods=['POST'])
def run_program():
    try:
        # Run the program until HLT is encountered
        while True:
            # Execute the current instruction
            result = microprocessor.execute_instruction()
            
            # Check if HLT was encountered
            if result.get('halt'):
                break
                
            # Check for errors
            if not result.get('success'):
                return jsonify({
                    'success': False,
                    'error': result.get('error', 'Unknown error occurred')
                })
        
        # Return the final state
        return jsonify({
            'success': True,
            'state': microprocessor.get_state()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/get_memory', methods=['GET'])
def get_memory():
    """Get the current memory state."""
    try:
        # Return the current memory state
        return jsonify({
            'memory': microprocessor.memory,
            'registers': microprocessor.registers,
            'flags': microprocessor.flags
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/run_from_address', methods=['POST'])
def run_from_address():
    try:
        data = request.get_json()
        start_address = data.get('address', 0)
        
        # Set the program counter to start address
        microprocessor.registers['PC'] = start_address
        
        # Execute instructions until HLT is encountered
        instruction_history = []
        halted = False
        
        while not halted and microprocessor.registers['PC'] < 0xFFFF:
            # Get the current PC
            current_address = microprocessor.registers['PC']
            
            # Get the current opcode
            opcode = microprocessor.memory[current_address]
            
            # Get instruction info for history before execution
            mnemonic, operand = get_instruction_info(opcode, microprocessor.memory, current_address)
            
            # Execute the instruction and get the result
            result = microprocessor.execute_instruction()
            
            # Add to instruction history
            instruction_history.append({
                'address': current_address,
                'opcode': opcode,
                'mnemonic': mnemonic,
                'operand': operand,
                'machine_code': format_machine_code(opcode, microprocessor.memory, current_address)
            })
            
            # Check if HLT was encountered
            if opcode == 0x76 or result.get('halt'):
                halted = True
                break
        
        # Get the final state
        state = microprocessor.get_state()
        
        return jsonify({
            'success': True,
            'state': state,
            'instruction_history': instruction_history
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/execute_instructions', methods=['POST'])
def execute_instructions():
    try:
        data = request.get_json()
        instructions = data.get('instructions', [])
        start_address = data.get('start_address', 0)
        
        # Set PC to start address
        microprocessor.registers['PC'] = start_address
        
        # Execute each instruction
        instruction_history = []
        
        for instruction in instructions:
            # Get the opcode
            opcode = instruction['opcode']
            address = instruction['address']
            
            # Get instruction info for history
            mnemonic, operand = get_instruction_info(opcode, microprocessor.memory, address)
            
            # Execute the instruction
            result = microprocessor.execute_instruction()
            
            # Get updated state
            state = microprocessor.get_state()
            
            # Add to instruction history
            instruction_history.append({
                'address': address,
                'opcode': opcode,
                'mnemonic': mnemonic,
                'operand': operand,
                'registers': state['registers'],
                'flags': state['flags']
            })
            
            # Check if HLT was encountered
            if result.get('halt'):
                break
        
        return jsonify({
            'success': True,
            'state': microprocessor.get_state(),
            'instruction_history': instruction_history
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def get_instruction_info(opcode, memory, pc):
    """Get mnemonic and operand for an instruction based on opcode."""
    # Instruction set mapping
    instruction_set = {
        # Data Transfer Group
        0x40: ('MOV B,B', ''),
        0x41: ('MOV B,C', ''),
        0x42: ('MOV B,D', ''),
        0x43: ('MOV B,E', ''),
        0x44: ('MOV B,H', ''),
        0x45: ('MOV B,L', ''),
        0x46: ('MOV B,M', ''),
        0x47: ('MOV B,A', ''),
        0x48: ('MOV C,B', ''),
        0x49: ('MOV C,C', ''),
        0x4A: ('MOV C,D', ''),
        0x4B: ('MOV C,E', ''),
        0x4C: ('MOV C,H', ''),
        0x4D: ('MOV C,L', ''),
        0x4E: ('MOV C,M', ''),
        0x4F: ('MOV C,A', ''),
        0x50: ('MOV D,B', ''),
        0x51: ('MOV D,C', ''),
        0x52: ('MOV D,D', ''),
        0x53: ('MOV D,E', ''),
        0x54: ('MOV D,H', ''),
        0x55: ('MOV D,L', ''),
        0x56: ('MOV D,M', ''),
        0x57: ('MOV D,A', ''),
        0x58: ('MOV E,B', ''),
        0x59: ('MOV E,C', ''),
        0x5A: ('MOV E,D', ''),
        0x5B: ('MOV E,E', ''),
        0x5C: ('MOV E,H', ''),
        0x5D: ('MOV E,L', ''),
        0x5E: ('MOV E,M', ''),
        0x5F: ('MOV E,A', ''),
        0x60: ('MOV H,B', ''),
        0x61: ('MOV H,C', ''),
        0x62: ('MOV H,D', ''),
        0x63: ('MOV H,E', ''),
        0x64: ('MOV H,H', ''),
        0x65: ('MOV H,L', ''),
        0x66: ('MOV H,M', ''),
        0x67: ('MOV H,A', ''),
        0x68: ('MOV L,B', ''),
        0x69: ('MOV L,C', ''),
        0x6A: ('MOV L,D', ''),
        0x6B: ('MOV L,E', ''),
        0x6C: ('MOV L,H', ''),
        0x6D: ('MOV L,L', ''),
        0x6E: ('MOV L,M', ''),
        0x6F: ('MOV L,A', ''),
        0x70: ('MOV M,B', ''),
        0x71: ('MOV M,C', ''),
        0x72: ('MOV M,D', ''),
        0x73: ('MOV M,E', ''),
        0x74: ('MOV M,H', ''),
        0x75: ('MOV M,L', ''),
        0x77: ('MOV M,A', ''),
        0x78: ('MOV A,B', ''),
        0x79: ('MOV A,C', ''),
        0x7A: ('MOV A,D', ''),
        0x7B: ('MOV A,E', ''),
        0x7C: ('MOV A,H', ''),
        0x7D: ('MOV A,L', ''),
        0x7E: ('MOV A,M', ''),
        0x7F: ('MOV A,A', ''),
        
        # Immediate Data Transfer
        0x06: ('MVI B', ''),
        0x0E: ('MVI C', ''),
        0x16: ('MVI D', ''),
        0x1E: ('MVI E', ''),
        0x26: ('MVI H', ''),
        0x2E: ('MVI L', ''),
        0x36: ('MVI M', ''),
        0x3E: ('MVI A', ''),
        
        # Register Pair Instructions
        0x01: ('LXI B', ''),
        0x11: ('LXI D', ''),
        0x21: ('LXI H', ''),
        0x31: ('LXI SP', ''),
        0x03: ('INX B', ''),
        0x13: ('INX D', ''),
        0x23: ('INX H', ''),
        0x33: ('INX SP', ''),
        0x0B: ('DCX B', ''),
        0x1B: ('DCX D', ''),
        0x2B: ('DCX H', ''),
        0x3B: ('DCX SP', ''),
        
        # Direct Addressing Instructions
        0x32: ('STA', ''),
        0x3A: ('LDA', ''),
        0x22: ('SHLD', ''),
        0x2A: ('LHLD', ''),
        
        # Indirect Addressing Instructions
        0x02: ('STAX B', ''),
        0x12: ('STAX D', ''),
        0x0A: ('LDAX B', ''),
        0x1A: ('LDAX D', ''),
        
        # Arithmetic Group
        0x80: ('ADD B', ''),
        0x81: ('ADD C', ''),
        0x82: ('ADD D', ''),
        0x83: ('ADD E', ''),
        0x84: ('ADD H', ''),
        0x85: ('ADD L', ''),
        0x86: ('ADD M', ''),
        0x87: ('ADD A', ''),
        0xC6: ('ADI', ''),
        
        0x88: ('ADC B', ''),
        0x89: ('ADC C', ''),
        0x8A: ('ADC D', ''),
        0x8B: ('ADC E', ''),
        0x8C: ('ADC H', ''),
        0x8D: ('ADC L', ''),
        0x8E: ('ADC M', ''),
        0x8F: ('ADC A', ''),
        0xCE: ('ACI', ''),
        
        0x90: ('SUB B', ''),
        0x91: ('SUB C', ''),
        0x92: ('SUB D', ''),
        0x93: ('SUB E', ''),
        0x94: ('SUB H', ''),
        0x95: ('SUB L', ''),
        0x96: ('SUB M', ''),
        0x97: ('SUB A', ''),
        0xD6: ('SUI', ''),
        
        # Branch Group
        0xC3: ('JMP', ''),
        0xC2: ('JNZ', ''),
        0xCA: ('JZ', ''),
        0xD2: ('JNC', ''),
        0xDA: ('JC', ''),
        0xE2: ('JPO', ''),
        0xEA: ('JPE', ''),
        0xF2: ('JP', ''),
        0xFA: ('JM', ''),
        
        # Call and Return Group
        0xCD: ('CALL', ''),
        0xC4: ('CNZ', ''),
        0xCC: ('CZ', ''),
        0xD4: ('CNC', ''),
        0xDC: ('CC', ''),
        0xE4: ('CPO', ''),
        0xEC: ('CPE', ''),
        0xF4: ('CP', ''),
        0xFC: ('CM', ''),
        
        0xC9: ('RET', ''),
        0xC0: ('RNZ', ''),
        0xC8: ('RZ', ''),
        0xD0: ('RNC', ''),
        0xD8: ('RC', ''),
        0xE0: ('RPO', ''),
        0xE8: ('RPE', ''),
        0xF0: ('RP', ''),
        0xF8: ('RM', ''),
        
        # Stack Operations
        0xC5: ('PUSH B', ''),
        0xD5: ('PUSH D', ''),
        0xE5: ('PUSH H', ''),
        0xF5: ('PUSH PSW', ''),
        0xC1: ('POP B', ''),
        0xD1: ('POP D', ''),
        0xE1: ('POP H', ''),
        0xF1: ('POP PSW', ''),
        
        # Special Instructions
        0x00: ('NOP', ''),
        0x76: ('HLT', ''),
        0xF3: ('DI', ''),
        0xFB: ('EI', ''),
        
        # Logical Group
        0xA0: ('ANA B', ''),
        0xA1: ('ANA C', ''),
        0xA2: ('ANA D', ''),
        0xA3: ('ANA E', ''),
        0xA4: ('ANA H', ''),
        0xA5: ('ANA L', ''),
        0xA6: ('ANA M', ''),
        0xA7: ('ANA A', ''),
        0xE6: ('ANI', ''),
        
        0xB0: ('ORA B', ''),
        0xB1: ('ORA C', ''),
        0xB2: ('ORA D', ''),
        0xB3: ('ORA E', ''),
        0xB4: ('ORA H', ''),
        0xB5: ('ORA L', ''),
        0xB6: ('ORA M', ''),
        0xB7: ('ORA A', ''),
        0xF6: ('ORI', ''),
        
        0xA8: ('XRA B', ''),
        0xA9: ('XRA C', ''),
        0xAA: ('XRA D', ''),
        0xAB: ('XRA E', ''),
        0xAC: ('XRA H', ''),
        0xAD: ('XRA L', ''),
        0xAE: ('XRA M', ''),
        0xAF: ('XRA A', ''),
        0xEE: ('XRI', ''),
        
        0xB8: ('CMP B', ''),
        0xB9: ('CMP C', ''),
        0xBA: ('CMP D', ''),
        0xBB: ('CMP E', ''),
        0xBC: ('CMP H', ''),
        0xBD: ('CMP L', ''),
        0xBE: ('CMP M', ''),
        0xBF: ('CMP A', ''),
        0xFE: ('CPI', ''),
        
        # Rotate Group
        0x07: ('RLC', ''),
        0x0F: ('RRC', ''),
        0x17: ('RAL', ''),
        0x1F: ('RAR', ''),
        
        # I/O Instructions
        0xDB: ('IN', ''),
        0xD3: ('OUT', ''),
        0xEB: ('XCHG', '')
    }
    
    # Get the instruction info
    info = instruction_set.get(opcode, ('UNKNOWN', ''))
    mnemonic = info[0]
    operand = info[1]
    
    # Handle different instruction types
    if opcode in [0x06, 0x0E, 0x16, 0x1E, 0x26, 0x2E, 0x36, 0x3E, 0xC6, 0xCE, 0xD6, 0xFE, 0xE6, 0xF6, 0xEE]:
        # Instructions with one byte operand
        operand = f"#{memory[pc + 1]:02X}"
    elif opcode in [0x01, 0x11, 0x21, 0x31, 0xC3, 0xC2, 0xCA, 0xD2, 0xDA, 0xE2, 0xEA, 0xF2, 0xFA, 0xCD, 0xC4, 0xCC, 0xD4, 0xDC, 0xE4, 0xEC, 0xF4, 0xFC, 0x32, 0x3A, 0x22, 0x2A]:
        # Instructions with two byte operand
        operand = f"#{memory[pc + 2]:02X}{memory[pc + 1]:02X}"
    
    return mnemonic, operand

def format_machine_code(opcode, memory, pc):
    """Format machine code for display."""
    # Build the machine code string
    machine_code = f"{opcode:02X}"
    
    # Handle different instruction types
    if opcode in [0x06, 0x0E, 0x16, 0x1E, 0x26, 0x2E, 0x36, 0x3E, 0xC6, 0xCE, 0xD6, 0xFE, 0xE6, 0xF6, 0xEE]:
        # Instructions with one byte operand
        machine_code += f" {memory[pc + 1]:02X}"
    elif opcode in [0x01, 0x11, 0x21, 0x31, 0xC3, 0xC2, 0xCA, 0xD2, 0xDA, 0xE2, 0xEA, 0xF2, 0xFA, 0xCD, 0xC4, 0xCC, 0xD4, 0xDC, 0xE4, 0xEC, 0xF4, 0xFC, 0x32, 0x3A, 0x22, 0x2A]:
        # Instructions with two byte operand
        machine_code += f" {memory[pc + 1]:02X} {memory[pc + 2]:02X}"
    
    return machine_code

if __name__ == '__main__':
    app.run(debug=True) 

