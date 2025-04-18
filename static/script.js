// Update the UI with the current state
function updateState(data) {
    // Update registers
    for (const [reg, value] of Object.entries(data.registers)) {
        const element = document.getElementById(`register-${reg.toLowerCase()}`);
        if (element) {
            element.textContent = value.toString(16).padStart(2, '0').toUpperCase();
        }
    }
    
    // Update flags
    for (const [flag, value] of Object.entries(data.flags)) {
        const element = document.getElementById(`flag-${flag.toLowerCase()}`);
        if (element) {
            element.textContent = value ? '1' : '0';
        }
    }
    
    // Update memory address input
    const addressInput = document.getElementById('memory-address');
    if (addressInput) {
        addressInput.value = data.registers.PC.toString(16).padStart(4, '0').toUpperCase();
    }
    
    // Update memory display
    updateMemoryDisplay();
}

// Update the UI with the current state
function updateUI(state) {
    console.log("updateUI called with state:", state); // Log the entire state received

    // Make sure we have a valid state
    if (!state || typeof state !== 'object' || !state.registers || typeof state.registers !== 'object' || 
        !state.flags || typeof state.flags !== 'object' || 
        !state.memory || !Array.isArray(state.memory)) {
        console.error('Invalid or incomplete state received in updateUI:', state);
        alert("Error: Received invalid state from the server. Check console for details.");
        return;
    }
    
    try {
        console.log("Updating registers...");
        // Update registers with null checks
        const regElements = {
            'A': document.getElementById('reg-A'),
            'B': document.getElementById('reg-B'),
            'C': document.getElementById('reg-C'),
            'D': document.getElementById('reg-D'),
            'E': document.getElementById('reg-E'),
            'H': document.getElementById('reg-H'),
            'L': document.getElementById('reg-L'),
            'PC': document.getElementById('reg-PC'),
            'SP': document.getElementById('reg-SP')
        };
        
        for (const [reg, element] of Object.entries(regElements)) {
            if (element && state.registers[reg] !== undefined) {
                const padding = (reg === 'PC' || reg === 'SP') ? 4 : 2;
                element.textContent = state.registers[reg].toString(16).toUpperCase().padStart(padding, '0');
            } else if (!element) {
                console.warn(`Element for register ${reg} not found in the DOM`);
            }
        }
        
        console.log("Updating flags...");
        // Update flags with null checks
        const flagElements = {
            'S': document.getElementById('flag-S'),
            'Z': document.getElementById('flag-Z'),
            'AC': document.getElementById('flag-AC'),
            'P': document.getElementById('flag-P'),
            'CY': document.getElementById('flag-CY')
        };
        
        for (const [flag, element] of Object.entries(flagElements)) {
            if (element && state.flags[flag] !== undefined) {
                element.textContent = state.flags[flag] ? '1' : '0';
            } else if (!element) {
                console.warn(`Element for flag ${flag} not found in the DOM`);
            }
        }
        
        // Get current address from input field (ensure it exists)
        const addressInput = document.getElementById('memory-address');
        if (!addressInput) {
            console.error("Memory address input field not found!");
            return;
        }
        const currentAddress = parseInt(addressInput.value, 16);
        console.log(`Current address from input: 0x${currentAddress.toString(16).toUpperCase()}`);
        
        // Calculate starting address for memory display (aligned to 16-byte boundary)
        const startAddress = Math.max(0, Math.floor(currentAddress / 16) * 16);
        console.log(`Calculated start address for display: 0x${startAddress.toString(16).toUpperCase()}`);
        
        // Update memory display (ensure it exists)
        const memoryDisplay = document.getElementById('memory-display');
        if (!memoryDisplay) {
            console.error("Memory display container not found!");
            return;
        }
        memoryDisplay.innerHTML = ''; // Clear previous content
        console.log("Cleared memory display. Memory array length:", state.memory.length);

        // Display 4 rows of 16 bytes each (64 bytes total)
        for (let row = 0; row < 4; row++) {
            const rowAddress = startAddress + (row * 16);
            // Stop if we go past the max memory address
            if (rowAddress > 0xFFFF) break; 

            // Create address label
            const addressLabel = document.createElement('div');
            addressLabel.className = 'memory-address-label';
            addressLabel.textContent = rowAddress.toString(16).toUpperCase().padStart(4, '0');
            memoryDisplay.appendChild(addressLabel);
            
            // Create row container
            const rowContainer = document.createElement('div');
            rowContainer.className = 'memory-row';
            
            // Create cells for this row
            for (let col = 0; col < 16; col++) {
                const cellAddress = rowAddress + col;
                // Stop if we go past the max memory address
                if (cellAddress > 0xFFFF) break; 

                const cell = document.createElement('div');
                cell.className = 'memory-cell';
                
                // Highlight current address and PC
                if (cellAddress === currentAddress) {
                    cell.classList.add('current-address');
                }
                if (cellAddress === state.registers.PC) {
                    cell.classList.add('program-counter');
                }
                
                // Set cell content
                const value = state.memory[cellAddress];
                if (value !== undefined && value !== null) { // Check if value exists
                    cell.textContent = value.toString(16).toUpperCase().padStart(2, '0');
                    cell.setAttribute('data-address', cellAddress.toString(16).toUpperCase().padStart(4, '0'));
                } else {
                    // If memory value is missing, show 00 as default
                    console.warn(`Memory value missing at address 0x${cellAddress.toString(16).toUpperCase()}, defaulting to 00`);
                    cell.textContent = '00';
                    cell.setAttribute('data-address', cellAddress.toString(16).toUpperCase().padStart(4, '0'));
                }
                
                rowContainer.appendChild(cell);
            }
            
            memoryDisplay.appendChild(rowContainer);
        }
        console.log("Finished updating memory display grid.");

        // Update memory address and machine code inputs (check existence)
        const codeInput = document.getElementById('machine-code');
        if (!codeInput) {
            console.error("Machine code input field not found!");
            return;
        }
        // Only update codeInput if the address is valid and memory exists there
        const currentMemoryValue = state.memory[currentAddress];
        if (currentAddress <= 0xFFFF && currentMemoryValue !== undefined && currentMemoryValue !== null) {
            codeInput.value = currentMemoryValue.toString(16).toUpperCase().padStart(2, '0');
        } else {
            // Don't clear if just navigated, keep it empty from goToAddressAt
            // codeInput.value = ''; // Avoid clearing unnecessarily 
        }
        console.log("UI update complete.");

    } catch (error) {
        console.error('Error updating UI:', error);
        alert("An error occurred while updating the interface. Check console for details.");
    }
}

