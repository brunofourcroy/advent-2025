type Point = [number, number];
type Shape = Point[];

function parseInput(input: string): { shapes: Map<number, Shape>, regions: Array<{ width: number, height: number, counts: number[] }> } {
    const lines = input.trim().split('\n');
    const shapes = new Map<number, Shape>();
    const regions: Array<{ width: number, height: number, counts: number[] }> = [];

    let i = 0;
    // Parse shapes
    while (i < lines.length) {
        const line = lines[i].trim();
        if (line === '') {
            i++;
            continue;
        }

        const match = line.match(/^(\d+):$/);
        if (match) {
            const index = parseInt(match[1]);
            const shapeLines: string[] = [];
            i++;

            while (i < lines.length && lines[i].trim() !== '' && !lines[i].match(/^\d+:/)) {
                shapeLines.push(lines[i]);
                i++;
            }

            const points: Point[] = [];
            for (let r = 0; r < shapeLines.length; r++) {
                for (let c = 0; c < shapeLines[r].length; c++) {
                    if (shapeLines[r][c] === '#') {
                        points.push([r, c]);
                    }
                }
            }
            shapes.set(index, normalizeShape(points));
        } else if (line.match(/^\d+x\d+:/)) {
            // Parse region
            const [dims, countsStr] = line.split(': ');
            const [width, height] = dims.split('x').map(Number);
            const counts = countsStr.split(' ').map(Number);
            regions.push({ width, height, counts });
            i++;
        } else {
            i++;
        }
    }

    return { shapes, regions };
}

function normalizeShape(shape: Shape): Shape {
    if (shape.length === 0) return [];
    const minR = Math.min(...shape.map(p => p[0]));
    const minC = Math.min(...shape.map(p => p[1]));
    return shape.map(([r, c]) => [r - minR, c - minC]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function rotateShape(shape: Shape): Shape {
    return normalizeShape(shape.map(([r, c]) => [c, -r]));
}

function flipHorizontal(shape: Shape): Shape {
    return normalizeShape(shape.map(([r, c]) => [r, -c]));
}

function getAllOrientations(shape: Shape): Shape[] {
    const orientations = new Set<string>();
    const result: Shape[] = [];

    let current = normalizeShape(shape);
    for (let i = 0; i < 4; i++) {
        const key = JSON.stringify(current);
        if (!orientations.has(key)) {
            orientations.add(key);
            result.push(current);
        }
        current = rotateShape(current);
    }

    current = flipHorizontal(normalizeShape(shape));
    for (let i = 0; i < 4; i++) {
        const key = JSON.stringify(current);
        if (!orientations.has(key)) {
            orientations.add(key);
            result.push(current);
        }
        current = rotateShape(current);
    }

    return result;
}

function canPlace(grid: boolean[][], shape: Shape, r: number, c: number, width: number, height: number): boolean {
    for (const [dr, dc] of shape) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= height || nc < 0 || nc >= width) return false;
        if (grid[nr][nc]) return false;
    }
    return true;
}

function place(grid: boolean[][], shape: Shape, r: number, c: number): void {
    for (const [dr, dc] of shape) {
        grid[r + dr][c + dc] = true;
    }
}

function unplace(grid: boolean[][], shape: Shape, r: number, c: number): void {
    for (const [dr, dc] of shape) {
        grid[r + dr][c + dc] = false;
    }
}

function canFitPresents(width: number, height: number, presentsToPlace: Shape[][]): boolean {
    if (presentsToPlace.length === 0) return true;

    const grid: boolean[][] = Array(height).fill(0).map(() => Array(width).fill(false));
    const totalPresentCells = presentsToPlace.reduce((sum, orientations) => sum + orientations[0].length, 0);

    // Early termination: if presents need more cells than grid has, impossible
    if (totalPresentCells > width * height) return false;

    let attempts = 0;
    const MAX_ATTEMPTS = 10000000;

    function backtrack(idx: number): boolean {
        if (++attempts > MAX_ATTEMPTS) return false;
        if (idx === presentsToPlace.length) return true;

        const orientations = presentsToPlace[idx];

        // Optimization: try to place in the top-left area first
        for (const orientation of orientations) {
            for (let r = 0; r < height; r++) {
                for (let c = 0; c < width; c++) {
                    if (canPlace(grid, orientation, r, c, width, height)) {
                        place(grid, orientation, r, c);
                        if (backtrack(idx + 1)) return true;
                        unplace(grid, orientation, r, c);
                    }
                }
            }
        }

        return false;
    }

    return backtrack(0);
}

export const part1 = (input: string) => {
    const { shapes, regions } = parseInput(input);

    let count = 0;
    for (let regionIdx = 0; regionIdx < regions.length; regionIdx++) {
        const region = regions[regionIdx];
        const presentsToPlace: Shape[][] = [];

        for (let shapeIdx = 0; shapeIdx < region.counts.length; shapeIdx++) {
            const qty = region.counts[shapeIdx];
            const shape = shapes.get(shapeIdx);
            if (!shape) continue;

            const orientations = getAllOrientations(shape);
            for (let i = 0; i < qty; i++) {
                presentsToPlace.push(orientations);
            }
        }

        // Sort by size (larger first) to improve pruning
        presentsToPlace.sort((a, b) => b[0].length - a[0].length);

        if (canFitPresents(region.width, region.height, presentsToPlace)) {
            count++;
        }
    }

    return count;
};

export const part2 = (input: string) => {
    const lines = input.trim().split('\n');

    // TODO: Implement part 2
    return 0;
};
