export const part1 = (input: string) => {
    const lines = input.trim().split('\n');
    const grid = lines.map(line => line.split(''));
    const rows = grid.length;
    const cols = grid[0].length;

    // Eight directions: up, down, left, right, and four diagonals
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    let accessibleCount = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] === '@') {
                // Count adjacent @ symbols
                let adjacentCount = 0;

                for (const [dr, dc] of directions) {
                    const newRow = row + dr;
                    const newCol = col + dc;

                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                        if (grid[newRow][newCol] === '@') {
                            adjacentCount++;
                        }
                    }
                }

                // Accessible if fewer than 4 adjacent @
                if (adjacentCount < 4) {
                    accessibleCount++;
                }
            }
        }
    }

    return accessibleCount;
};

export const part2 = (input: string) => {
    const lines = input.trim().split('\n');
    const grid = lines.map(line => line.split(''));
    const rows = grid.length;
    const cols = grid[0].length;

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    function countAdjacent(row: number, col: number): number {
        let count = 0;
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                if (grid[newRow][newCol] === '@') {
                    count++;
                }
            }
        }
        return count;
    }

    let totalRemoved = 0;
    let changed = true;

    while (changed) {
        changed = false;
        const toRemove: [number, number][] = [];

        // Find all accessible rolls in this iteration
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (grid[row][col] === '@') {
                    if (countAdjacent(row, col) < 4) {
                        toRemove.push([row, col]);
                    }
                }
            }
        }

        // Remove them all at once
        if (toRemove.length > 0) {
            changed = true;
            totalRemoved += toRemove.length;
            for (const [row, col] of toRemove) {
                grid[row][col] = '.';
            }
        }
    }

    return totalRemoved;
};