// Load a program into the simulator
async function loadProgram() {
    const programInput = document.getElementById('program-input');
    const program = programInput.value.trim();
    
    if (!program) {
        alert('Please enter a program');
        return;
    }

    try {
        // Get current address from memory address input
        const currentAddress = parseInt(document.getElementById('memory-address').value, 16);
        
        const response = await fetch('/api/load', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                program: program,
                start_address: currentAddress 
            }),
        });
        
        const state = await response.json();
        updateUI(state);
    } catch (error) {
        alert('Error loading program: ' + error.message);
    }
}

// Step through the program
async function step() {
    try {
        const response = await fetch('/api/step', {
            method: 'POST',
        });
        
        const state = await response.json();
        updateUI(state);
        addInstructionToHistory(state);
    } catch (error) {
        alert('Error stepping through program: ' + error.message);
    }
}

// Reset the simulator
async function reset() {
    try {
        const response = await fetch('/api/reset', {
            method: 'POST',
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to reset simulator');
        }
        
        const state = await response.json();
        updateUI(state);
        
        // Clear instruction history if the element exists
        const instructionHistory = document.getElementById('instruction-history');
        if (instructionHistory) {
            instructionHistory.innerHTML = '';
        }
        
        // Reset memory address and machine code inputs
        document.getElementById('memory-address').value = '0000';
        document.getElementById('machine-code').value = '';
    } catch (error) {
        console.error('Error resetting simulator:', error);
        alert('Error resetting simulator: ' + error.message);
    }
}

// Calculator Interface Functions
let activeInput = 'memory-address'; // Default active input

// Set the active input field
function setActiveInput(inputId) {
    activeInput = inputId;
    document.getElementById(inputId).focus();
}

// Append a character to the active input
function appendToInput(char) {
    const input = document.getElementById(activeInput);
    if (input.value.length < input.maxLength) {
        // Always convert to uppercase for machine code
        if (activeInput === 'machine-code') {
            input.value += char.toUpperCase();
        } else {
            input.value += char;
        }
    }
}

// Clear the active input
function clearInput() {
    document.getElementById(activeInput).value = '';
}

// Backspace function
function backspace() {
    const input = document.getElementById(activeInput);
    input.value = input.value.slice(0, -1);
}

// Navigate to previous address
async function prevAddress() {
    const addressInput = document.getElementById('memory-address');
    const codeInput = document.getElementById('machine-code');
    
    const currentAddress = parseInt(addressInput.value, 16);
    const prevAddressValue = (currentAddress - 1) & 0xFFFF;
    
    // Write the current machine code to memory before changing address
    const currentCode = codeInput.value.trim();
    if (currentCode) {
        const codeValue = parseInt(currentCode, 16);
        if (!isNaN(codeValue) && codeValue >= 0 && codeValue <= 0xFF) {
            // Write but don't necessarily need the returned state immediately
            await writeToMemoryAt(currentAddress, codeValue); 
        }
    }
    
    // Navigate to the previous address and update UI via goToAddressAt
    await goToAddressAt(prevAddressValue);
}

// Navigate to next address
async function nextAddress() {
    const addressInput = document.getElementById('memory-address');
    const codeInput = document.getElementById('machine-code');
    
    const currentAddress = parseInt(addressInput.value, 16);
    const nextAddressValue = (currentAddress + 1) & 0xFFFF;
    
    // Write the current machine code to memory before changing address
    const currentCode = codeInput.value.trim();
    if (currentCode) {
        const codeValue = parseInt(currentCode, 16);
        if (!isNaN(codeValue) && codeValue >= 0 && codeValue <= 0xFF) {
             // Write but don't necessarily need the returned state immediately
            await writeToMemoryAt(currentAddress, codeValue);
        }
    }
    
    // Navigate to the next address and update UI via goToAddressAt
    await goToAddressAt(nextAddressValue);
}

// Go to address specified in the input field
async function goToAddress() {
    const addressInput = document.getElementById('memory-address');
    const addressString = addressInput.value.trim();
    const addressValue = parseInt(addressString, 16);

    if (isNaN(addressValue) || addressValue < 0 || addressValue > 0xFFFF) {
        alert('Please enter a valid hexadecimal address between 0000 and FFFF.');
        return;
    }

    // Note: We might lose the value in the code input if not written.
    // Consider if writing should happen here too, or if it's okay
    // to only write on prev/next/step/run. Let's keep it simple for now.

    // Navigate to the specified address and update UI
    await goToAddressAt(addressValue);
}

// Reset calculator - Kept for potential future use, currently calls goToAddress
function resetCalculator() {
    document.getElementById('memory-address').value = '0000';
    document.getElementById('machine-code').value = '';
    goToAddress(); // Navigate to 0000 and update UI
}

// Execute a single instruction at the current address
async function executeInstruction() {
    try {
        console.log("Executing instruction...");
        
        // Get the current address from the input field
        const addressInput = document.getElementById('memory-address');
        const currentAddress = parseInt(addressInput.value, 16);
        
        if (isNaN(currentAddress) || currentAddress < 0 || currentAddress > 0xFFFF) {
            throw new Error("Invalid memory address");
        }
        
        // Store the current PC
        const pc = currentAddress;
        console.log(`Executing instruction at address: 0x${pc.toString(16).toUpperCase()}`);
        
        // Fetch current memory state
        const memoryResponse = await fetch('/get_memory');
        const memoryData = await memoryResponse.json();
        
        // Get the opcode at this address to know what we're executing
        const opcode = memoryData.memory[pc];
        console.log(`Opcode at address ${pc.toString(16).toUpperCase()}: 0x${opcode.toString(16).toUpperCase()}`);
        
        // Make sure the PC is set correctly for instruction execution
        await fetch('/api/goto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: pc })
        });
        
        // Get memory state after PC is set (to be safe)
        const updatedMemoryResponse = await fetch('/get_memory');
        const updatedMemoryData = await updatedMemoryResponse.json();
        
        // Decode the instruction at the current address
        const instructionInfo = getInstructionInfo(opcode, updatedMemoryData.memory, pc);
        console.log(`Executing instruction: ${instructionInfo.mnemonic} ${instructionInfo.operand} (${instructionInfo.machineCode})`);
        
        // Update instruction history with the instruction that is about to be executed
        updateInstructionHistoryTable(
            pc,
            instructionInfo.mnemonic,
            instructionInfo.operand,
            instructionInfo.machineCode
        );
        
        // Call the execute_instruction endpoint
        const response = await fetch('/execute_instruction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: pc })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || "Error executing instruction");
        }
        
        // Update the UI with the new state
        console.log("Received updated state:", data);
        
        if (data.state) {
            // Update the UI
            updateUI(data.state);
            console.log("UI updated with new state");
            
            // Update memory address input to point to the next instruction
            const newPC = data.state.registers.PC;
            console.log(`New PC: ${newPC.toString(16).toUpperCase()}`);
            addressInput.value = newPC.toString(16).toUpperCase().padStart(4, '0');
            
            // Update machine code input to show the value at the new PC
            const codeInput = document.getElementById('machine-code');
            if (codeInput && data.state.memory[newPC] !== undefined) {
                codeInput.value = data.state.memory[newPC].toString(16).toUpperCase().padStart(2, '0');
            }
        } else {
            console.error("No state data received after executing instruction");
        }
        
        console.log("Instruction executed successfully");
        
    } catch (error) {
        console.error("Error executing instruction:", error);
        alert(`Error executing instruction: ${error.message}`);
    }
}

