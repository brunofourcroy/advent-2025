export const part1 = (input: string) => {
    const lines = input.trim().split('\n');
    const grid = lines.map(line => line.split(''));
    const rows = grid.length;
    const cols = grid[0].length;

    // Find starting position
    let startCol = -1;
    for (let c = 0; c < cols; c++) {
        if (grid[0][c] === 'S') {
            startCol = c;
            break;
        }
    }

    // Track active beams: [row, col]
    let beams: Array<[number, number]> = [[0, startCol]];
    const visited = new Set<string>();
    let splitCount = 0;

    // Simulate beams moving downward
    while (beams.length > 0) {
        const newBeams: Array<[number, number]> = [];

        for (const [row, col] of beams) {
            // Move beam down one row
            const nextRow = row + 1;

            // Check if beam exits the manifold
            if (nextRow >= rows) {
                continue;
            }

            const key = `${nextRow},${col}`;

            // Check what's at the next position
            if (grid[nextRow][col] === '^') {
                // Only count this split if we haven't processed this position before
                if (!visited.has(key)) {
                    visited.add(key);
                    splitCount++;

                    // Add left beam if within bounds
                    if (col - 1 >= 0) {
                        newBeams.push([nextRow, col - 1]);
                    }

                    // Add right beam if within bounds
                    if (col + 1 < cols) {
                        newBeams.push([nextRow, col + 1]);
                    }
                }
            } else {
                // Empty space - beam continues downward
                if (!visited.has(key)) {
                    visited.add(key);
                    newBeams.push([nextRow, col]);
                }
            }
        }

        beams = newBeams;
    }

    return splitCount;
};

export const part2 = (input: string) => {
    const lines = input.trim().split('\n');
    const grid = lines.map(line => line.split(''));
    const rows = grid.length;
    const cols = grid[0].length;

    // Find starting position
    let startCol = -1;
    for (let c = 0; c < cols; c++) {
        if (grid[0][c] === 'S') {
            startCol = c;
            break;
        }
    }

    // Use DP to count number of paths to each position
    // paths[col] = number of distinct timelines at this column
    let paths = new Map<number, number>();
    paths.set(startCol, 1);
    let totalTimelines = 0;

    for (let row = 0; row < rows; row++) {
        const nextPaths = new Map<number, number>();

        for (const [col, count] of paths) {
            // Move down one row
            const nextRow = row + 1;

            // Check if particle exits the manifold
            if (nextRow >= rows) {
                // Count these as completed timelines
                totalTimelines += count;
                continue;
            }

            // Check what's at the next position
            if (grid[nextRow][col] === '^') {
                // Particle splits - goes both left and right
                if (col - 1 >= 0) {
                    nextPaths.set(col - 1, (nextPaths.get(col - 1) || 0) + count);
                }
                if (col + 1 < cols) {
                    nextPaths.set(col + 1, (nextPaths.get(col + 1) || 0) + count);
                }
            } else {
                // Empty space - particle continues downward
                nextPaths.set(col, (nextPaths.get(col) || 0) + count);
            }
        }

        paths = nextPaths;
    }

    // Add any remaining paths
    for (const count of paths.values()) {
        totalTimelines += count;
    }

    return totalTimelines;
};