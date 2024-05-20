const fs = require('fs');
const path = require('path');

class UniqueInt {
    constructor() {
        // Array to track seen integers in the range -1023 to 1023
        this.seen = new Array(2047).fill(false);  
        // Custom implementation to store unique numbers
        this.uniqueNumbers = [];  
    }

    /**
     * Process the input file to find unique integers and write them to the output file.
     * @param {string} inputFilePath - Path to the input file.
     * @param {string} outputFilePath - Path to the output file.
     */
    processFile(inputFilePath, outputFilePath) {
        this.seen.fill(false);  // Reset for each file
        this.uniqueNumbers = [];  // Reset unique numbers array

        const lines = this.readLines(inputFilePath);

        for (const line of lines) {
            const number = this.readNextItemFromFile(line);
            if (number !== null) {
                const index = number + 1023;  // Shift range -1023 to 1023 to 0 to 2046
                if (!this.seen[index]) {
                    this.seen[index] = true;
                    this.insertUniqueNumber(number);
                }
            }
        }

        this.writeOutput(outputFilePath);
    }

    /**
     * Read lines from a file.
     * @param {string} filePath - Path to the file.
     * @returns {string[]} - Array of lines.
     */
    readLines(filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return fileContent.split('\n');
    }

    /**
     * Parse a line to extract a valid integer.
     * @param {string} line - Line from the input file.
     * @returns {number|null} - Parsed integer or null if invalid.
     */
    readNextItemFromFile(line) {
        line = line.trim();
        if (line === '') return null;
        const parts = line.split(/\s+/);
        if (parts.length !== 1) return null;
        const number = parseInt(parts[0], 10);
        if (isNaN(number) || number < -1023 || number > 1023) return null;
        return number;
    }

    /**
     * Insert a number into the sorted array of unique numbers.
     * @param {number} number - The number to insert.
     */
    insertUniqueNumber(number) {
        let inserted = false;
        for (let i = 0; i < this.uniqueNumbers.length; i++) {
            if (number < this.uniqueNumbers[i]) {
                this.uniqueNumbers.splice(i, 0, number);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            this.uniqueNumbers.push(number);
        }
    }

    /**
     * Write the sorted unique numbers to the output file.
     * @param {string} outputFilePath - Path to the output file.
     */
    writeOutput(outputFilePath) {
        let output = '';
        for (const number of this.uniqueNumbers) {
            output += `${number}\n`;
        }
        fs.writeFileSync(outputFilePath, output, 'utf-8');
    }
}

// Running the script
const inputDir = '/dsa/hw01/sample_inputs/';
const outputDir = '/dsa/hw01/sample_results/';

const uniqueIntProcessor = new UniqueInt();

// Measure memory usage and runtime
const startTime = process.hrtime.bigint();
const initialMemoryUsage = process.memoryUsage().heapUsed;

fs.readdirSync(inputDir).forEach(inputFilename => {
    if (inputFilename.endsWith('.txt')) {
        const inputFilePath = path.join(inputDir, inputFilename);
        const outputFileName = `${inputFilename}_results.txt`;
        const outputFilePath = path.join(outputDir, outputFileName);
        uniqueIntProcessor.processFile(inputFilePath, outputFilePath);
    }
});

const endTime = process.hrtime.bigint();
const finalMemoryUsage = process.memoryUsage().heapUsed;

const memoryUsed = finalMemoryUsage - initialMemoryUsage;
const timeTaken = (endTime - startTime) / BigInt(1e6);  // Convert nanoseconds to milliseconds

console.log(`Memory used: ${memoryUsed} bytes`);
console.log(`Time taken: ${timeTaken} milliseconds`);