// Get instruction information based on opcode
function getInstructionInfo(opcode, memory, pc) {
    // Complete instruction set
    const instructionSet = {
        // Data Transfer Group
        0x40: { mnemonic: 'MOV B,B', operand: '', length: 1 },
        0x41: { mnemonic: 'MOV B,C', operand: '', length: 1 },
        0x42: { mnemonic: 'MOV B,D', operand: '', length: 1 },
        0x43: { mnemonic: 'MOV B,E', operand: '', length: 1 },
        0x44: { mnemonic: 'MOV B,H', operand: '', length: 1 },
        0x45: { mnemonic: 'MOV B,L', operand: '', length: 1 },
        0x46: { mnemonic: 'MOV B,M', operand: '', length: 1 },
        0x47: { mnemonic: 'MOV B,A', operand: '', length: 1 },
        0x48: { mnemonic: 'MOV C,B', operand: '', length: 1 },
        0x49: { mnemonic: 'MOV C,C', operand: '', length: 1 },
        0x4A: { mnemonic: 'MOV C,D', operand: '', length: 1 },
        0x4B: { mnemonic: 'MOV C,E', operand: '', length: 1 },
        0x4C: { mnemonic: 'MOV C,H', operand: '', length: 1 },
        0x4D: { mnemonic: 'MOV C,L', operand: '', length: 1 },
        0x4E: { mnemonic: 'MOV C,M', operand: '', length: 1 },
        0x4F: { mnemonic: 'MOV C,A', operand: '', length: 1 },
        0x50: { mnemonic: 'MOV D,B', operand: '', length: 1 },
        0x51: { mnemonic: 'MOV D,C', operand: '', length: 1 },
        0x52: { mnemonic: 'MOV D,D', operand: '', length: 1 },
        0x53: { mnemonic: 'MOV D,E', operand: '', length: 1 },
        0x54: { mnemonic: 'MOV D,H', operand: '', length: 1 },
        0x55: { mnemonic: 'MOV D,L', operand: '', length: 1 },
        0x56: { mnemonic: 'MOV D,M', operand: '', length: 1 },
        0x57: { mnemonic: 'MOV D,A', operand: '', length: 1 },
        0x58: { mnemonic: 'MOV E,B', operand: '', length: 1 },
        0x59: { mnemonic: 'MOV E,C', operand: '', length: 1 },
        0x5A: { mnemonic: 'MOV E,D', operand: '', length: 1 },
        0x5B: { mnemonic: 'MOV E,E', operand: '', length: 1 },
        0x5C: { mnemonic: 'MOV E,H', operand: '', length: 1 },
        0x5D: { mnemonic: 'MOV E,L', operand: '', length: 1 },
        0x5E: { mnemonic: 'MOV E,M', operand: '', length: 1 },
        0x5F: { mnemonic: 'MOV E,A', operand: '', length: 1 },
        0x60: { mnemonic: 'MOV H,B', operand: '', length: 1 },
        0x61: { mnemonic: 'MOV H,C', operand: '', length: 1 },
        0x62: { mnemonic: 'MOV H,D', operand: '', length: 1 },
        0x63: { mnemonic: 'MOV H,E', operand: '', length: 1 },
        0x64: { mnemonic: 'MOV H,H', operand: '', length: 1 },
        0x65: { mnemonic: 'MOV H,L', operand: '', length: 1 },
        0x66: { mnemonic: 'MOV H,M', operand: '', length: 1 },
        0x67: { mnemonic: 'MOV H,A', operand: '', length: 1 },
        0x68: { mnemonic: 'MOV L,B', operand: '', length: 1 },
        0x69: { mnemonic: 'MOV L,C', operand: '', length: 1 },
        0x6A: { mnemonic: 'MOV L,D', operand: '', length: 1 },
        0x6B: { mnemonic: 'MOV L,E', operand: '', length: 1 },
        0x6C: { mnemonic: 'MOV L,H', operand: '', length: 1 },
        0x6D: { mnemonic: 'MOV L,L', operand: '', length: 1 },
        0x6E: { mnemonic: 'MOV L,M', operand: '', length: 1 },
        0x6F: { mnemonic: 'MOV L,A', operand: '', length: 1 },
        0x70: { mnemonic: 'MOV M,B', operand: '', length: 1 },
        0x71: { mnemonic: 'MOV M,C', operand: '', length: 1 },
        0x72: { mnemonic: 'MOV M,D', operand: '', length: 1 },
        0x73: { mnemonic: 'MOV M,E', operand: '', length: 1 },
        0x74: { mnemonic: 'MOV M,H', operand: '', length: 1 },
        0x75: { mnemonic: 'MOV M,L', operand: '', length: 1 },
        0x77: { mnemonic: 'MOV M,A', operand: '', length: 1 },
        0x78: { mnemonic: 'MOV A,B', operand: '', length: 1 },
        0x79: { mnemonic: 'MOV A,C', operand: '', length: 1 },
        0x7A: { mnemonic: 'MOV A,D', operand: '', length: 1 },
        0x7B: { mnemonic: 'MOV A,E', operand: '', length: 1 },
        0x7C: { mnemonic: 'MOV A,H', operand: '', length: 1 },
        0x7D: { mnemonic: 'MOV A,L', operand: '', length: 1 },
        0x7E: { mnemonic: 'MOV A,M', operand: '', length: 1 },
        0x7F: { mnemonic: 'MOV A,A', operand: '', length: 1 },
        
        // Immediate Data Transfer
        0x06: { mnemonic: 'MVI B', operand: '', length: 2 },
        0x0E: { mnemonic: 'MVI C', operand: '', length: 2 },
        0x16: { mnemonic: 'MVI D', operand: '', length: 2 },
        0x1E: { mnemonic: 'MVI E', operand: '', length: 2 },
        0x26: { mnemonic: 'MVI H', operand: '', length: 2 },
        0x2E: { mnemonic: 'MVI L', operand: '', length: 2 },
        0x36: { mnemonic: 'MVI M', operand: '', length: 2 },
        0x3E: { mnemonic: 'MVI A', operand: '', length: 2 },
        
        // Register Pair Instructions
        0x01: { mnemonic: 'LXI B', operand: '', length: 3 },
        0x11: { mnemonic: 'LXI D', operand: '', length: 3 },
        0x21: { mnemonic: 'LXI H', operand: '', length: 3 },
        0x31: { mnemonic: 'LXI SP', operand: '', length: 3 },
        0x03: { mnemonic: 'INX B', operand: '', length: 1 },
        0x13: { mnemonic: 'INX D', operand: '', length: 1 },
        0x23: { mnemonic: 'INX H', operand: '', length: 1 },
        0x33: { mnemonic: 'INX SP', operand: '', length: 1 },
        0x0B: { mnemonic: 'DCX B', operand: '', length: 1 },
        0x1B: { mnemonic: 'DCX D', operand: '', length: 1 },
        0x2B: { mnemonic: 'DCX H', operand: '', length: 1 },
        0x3B: { mnemonic: 'DCX SP', operand: '', length: 1 },
        
        // Direct Addressing Instructions
        0x32: { mnemonic: 'STA', operand: '', length: 3 },
        0x3A: { mnemonic: 'LDA', operand: '', length: 3 },
        0x22: { mnemonic: 'SHLD', operand: '', length: 3 },
        0x2A: { mnemonic: 'LHLD', operand: '', length: 3 },
        
        // Indirect Addressing Instructions
        0x02: { mnemonic: 'STAX B', operand: '', length: 1 },
        0x12: { mnemonic: 'STAX D', operand: '', length: 1 },
        0x0A: { mnemonic: 'LDAX B', operand: '', length: 1 },
        0x1A: { mnemonic: 'LDAX D', operand: '', length: 1 },
        
        // Arithmetic Group
        0x80: { mnemonic: 'ADD B', operand: '', length: 1 },
        0x81: { mnemonic: 'ADD C', operand: '', length: 1 },
        0x82: { mnemonic: 'ADD D', operand: '', length: 1 },
        0x83: { mnemonic: 'ADD E', operand: '', length: 1 },
        0x84: { mnemonic: 'ADD H', operand: '', length: 1 },
        0x85: { mnemonic: 'ADD L', operand: '', length: 1 },
        0x86: { mnemonic: 'ADD M', operand: '', length: 1 },
        0x87: { mnemonic: 'ADD A', operand: '', length: 1 },
        0xC6: { mnemonic: 'ADI', operand: '', length: 2 },
        
        0x88: { mnemonic: 'ADC B', operand: '', length: 1 },
        0x89: { mnemonic: 'ADC C', operand: '', length: 1 },
        0x8A: { mnemonic: 'ADC D', operand: '', length: 1 },
        0x8B: { mnemonic: 'ADC E', operand: '', length: 1 },
        0x8C: { mnemonic: 'ADC H', operand: '', length: 1 },
        0x8D: { mnemonic: 'ADC L', operand: '', length: 1 },
        0x8E: { mnemonic: 'ADC M', operand: '', length: 1 },
        0x8F: { mnemonic: 'ADC A', operand: '', length: 1 },
        0xCE: { mnemonic: 'ACI', operand: '', length: 2 },
        
        0x90: { mnemonic: 'SUB B', operand: '', length: 1 },
        0x91: { mnemonic: 'SUB C', operand: '', length: 1 },
        0x92: { mnemonic: 'SUB D', operand: '', length: 1 },
        0x93: { mnemonic: 'SUB E', operand: '', length: 1 },
        0x94: { mnemonic: 'SUB H', operand: '', length: 1 },
        0x95: { mnemonic: 'SUB L', operand: '', length: 1 },
        0x96: { mnemonic: 'SUB M', operand: '', length: 1 },
        0x97: { mnemonic: 'SUB A', operand: '', length: 1 },
        0xD6: { mnemonic: 'SUI', operand: '', length: 2 },
        
        // Branch Group
        0xC3: { mnemonic: 'JMP', operand: '', length: 3 },
        0xC2: { mnemonic: 'JNZ', operand: '', length: 3 },
        0xCA: { mnemonic: 'JZ', operand: '', length: 3 },
        0xD2: { mnemonic: 'JNC', operand: '', length: 3 },
        0xDA: { mnemonic: 'JC', operand: '', length: 3 },
        0xE2: { mnemonic: 'JPO', operand: '', length: 3 },
        0xEA: { mnemonic: 'JPE', operand: '', length: 3 },
        0xF2: { mnemonic: 'JP', operand: '', length: 3 },
        0xFA: { mnemonic: 'JM', operand: '', length: 3 },
        
        // Call and Return Group
        0xCD: { mnemonic: 'CALL', operand: '', length: 3 },
        0xC4: { mnemonic: 'CNZ', operand: '', length: 3 },
        0xCC: { mnemonic: 'CZ', operand: '', length: 3 },
        0xD4: { mnemonic: 'CNC', operand: '', length: 3 },
        0xDC: { mnemonic: 'CC', operand: '', length: 3 },
        0xE4: { mnemonic: 'CPO', operand: '', length: 3 },
        0xEC: { mnemonic: 'CPE', operand: '', length: 3 },
        0xF4: { mnemonic: 'CP', operand: '', length: 3 },
        0xFC: { mnemonic: 'CM', operand: '', length: 3 },
        
        0xC9: { mnemonic: 'RET', operand: '', length: 1 },
        0xC0: { mnemonic: 'RNZ', operand: '', length: 1 },
        0xC8: { mnemonic: 'RZ', operand: '', length: 1 },
        0xD0: { mnemonic: 'RNC', operand: '', length: 1 },
        0xD8: { mnemonic: 'RC', operand: '', length: 1 },
        0xE0: { mnemonic: 'RPO', operand: '', length: 1 },
        0xE8: { mnemonic: 'RPE', operand: '', length: 1 },
        0xF0: { mnemonic: 'RP', operand: '', length: 1 },
        0xF8: { mnemonic: 'RM', operand: '', length: 1 },
        
        // Stack Operations
        0xC5: { mnemonic: 'PUSH B', operand: '', length: 1 },
        0xD5: { mnemonic: 'PUSH D', operand: '', length: 1 },
        0xE5: { mnemonic: 'PUSH H', operand: '', length: 1 },
        0xF5: { mnemonic: 'PUSH PSW', operand: '', length: 1 },
        0xC1: { mnemonic: 'POP B', operand: '', length: 1 },
        0xD1: { mnemonic: 'POP D', operand: '', length: 1 },
        0xE1: { mnemonic: 'POP H', operand: '', length: 1 },
        0xF1: { mnemonic: 'POP PSW', operand: '', length: 1 },
        
        // Special Instructions
        0x00: { mnemonic: 'NOP', operand: '', length: 1 },
        0x76: { mnemonic: 'HLT', operand: '', length: 1 },
        0xF3: { mnemonic: 'DI', operand: '', length: 1 },
        0xFB: { mnemonic: 'EI', operand: '', length: 1 },
        0x2F: { mnemonic: 'CMA', operand: '', length: 1 },
        0x3F: { mnemonic: 'CMC', operand: '', length: 1 },
        0x37: { mnemonic: 'STC', operand: '', length: 1 },
        
        // Logical Group
        0xA0: { mnemonic: 'ANA B', operand: '', length: 1 },
        0xA1: { mnemonic: 'ANA C', operand: '', length: 1 },
        0xA2: { mnemonic: 'ANA D', operand: '', length: 1 },
        0xA3: { mnemonic: 'ANA E', operand: '', length: 1 },
        0xA4: { mnemonic: 'ANA H', operand: '', length: 1 },
        0xA5: { mnemonic: 'ANA L', operand: '', length: 1 },
        0xA6: { mnemonic: 'ANA M', operand: '', length: 1 },
        0xA7: { mnemonic: 'ANA A', operand: '', length: 1 },
        0xE6: { mnemonic: 'ANI', operand: '', length: 2 },
        
        0xB0: { mnemonic: 'ORA B', operand: '', length: 1 },
        0xB1: { mnemonic: 'ORA C', operand: '', length: 1 },
        0xB2: { mnemonic: 'ORA D', operand: '', length: 1 },
        0xB3: { mnemonic: 'ORA E', operand: '', length: 1 },
        0xB4: { mnemonic: 'ORA H', operand: '', length: 1 },
        0xB5: { mnemonic: 'ORA L', operand: '', length: 1 },
        0xB6: { mnemonic: 'ORA M', operand: '', length: 1 },
        0xB7: { mnemonic: 'ORA A', operand: '', length: 1 },
        0xF6: { mnemonic: 'ORI', operand: '', length: 2 },
        
        0xA8: { mnemonic: 'XRA B', operand: '', length: 1 },
        0xA9: { mnemonic: 'XRA C', operand: '', length: 1 },
        0xAA: { mnemonic: 'XRA D', operand: '', length: 1 },
        0xAB: { mnemonic: 'XRA E', operand: '', length: 1 },
        0xAC: { mnemonic: 'XRA H', operand: '', length: 1 },
        0xAD: { mnemonic: 'XRA L', operand: '', length: 1 },
        0xAE: { mnemonic: 'XRA M', operand: '', length: 1 },
        0xAF: { mnemonic: 'XRA A', operand: '', length: 1 },
        0xEE: { mnemonic: 'XRI', operand: '', length: 2 },
        
        0xB8: { mnemonic: 'CMP B', operand: '', length: 1 },
        0xB9: { mnemonic: 'CMP C', operand: '', length: 1 },
        0xBA: { mnemonic: 'CMP D', operand: '', length: 1 },
        0xBB: { mnemonic: 'CMP E', operand: '', length: 1 },
        0xBC: { mnemonic: 'CMP H', operand: '', length: 1 },
        0xBD: { mnemonic: 'CMP L', operand: '', length: 1 },
        0xBE: { mnemonic: 'CMP M', operand: '', length: 1 },
        0xBF: { mnemonic: 'CMP A', operand: '', length: 1 },
        0xFE: { mnemonic: 'CPI', operand: '', length: 2 },
        
        // Rotate Group
        0x07: { mnemonic: 'RLC', operand: '', length: 1 },
        0x0F: { mnemonic: 'RRC', operand: '', length: 1 },
        0x17: { mnemonic: 'RAL', operand: '', length: 1 },
        0x1F: { mnemonic: 'RAR', operand: '', length: 1 },
        
        // I/O Instructions
        0xDB: { mnemonic: 'IN', operand: '', length: 2 },
        0xD3: { mnemonic: 'OUT', operand: '', length: 2 },
        
        // Interrupt Instructions
        0xF0: { mnemonic: 'SIM', operand: '', length: 1 },
        0x20: { mnemonic: 'RIM', operand: '', length: 1 }
    };
    
    // Get the instruction info
    const info = instructionSet[opcode] || { mnemonic: 'UNKNOWN', operand: '', length: 1 };
    
    // Build the machine code array for formatting
    let machineCodeArray = [opcode];
    
    // Build the operand string
    let operand = '';
    
    // Handle different instruction types
    if (info.length > 1) {
        if (info.length === 2) {
            // Instructions with one byte operand
            const value = memory[pc + 1];
            if (value !== undefined) {
                operand = value.toString(16).toUpperCase().padStart(2, '0');
                machineCodeArray.push(value);
            }
        } else if (info.length === 3) {
            // Instructions with two byte operand (stored in little-endian format)
            const lowByte = memory[pc + 1];
            const highByte = memory[pc + 2];
            
            if (lowByte !== undefined && highByte !== undefined) {
                // Calculate the address (little-endian: low byte first, then high byte)
                const address = (highByte << 8) | lowByte;
                
                // Format the operand as a 4-digit hex address
                operand = address.toString(16).toUpperCase().padStart(4, '0');
                
                // Add the bytes to the machine code array
                machineCodeArray.push(lowByte, highByte);
            }
        }
    }
    
    // Convert the machine code array to a formatted string
    const machineCodeStr = machineCodeArray.map(byte => 
        byte.toString(16).toUpperCase().padStart(2, '0')
    ).join(' ');
    
    return {
        mnemonic: info.mnemonic,
        operand: operand,
        machineCode: machineCodeStr
    };
}

