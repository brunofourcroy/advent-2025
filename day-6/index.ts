export const part1 = (input: string) => {
    const lines = input.trimEnd().split('\n');
    const numRows = lines.length;

    // Find the width by looking at the longest line
    const width = Math.max(...lines.map(line => line.length));

    // Parse problems column by column
    const problems: Array<{numbers: number[], operator: string}> = [];

    let col = 0;
    while (col < width) {
        // Check if this column starts a problem (has non-space content)
        let hasContent = false;
        for (let row = 0; row < numRows; row++) {
            if (col < lines[row].length && lines[row][col] !== ' ') {
                hasContent = true;
                break;
            }
        }

        if (!hasContent) {
            col++;
            continue;
        }

        // Find the extent of this problem (columns with content)
        let endCol = col;
        while (endCol < width) {
            let hasAnyContent = false;
            for (let row = 0; row < numRows; row++) {
                if (endCol < lines[row].length && lines[row][endCol] !== ' ') {
                    hasAnyContent = true;
                    break;
                }
            }
            if (!hasAnyContent) {
                break;
            }
            endCol++;
        }

        // Extract numbers and operator from this problem
        const numbers: number[] = [];
        let operator = '';

        for (let row = 0; row < numRows; row++) {
            const segment = lines[row].substring(col, endCol).trim();
            if (segment.length > 0) {
                if (segment === '+' || segment === '*') {
                    operator = segment;
                } else {
                    const num = parseInt(segment);
                    if (!isNaN(num)) {
                        numbers.push(num);
                    }
                }
            }
        }

        if (numbers.length > 0 && operator) {
            problems.push({numbers, operator});
        }

        col = endCol;
    }

    // Calculate results and sum them
    let grandTotal = 0;
    for (const problem of problems) {
        let result = problem.numbers[0];
        for (let i = 1; i < problem.numbers.length; i++) {
            if (problem.operator === '+') {
                result += problem.numbers[i];
            } else if (problem.operator === '*') {
                result *= problem.numbers[i];
            }
        }
        grandTotal += result;
    }

    return grandTotal;
};

export const part2 = (input: string) => {
    const lines = input.trimEnd().split('\n');
    const numRows = lines.length;

    // Find the width by looking at the longest line
    const width = Math.max(...lines.map(line => line.length));

    // Parse problems column by column
    const problems: Array<{numbers: number[], operator: string}> = [];

    let col = 0;
    while (col < width) {
        // Check if this column starts a problem (has non-space content)
        let hasContent = false;
        for (let row = 0; row < numRows; row++) {
            if (col < lines[row].length && lines[row][col] !== ' ') {
                hasContent = true;
                break;
            }
        }

        if (!hasContent) {
            col++;
            continue;
        }

        // Find the extent of this problem (columns with content)
        let endCol = col;
        while (endCol < width) {
            let hasAnyContent = false;
            for (let row = 0; row < numRows; row++) {
                if (endCol < lines[row].length && lines[row][endCol] !== ' ') {
                    hasAnyContent = true;
                    break;
                }
            }
            if (!hasAnyContent) {
                break;
            }
            endCol++;
        }

        // Extract operator
        let operator = '';
        let operatorRow = -1;
        for (let row = 0; row < numRows; row++) {
            const segment = lines[row].substring(col, endCol).trim();
            if (segment === '+' || segment === '*') {
                operator = segment;
                operatorRow = row;
                break;
            }
        }

        // Build numbers by reading columns right-to-left
        // Each COLUMN forms a complete number by reading top-to-bottom
        const numbers: number[] = [];

        // Read columns from right to left
        for (let c = endCol - 1; c >= col; c--) {
            let numberStr = '';
            for (let row = 0; row < numRows; row++) {
                if (row === operatorRow) {
                    continue;
                }

                if (c < lines[row].length) {
                    const char = lines[row][c];
                    if (char !== ' ') {
                        numberStr += char;
                    }
                }
            }

            if (numberStr.length > 0) {
                const num = parseInt(numberStr);
                if (!isNaN(num)) {
                    numbers.push(num);
                }
            }
        }

        if (numbers.length > 0 && operator) {
            problems.push({numbers, operator});
        }

        col = endCol;
    }

    // Calculate results and sum them
    let grandTotal = 0;
    for (const problem of problems) {
        let result = problem.numbers[0];
        for (let i = 1; i < problem.numbers.length; i++) {
            if (problem.operator === '+') {
                result += problem.numbers[i];
            } else if (problem.operator === '*') {
                result *= problem.numbers[i];
            }
        }
        grandTotal += result;
    }

    return grandTotal;
};