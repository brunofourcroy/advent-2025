export const part1 = (input: string) => {
    const lines = input.trim().split('\n');
    let totalPresses = 0;

    for (const line of lines) {
        // Parse the line
        const targetMatch = line.match(/\[([.#]+)\]/);
        const buttonsMatch = line.matchAll(/\(([0-9,]+)\)/g);

        if (!targetMatch) {
            continue;
        }

        const target = targetMatch[1];
        const numLights = target.length;

        // Parse target state (# = 1, . = 0)
        const targetState: number[] = [];
        for (let i = 0; i < target.length; i++) {
            targetState.push(target[i] === '#' ? 1 : 0);
        }

        // Parse buttons
        const buttons: number[][] = [];
        for (const match of buttonsMatch) {
            const indices = match[1].split(',').map(Number);
            const button = Array(numLights).fill(0);
            for (const idx of indices) {
                button[idx] = 1;
            }
            buttons.push(button);
        }

        // Solve using Gaussian elimination in GF(2)
        const minPresses = solveLightsGF2(targetState, buttons);
        totalPresses += minPresses;
    }

    return totalPresses;
};

function solveLightsGF2(target: number[], buttons: number[][]): number {
    const numLights = target.length;
    const numButtons = buttons.length;

    // Try all possible combinations (brute force for small cases)
    // Since we want minimum presses, use BFS-like approach
    let minPresses = Infinity;

    // Use bit manipulation to try all combinations
    const maxCombinations = 1 << numButtons;

    for (let mask = 0; mask < maxCombinations; mask++) {
        // Calculate resulting state
        const state = Array(numLights).fill(0);
        let presses = 0;

        for (let b = 0; b < numButtons; b++) {
            if (mask & (1 << b)) {
                presses++;
                for (let i = 0; i < numLights; i++) {
                    state[i] ^= buttons[b][i];
                }
            }
        }

        // Check if this matches target
        let matches = true;
        for (let i = 0; i < numLights; i++) {
            if (state[i] !== target[i]) {
                matches = false;
                break;
            }
        }

        if (matches) {
            minPresses = Math.min(minPresses, presses);
        }
    }

    return minPresses === Infinity ? 0 : minPresses;
}

export const part2 = (input: string) => {
    const lines = input.trim().split('\n');
    let totalPresses = 0;

    for (const line of lines) {
        // Parse the line
        const joltageMatch = line.match(/\{([0-9,]+)\}/);
        const buttonsMatch = line.matchAll(/\(([0-9,]+)\)/g);

        if (!joltageMatch) {
            continue;
        }

        // Parse target joltage requirements
        const targetJoltages = joltageMatch[1].split(',').map(Number);
        const numCounters = targetJoltages.length;

        // Parse buttons
        const buttons: number[][] = [];
        for (const match of buttonsMatch) {
            const indices = match[1].split(',').map(Number);
            const button = Array(numCounters).fill(0);
            for (const idx of indices) {
                button[idx] = 1;
            }
            buttons.push(button);
        }

        // Solve for minimum button presses
        const minPresses = solveJoltage(targetJoltages, buttons);
        totalPresses += minPresses;
    }

    return totalPresses;
};

function solveJoltage(target: number[], buttons: number[][]): number {
    const m = target.length;
    const n = buttons.length;

    // Gaussian elimination to find pivot/free variables
    const A: number[][] = [];
    for (let i = 0; i < m; i++) {
        A[i] = [];
        for (let j = 0; j < n; j++) {
            A[i][j] = buttons[j][i];
        }
    }
    const b = [...target];

    const pivotCols: number[] = [];
    const freeCols: Set<number> = new Set();
    for (let i = 0; i < n; i++) freeCols.add(i);

    let row = 0;
    for (let col = 0; col < n && row < m; col++) {
        let pivotRow = -1;
        for (let r = row; r < m; r++) {
            if (A[r][col] !== 0) {
                pivotRow = r;
                break;
            }
        }

        if (pivotRow === -1) continue;

        [A[row], A[pivotRow]] = [A[pivotRow], A[row]];
        [b[row], b[pivotRow]] = [b[pivotRow], b[row]];

        pivotCols.push(col);
        freeCols.delete(col);

        for (let r = row + 1; r < m; r++) {
            if (A[r][col] !== 0) {
                const factor = A[r][col] / A[row][col];
                for (let c = col; c < n; c++) {
                    A[r][c] -= factor * A[row][c];
                }
                b[r] -= factor * b[row];
            }
        }
        row++;
    }

    const freeVars = Array.from(freeCols);
    // Conservative bound on free variables
    const maxVal = Math.max(...target) * 2;
    let minPresses = Infinity;

    const assignment = Array(n).fill(0);

    const search = (freeIdx: number) => {
        if (freeIdx === freeVars.length) {
            const x = [...assignment];

            for (let r = pivotCols.length - 1; r >= 0; r--) {
                const col = pivotCols[r];
                let sum = b[r];

                for (let c = col + 1; c < n; c++) {
                    sum -= A[r][c] * x[c];
                }

                if (Math.abs(A[r][col]) < 0.001) continue;
                const val = sum / A[r][col];

                if (val < -0.001 || Math.abs(val - Math.round(val)) > 0.001) {
                    return;
                }

                x[col] = Math.round(val);
            }

            const totalPresses = x.reduce((sum, v) => sum + v, 0);
            minPresses = Math.min(minPresses, totalPresses);
            return;
        }

        const freeCol = freeVars[freeIdx];
        for (let val = 0; val <= maxVal; val++) {
            assignment[freeCol] = val;
            search(freeIdx + 1);
        }

        assignment[freeCol] = 0;
    };

    search(0);
    return minPresses === Infinity ? 0 : minPresses;
}