// Load a sample program
function loadSampleProgram() {
    // A simple program that adds two numbers: 5 + 3 = 8
    // MVI A, 05  - Load 5 into register A
    // MVI B, 03  - Load 3 into register B
    // ADD B      - Add B to A (result in A)
    // HLT        - Stop execution
    
    const program = [
        0x3E, 0x05,  // MVI A, 05
        0x06, 0x03,  // MVI B, 03
        0x80,        // ADD B
        0x76         // HLT
    ];
    
    // Write the program to memory
    program.forEach((byte, index) => {
        writeToMemoryAt(index, byte);
    });
    
    // Reset the program counter to 0
    goToAddressAt(0);
    
    alert('Sample program loaded! This program adds 5 + 3 = 8');
}

// Helper function to write to memory at a specific address
async function writeToMemoryAt(address, value) {
    try {
        console.log(`Writing value 0x${value.toString(16).toUpperCase()} to address 0x${address.toString(16).toUpperCase()}`);
        
        // Validate inputs
        if (isNaN(address) || address < 0 || address > 0xFFFF) {
            throw new Error(`Invalid memory address: ${address}`);
        }
        
        if (isNaN(value) || value < 0 || value > 0xFF) {
            throw new Error(`Invalid memory value: ${value}`);
        }
        
        const response = await fetch('/api/write', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                address: address,
                value: value
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to write to memory');
        }
        
        const result = await response.json();
        console.log(`Successfully wrote to memory. New state:`, result);
        return result;
    } catch (error) {
        console.error('Error writing to memory:', error);
        throw error;
    }
}

