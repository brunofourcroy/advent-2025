export const part1 = (input: string) => {
    const parts = input.trim().split('\n\n');
    const rangeLines = parts[0].split('\n');
    const idLines = parts[1].split('\n');

    // Parse the fresh ID ranges
    const ranges: Array<[number, number]> = [];
    for (const line of rangeLines) {
        const [start, end] = line.split('-').map(Number);
        ranges.push([start, end]);
    }

    // Parse the available ingredient IDs
    const ids = idLines.map(Number);

    // Count how many IDs are fresh (fall within any range)
    let freshCount = 0;
    for (const id of ids) {
        let isFresh = false;
        for (const [start, end] of ranges) {
            if (id >= start && id <= end) {
                isFresh = true;
                break;
            }
        }
        if (isFresh) {
            freshCount++;
        }
    }

    return freshCount;
};

export const part2 = (input: string) => {
    const parts = input.trim().split('\n\n');
    const rangeLines = parts[0].split('\n');

    // Parse the fresh ID ranges
    const ranges: Array<[number, number]> = [];
    for (const line of rangeLines) {
        const [start, end] = line.split('-').map(Number);
        ranges.push([start, end]);
    }

    // Merge overlapping ranges to avoid double-counting
    // Sort ranges by start position
    ranges.sort((a, b) => a[0] - b[0]);

    const merged: Array<[number, number]> = [];
    for (const [start, end] of ranges) {
        if (merged.length === 0 || merged[merged.length - 1][1] < start - 1) {
            // No overlap, add new range
            merged.push([start, end]);
        } else {
            // Overlap or adjacent, merge with previous range
            merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], end);
        }
    }

    // Count all IDs in merged ranges
    let totalFreshIds = 0;
    for (const [start, end] of merged) {
        totalFreshIds += end - start + 1;
    }

    return totalFreshIds;
};