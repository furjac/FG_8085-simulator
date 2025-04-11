# FG-8085 Simulator Toolkit

![FG-8085 Simulator](https://img.shields.io/badge/FG--8085-Simulator-blue)
![Python](https://img.shields.io/badge/Python-3.8%2B-green)
![Flask](https://img.shields.io/badge/Flask-2.0%2B-lightgrey)

A comprehensive web-based simulator for the Intel 8085 microprocessor, designed for educational purposes and assembly language programming practice.

## 🌟 Features

- **Complete 8085 Instruction Set**: Support for all 8085 microprocessor instructions
- **Real-time Register & Flag Monitoring**: Watch register values and flags change as instructions execute
- **Memory Editor**: Write and modify machine code directly in memory
- **Step-by-Step Execution**: Execute instructions one at a time to understand program flow
- **Program Loading**: Load programs in hexadecimal format
- **Interactive Interface**: User-friendly design with intuitive controls

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Flask web framework
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/8085-simulator.git
   cd 8085-simulator
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the application:
   ```
   python app.py
   ```

4. Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```

## 💻 Usage

### Loading a Program

There are two ways to load a program into the simulator:

1. **Using the Program Input**: Enter hexadecimal bytes separated by spaces in the "Enter Program" field and click "Load Program".
2. **Using the Memory Editor**: Navigate to the desired memory address, enter the machine code, and click "Execute" to write it to memory.

### Executing Instructions

After loading your program, you can execute it in several ways:

- **Step**: Execute one instruction at a time to observe the changes in registers and flags.
- **Run Program**: Execute the program continuously until it halts or encounters an error.
- **Execute**: Execute the instruction at the current memory address.

### Monitoring the State

The simulator provides real-time information about:

- **Registers**: View the contents of all 8085 registers (A, B, C, D, E, H, L, PC, SP).
- **Flags**: Monitor the status of all flags (S, Z, AC, P, CY).
- **Memory**: Examine the contents of memory at any address.

### Resetting the Simulator

Click the "Reset" button to clear all registers, flags, and memory, returning the simulator to its initial state.

## ⌨️ Shortcut Keys

| Shortcut | Action |
|----------|--------|
| ENTER | Next memory adress |
| Shift + ENTER | Prevoious address |

## 📚 8085 Instruction Set

The simulator supports the complete 8085 instruction set, including:

- **Data Transfer Group**: MOV, MVI, LXI, LDA, STA, etc.
- **Arithmetic Group**: ADD, SUB, INR, DCR, DAD, etc.
- **Logical Group**: ANA, ORA, XRA, CMP, RLC, RRC, etc.
- **Branch Group**: JMP, JNZ, JZ, CALL, RET, etc.
- **Stack, I/O, and Machine Control Group**: PUSH, POP, IN, OUT, EI, DI, etc.

For a complete list of instructions and their opcodes, visit the [Help Page](http://localhost:5000/help).

## 🧩 Example Programs

### Simple Addition Program

```
3E 05    ; MVI A, 05H  (Load 05H into accumulator)
06 03    ; MVI B, 03H  (Load 03H into register B)
80       ; ADD B       (Add B to A)
76       ; HLT         (Halt)
```

### Memory Transfer Program

```
21 00 20 ; LXI H, 2000H (Load 2000H into H-L pair)
3E 42    ; MVI A, 42H   (Load 42H into accumulator)
77       ; MOV M, A     (Move A to memory location pointed by H-L)
76       ; HLT          (Halt)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Intel Corporation for the 8085 microprocessor architecture
- The open-source community for various tools and libraries
- All contributors who have helped improve this simulator

## 📧 Contact

For questions or suggestions, please open an issue in the GitHub repository or contact the me.

---

Made with ❤️ for microprocessor enthusiasts and students 