// Helper function to go to a specific address
async function goToAddressAt(address) {
    try {
        console.log(`Navigating to address: 0x${address.toString(16).toUpperCase()}`);
        const response = await fetch('/api/goto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ address: address }),
        });
        
        if (!response.ok) {
            let errorMsg = `Failed to go to address ${address.toString(16).toUpperCase()}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.error || errorMsg;
            } catch (e) { /* Ignore potential JSON parsing error on failure */ }
            console.error('API Error:', response.status, errorMsg);
            throw new Error(errorMsg);
        }
        
        const state = await response.json();

        // Verify the structure of the received state
        if (!state || typeof state !== 'object' || !state.registers || !state.flags || !state.memory || !Array.isArray(state.memory)) {
            console.error("Invalid state structure received from /api/goto:", state);
            throw new Error('Invalid state received from server after goto.');
        }
        
        console.log("State received from /api/goto, updating UI. Memory length:", state.memory.length);
        updateUI(state);

        // Update the address input field AFTER successfully getting the state
        const addressInput = document.getElementById('memory-address');
        addressInput.value = address.toString(16).toUpperCase().padStart(4, '0');
        
        // Update the machine code input field with the value at the current address
        const codeInput = document.getElementById('machine-code');
        const currentMemoryValue = state.memory[address];
        if (currentMemoryValue !== undefined && currentMemoryValue !== null) {
            codeInput.value = currentMemoryValue.toString(16).toUpperCase().padStart(2, '0');
        } else {
            // If no value exists at this address, set to default 00
            codeInput.value = '00';
        }

    } catch (error) {
        console.error('Error in goToAddressAt:', error);
        alert('Error navigating to address: ' + error.message); // Show specific error
    }
}

// Add instruction to history
function addInstructionToHistory(address, mnemonic, operand, machineCode) {
    const instructionHistory = document.getElementById('instruction-history');
    if (!instructionHistory) return;
    
    const tbody = instructionHistory.querySelector('tbody');
    if (!tbody) return;
    
    const row = document.createElement('tr');
    
    // Apply theme styles to ensure row color matches dark theme
    row.style.color = 'var(--text-color)';
    row.style.backgroundColor = 'var(--table-row-bg)';
    
    // Address cell
    const addressCell = document.createElement('td');
    addressCell.textContent = address.toString(16).toUpperCase().padStart(4, '0');
    row.appendChild(addressCell);
    
    // Mnemonic cell
    const mnemonicCell = document.createElement('td');
    mnemonicCell.textContent = mnemonic || '-';
    row.appendChild(mnemonicCell);
    
    // Operand cell
    const operandCell = document.createElement('td');
    operandCell.textContent = operand || '-';
    row.appendChild(operandCell);
    
    // Machine code cell
    const machineCodeCell = document.createElement('td');
    machineCodeCell.textContent = machineCode || '-';
    row.appendChild(machineCodeCell);
    
    // Add row to the table
    tbody.appendChild(row);
    
    // Alternate row colors based on even/odd position
    const rowCount = tbody.children.length;
    if (rowCount % 2 === 0) {
        row.style.backgroundColor = 'var(--card-bg)';
    } else {
        row.style.backgroundColor = 'var(--panel-bg)';
    }
    
    // Scroll to the bottom of the instruction history
    instructionHistory.scrollTop = instructionHistory.scrollHeight;
}

function updateInstructionHistory(address, mnemonic, operand, machineCode) {
    // Format the machine code to uppercase
    const formattedMachineCode = machineCode ? machineCode.toUpperCase() : '-';
    
    // Add the instruction to the history
    addInstructionToHistory(address, mnemonic, operand, formattedMachineCode);
}

// Set up memory cell click handlers
function setupMemoryCellClickHandlers() {
    const memoryDisplay = document.getElementById('memory-display');
    if (!memoryDisplay) return;
    
    memoryDisplay.addEventListener('click', (event) => {
        const cell = event.target.closest('.memory-cell');
        if (cell) {
            const address = cell.getAttribute('data-address');
            if (address) {
                document.getElementById('memory-address').value = address;
                goToAddress();
            }
        }
    });
}

// Initialize the UI when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for buttons that exist in the HTML
    const loadProgramBtn = document.getElementById('load-program');
    if (loadProgramBtn) {
        loadProgramBtn.addEventListener('click', loadProgram);
    } else {
        console.warn("Load program button not found");
    }
    
    const stepInstructionBtn = document.getElementById('step-instruction');
    if (stepInstructionBtn) {
        stepInstructionBtn.addEventListener('click', executeInstruction);
    } else {
        console.warn("Step instruction button not found");
    }
    
    const runProgramBtn = document.getElementById('run-program');
    if (runProgramBtn) {
        runProgramBtn.addEventListener('click', runProgram);
    } else {
        console.warn("Run program button not found");
    }
    
    const resetCalculatorBtn = document.getElementById('reset-calculator');
    if (resetCalculatorBtn) {
        resetCalculatorBtn.addEventListener('click', reset);
    } else {
        console.warn("Reset calculator button not found");
    }
    
    // Clear history button
    const clearHistoryBtn = document.getElementById('clear-history');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearInstructionHistory);
    } else {
        console.warn("Clear history button not found");
    }
    
    // Initialize the simulator
    reset();
    
    // Set up memory cell click handlers
    setupMemoryCellClickHandlers();
    
    // Add keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Add focus event listeners for input fields
    const memoryAddressInput = document.getElementById('memory-address');
    if (memoryAddressInput) {
        memoryAddressInput.addEventListener('focus', () => setActiveInput('memory-address'));
    }
    
    const machineCodeInput = document.getElementById('machine-code');
    if (machineCodeInput) {
        machineCodeInput.addEventListener('focus', () => setActiveInput('machine-code'));
    }

    // Add tooltips to buttons
    const buttons = {
        'load-program': 'Ctrl + L',
        'step-instruction': 'Ctrl + S',
        'run-program': 'Ctrl + P',
        'reset-calculator': 'Ctrl + R',
        'clear-history': 'Ctrl + C',
    };

    for (const [id, shortcut] of Object.entries(buttons)) {
        const button = document.getElementById(id);
        if (button) {
            button.setAttribute('title', `Keyboard shortcut: ${shortcut}`);
        }
    }
});

// Handle keyboard navigation
function handleKeyNavigation(event) {
    // Handle Enter and Shift+Enter for navigation
    if (event.key === 'Enter') {
        event.preventDefault();
        if (event.shiftKey) {
            prevAddress();
        } else {
            nextAddress();
        }
        return;
    }

    // Only handle Ctrl combinations for other shortcuts
    if (!event.ctrlKey) return;

    // Prevent default behavior for our shortcuts
    if (['r', 's', 'l', 'c', 'h', 'g', 'p'].includes(event.key.toLowerCase())) {
        event.preventDefault();
    }

    // Reset button (Ctrl + R)
    if (event.key.toLowerCase() === 'r') {
        reset();
    }
    // Step button (Ctrl + S)
    else if (event.key.toLowerCase() === 's') {
        executeInstruction();
    }
    // Load Program button (Ctrl + L)
    else if (event.key.toLowerCase() === 'l') {
        loadProgram();
    }
    // Clear History button (Ctrl + C)
    else if (event.key.toLowerCase() === 'c') {
        clearInstructionHistory();
    }
    // Help button (Ctrl + H)
    else if (event.key.toLowerCase() === 'h') {
        window.location.href = '/help';
    }
    // Go to Address button (Ctrl + G)
    else if (event.key.toLowerCase() === 'g') {
        goToAddress();
    }
    // Run Program button (Ctrl + P)
    else if (event.key.toLowerCase() === 'p') {
        runProgram();
    }
}

// Run program from current address until HLT is encountered
async function runProgram() {
    try {
        console.log("Running program...");
        
        // First, make sure any changes in the current memory location are saved
        const addressInput = document.getElementById('memory-address');
        const codeInput = document.getElementById('machine-code');
        const startAddress = parseInt(addressInput.value, 16);
        
        // Save current machine code if needed
        const currentCode = codeInput.value.trim();
        if (currentCode) {
            const codeValue = parseInt(currentCode, 16);
            if (!isNaN(codeValue) && codeValue >= 0 && codeValue <= 0xFF) {
                await writeToMemoryAt(startAddress, codeValue);
            }
        }
        
        console.log(`Starting program execution at address: 0x${startAddress.toString(16).toUpperCase()}`);
        
        // Call the backend endpoint to run the program
        const response = await fetch('/run_from_address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: startAddress })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || "Unknown error during program execution");
        }
        
        console.log("Program execution completed, updating UI with results");
        
        // Update the UI with the final state
        updateUI(data.state);
        
        // Clear existing history
        clearInstructionHistory();
        
        // Process each instruction in the execution trace from the server
        if (data.instruction_history && Array.isArray(data.instruction_history)) {
            console.log(`Adding ${data.instruction_history.length} instructions to history`);
            
            data.instruction_history.forEach(instruction => {
                updateInstructionHistoryTable(
                    instruction.address,
                    instruction.mnemonic,
                    instruction.operand,
                    instruction.machine_code
                );
            });
        } else {
            console.warn("No instruction history received from server");
        }
        
        console.log("Program execution finished successfully");
        alert('Program execution completed!');
    } catch (error) {
        console.error('Error running program:', error);
        alert('Error running program: ' + error.message);
    }
}

// Get the length of an instruction in bytes
function getInstructionLength(opcode) {
    // Instructions with 1 byte operand (2 bytes total)
    const oneByteOperandInstructions = [
        0x06, 0x0E, 0x16, 0x1E, 0x26, 0x2E, 0x36, 0x3E, // MVI instructions
        0xC6, 0xCE, 0xD6, 0xDE, 0xE6, 0xEE, 0xF6, 0xFE, // Immediate arithmetic/logical
        0xDB, 0xD3 // IN/OUT instructions
    ];
    
    // Instructions with 2 byte operand (3 bytes total)
    const twoByteOperandInstructions = [
        0x01, 0x11, 0x21, 0x31, // LXI instructions
        0x22, 0x2A, 0x32, 0x3A, // Direct addressing
        0xC3, 0xC2, 0xCA, 0xD2, 0xDA, 0xE2, 0xEA, 0xF2, 0xFA, // JMP instructions
        0xCD, 0xC4, 0xCC, 0xD4, 0xDC, 0xE4, 0xEC, 0xF4, 0xFC // CALL instructions
    ];
    
    if (oneByteOperandInstructions.includes(opcode)) {
        return 2;
    } else if (twoByteOperandInstructions.includes(opcode)) {
        return 3;
    } else {
        return 1; // Default for most instructions
    }
}

function updateMemoryDisplay() {
    fetch('/get_memory')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const memoryDisplay = document.getElementById('memory-display');
            if (!memoryDisplay) {
                console.error('Memory display element not found');
                return;
            }
            
            memoryDisplay.innerHTML = '';
            
            // Get current address from input field
            const currentAddressInput = document.getElementById('memory-address');
            if (!currentAddressInput) {
                console.error('Memory address input not found');
                return;
            }
            
            const currentAddress = parseInt(currentAddressInput.value, 16) || 0;
            
            // Calculate the starting address for display (aligned to 16-byte boundary)
            const startAddress = Math.floor(currentAddress / 16) * 16;
            
            // Display 4 rows of 16 bytes
            for (let row = 0; row < 4; row++) {
                const rowAddress = startAddress + (row * 16);
                if (rowAddress > 0xFFFF) break;
                
                // Create row container with address label
                const rowContainer = document.createElement('div');
                rowContainer.className = 'memory-row';
                
                // Create address label
                const addressLabel = document.createElement('div');
                addressLabel.className = 'memory-address-label';
                addressLabel.textContent = rowAddress.toString(16).padStart(4, '0').toUpperCase();
                rowContainer.appendChild(addressLabel);
                
                // Create container for cells
                const cellsContainer = document.createElement('div');
                cellsContainer.className = 'memory-cells-container';
                
                // Create memory cells for this row
                for (let col = 0; col < 16; col++) {
                    const cellAddress = rowAddress + col;
                    if (cellAddress > 0xFFFF) break;
                    
                    const cell = document.createElement('div');
                    cell.className = 'memory-cell';
                    
                    // Get the value at this address
                    const value = data.memory[cellAddress] || 0;
                    cell.textContent = value.toString(16).padStart(2, '0').toUpperCase();
                    
                    // Add address as data attribute
                    cell.dataset.address = cellAddress.toString(16).padStart(4, '0').toUpperCase();
                    
                    // Highlight current address
                    if (cellAddress === currentAddress) {
                        cell.classList.add('current-address');
                    }
                    
                    // Highlight program counter
                    if (cellAddress === data.registers.PC) {
                        cell.classList.add('program-counter');
                    }
                    
                    // Add click event to navigate to this address
                    cell.addEventListener('click', () => {
                        const memoryAddressInput = document.getElementById('memory-address');
                        if (memoryAddressInput) {
                            memoryAddressInput.value = cell.dataset.address;
                            goToAddress();
                        }
                    });
                    
                    cellsContainer.appendChild(cell);
                }
                
                rowContainer.appendChild(cellsContainer);
                memoryDisplay.appendChild(rowContainer);
            }
        })
        .catch(error => {
            console.error('Error fetching memory:', error);
        });
}

// Run program from current address until HLT is encountered
async function runFromCurrentAddress() {
    try {
        // Get current address
        const addressInput = document.getElementById('memory-address');
        const startAddress = parseInt(addressInput.value, 16);
        
        // Call the backend endpoint to run the program
        const response = await fetch('/run_from_address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: startAddress })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Update the UI with the final state
        updateUI(data.state);
        
        // Add instructions to history
        const instructionHistory = document.getElementById('instruction-history');
        if (instructionHistory) {
            // Clear existing history
            instructionHistory.innerHTML = '';
            
            // Add each instruction to the history
            data.instruction_history.forEach(instruction => {
                addInstructionToHistory(
                    instruction.address,
                    instruction.mnemonic,
                    instruction.operand,
                    instruction.machine_code
                );
            });
        }
        
        alert('Program execution completed!');
    } catch (error) {
        console.error('Error running program:', error);
        alert('Error running program: ' + error.message);
    }
}

// Clear the instruction history
function clearInstructionHistory() {
    const historyTable = document.getElementById('instruction-history');
    if (historyTable) {
        const tbody = historyTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = '';
        } else {
            // Create tbody if it doesn't exist
            const newTbody = document.createElement('tbody');
            historyTable.appendChild(newTbody);
        }
    }
}

// Format a number as a hexadecimal string with specified number of digits
function formatHex(number, digits) {
    return number.toString(16).toUpperCase().padStart(digits, '0');
}

// Format machine code as a hexadecimal string
function formatMachineCode(machineCode) {
    if (!machineCode) {
        return '';
    }
    
    // If machineCode is already a string, return it as is
    if (typeof machineCode === 'string') {
        return machineCode;
    }
    
    // If machineCode is an array, format each byte
    if (Array.isArray(machineCode)) {
        return machineCode.map(byte => formatHex(byte, 2)).join(' ');
    }
    
    // If machineCode is a number, format it as a hex string
    if (typeof machineCode === 'number') {
        return formatHex(machineCode, 2);
    }
    
    return '';
}

// Update the instruction history table with a new entry
function updateInstructionHistoryTable(address, mnemonic, operand, machineCode) {
    const historyTable = document.getElementById('instruction-history');
    if (!historyTable) {
        console.error("Instruction history table not found");
        return;
    }
    
    let tbody = historyTable.querySelector('tbody');
    
    // Create tbody if it doesn't exist
    if (!tbody) {
        console.warn("Instruction history tbody not found, creating a new one");
        tbody = document.createElement('tbody');
        historyTable.appendChild(tbody);
    }
    
    // Create a new row
    const row = document.createElement('tr');
    
    // Add cells with the last executed instruction
    const addressCell = document.createElement('td');
    addressCell.textContent = formatHex(address, 4);
    row.appendChild(addressCell);

    const mnemonicCell = document.createElement('td');
    mnemonicCell.textContent = mnemonic || 'Unknown';
    row.appendChild(mnemonicCell);

    const operandCell = document.createElement('td');
    operandCell.textContent = operand || '';
    row.appendChild(operandCell);

    const machineCodeCell = document.createElement('td');
    machineCodeCell.textContent = formatMachineCode(machineCode);
    row.appendChild(machineCodeCell);

    // Add the new row at the bottom of the table
    tbody.appendChild(row);
    
    // Keep only the last 100 instructions
    while (tbody.rows.length > 100) {
        tbody.removeChild(tbody.firstChild);
    }
    
    // Update classes for all rows to ensure proper alternating colors
    for (let i = 0; i < tbody.rows.length; i++) {
        // Remove any existing row classes
        tbody.rows[i].classList.remove('instruction-row-odd', 'instruction-row-even');
        
        // Add appropriate class based on index
        if (i % 2 === 0) {
            tbody.rows[i].classList.add('instruction-row-even');
        } else {
            tbody.rows[i].classList.add('instruction-row-odd');
        }
    }
    
    // Scroll to make the latest instruction visible
    historyTable.scrollTop = historyTable.scrollHeight;
}

// Load the swap program directly into memory
async function loadSwapProgram() {
    try {
        // Swap program:
        // 2000: LDA 2500    (3A 00 25) - Load value from 2500 into A
        // 2003: MOV B,A     (47)       - Copy A to B (save first value)
        // 2004: LDA 2501    (3A 01 25) - Load value from 2501 into A
        // 2007: STA 2500    (32 00 25) - Store A into 2500 (second value to first position)
        // 200A: MOV A,B     (78)       - Copy B back to A (retrieve first value)
        // 200B: STA 2501    (32 01 25) - Store A into 2501 (first value to second position)
        // 200E: HLT         (76)       - Halt execution
        
        const program = [
            { address: 0x2000, opcode: 0x3A }, // LDA 2500
            { address: 0x2001, opcode: 0x00 },
            { address: 0x2002, opcode: 0x25 },
            { address: 0x2003, opcode: 0x47 }, // MOV B,A
            { address: 0x2004, opcode: 0x3A }, // LDA 2501
            { address: 0x2005, opcode: 0x01 },
            { address: 0x2006, opcode: 0x25 },
            { address: 0x2007, opcode: 0x32 }, // STA 2500
            { address: 0x2008, opcode: 0x00 },
            { address: 0x2009, opcode: 0x25 },
            { address: 0x200A, opcode: 0x78 }, // MOV A,B
            { address: 0x200B, opcode: 0x32 }, // STA 2501
            { address: 0x200C, opcode: 0x01 },
            { address: 0x200D, opcode: 0x25 },
            { address: 0x200E, opcode: 0x76 }  // HLT
        ];
        
        // Initialize sample data at memory addresses
        const data = [
            { address: 0x2500, value: 0x55 }, // First value to swap
            { address: 0x2501, value: 0xAA }  // Second value to swap
        ];
        
        // Write program bytes to memory
        for (const instruction of program) {
            await writeToMemoryAt(instruction.address, instruction.opcode);
        }
        
        // Write sample data
        for (const item of data) {
            await writeToMemoryAt(item.address, item.value);
        }
        
        // Set program counter to start address
        const addressInput = document.getElementById('memory-address');
        addressInput.value = '2000';
        
        // Clear instruction history
        clearInstructionHistory();
        
        // Update memory display
        await updateMemoryDisplay();
        
        alert('Swap program loaded successfully!');
    } catch (error) {
        console.error('Error loading swap program:', error);
        alert('Error loading program: ' + error.message);
    }
} 