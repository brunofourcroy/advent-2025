export const part1 = (input: string) => {
    const lines = input.trim().split('\n');
    const redTiles: Array<[number, number]> = [];

    // Parse red tile positions
    for (const line of lines) {
        const [x, y] = line.split(',').map(Number);
        redTiles.push([x, y]);
    }

    let maxArea = 0;

    // Check all pairs of red tiles as opposite corners
    for (let i = 0; i < redTiles.length; i++) {
        for (let j = i + 1; j < redTiles.length; j++) {
            const [x1, y1] = redTiles[i];
            const [x2, y2] = redTiles[j];

            // Calculate rectangle area (inclusive of both corners)
            const width = Math.abs(x2 - x1) + 1;
            const height = Math.abs(y2 - y1) + 1;
            const area = width * height;

            maxArea = Math.max(maxArea, area);
        }
    }

    return maxArea;
};

export const part2 = (input: string) => {
    const lines = input.trim().split('\n');
    const redTiles: Array<[number, number]> = [];

    // Parse red tile positions
    for (const line of lines) {
        const [x, y] = line.split(',').map(Number);
        redTiles.push([x, y]);
    }

    // Helper function: check if point is inside polygon using ray casting
    const isInside = (px: number, py: number): boolean => {
        let intersections = 0;
        for (let i = 0; i < redTiles.length; i++) {
            const [x1, y1] = redTiles[i];
            const [x2, y2] = redTiles[(i + 1) % redTiles.length];

            // Check if horizontal ray from (px, py) going right crosses edge (x1,y1)-(x2,y2)
            if ((y1 <= py && py < y2) || (y2 <= py && py < y1)) {
                const xIntersect = x1 + ((py - y1) / (y2 - y1)) * (x2 - x1);
                if (px < xIntersect) {
                    intersections++;
                }
            }
        }
        return intersections % 2 === 1;
    };

    // Helper function: check if point is on the polygon perimeter
    const isOnPerimeter = (px: number, py: number): boolean => {
        for (let i = 0; i < redTiles.length; i++) {
            const [x1, y1] = redTiles[i];
            const [x2, y2] = redTiles[(i + 1) % redTiles.length];

            // Check if point is on this edge
            if (x1 === x2 && px === x1) {
                // Vertical edge
                if (py >= Math.min(y1, y2) && py <= Math.max(y1, y2)) {
                    return true;
                }
            } else if (y1 === y2 && py === y1) {
                // Horizontal edge
                if (px >= Math.min(x1, x2) && px <= Math.max(x1, x2)) {
                    return true;
                }
            }
        }
        return false;
    };

    // Helper function: check if rectangle is valid (all points are inside or on perimeter)
    const isRectangleValid = (minX: number, minY: number, maxX: number, maxY: number): boolean => {
        // Check if all four corners of the rectangle are inside or on the perimeter
        const corners = [
            [minX, minY],
            [minX, maxY],
            [maxX, minY],
            [maxX, maxY]
        ];

        for (const [x, y] of corners) {
            if (!isOnPerimeter(x, y) && !isInside(x, y)) {
                return false;
            }
        }

        // For axis-aligned rectangles with axis-aligned polygons, we need to check
        // the edges of the rectangle more carefully
        const width = maxX - minX + 1;
        const height = maxY - minY + 1;

        // Sample at regular intervals along each edge of the rectangle
        const samples = Math.min(100, Math.max(width, height));

        // Check top and bottom edges
        for (let i = 0; i <= samples; i++) {
            const t = i / samples;
            const x = Math.floor(minX + t * (maxX - minX));

            if (!isOnPerimeter(x, minY) && !isInside(x, minY)) {
                return false;
            }
            if (!isOnPerimeter(x, maxY) && !isInside(x, maxY)) {
                return false;
            }
        }

        // Check left and right edges
        for (let i = 0; i <= samples; i++) {
            const t = i / samples;
            const y = Math.floor(minY + t * (maxY - minY));

            if (!isOnPerimeter(minX, y) && !isInside(minX, y)) {
                return false;
            }
            if (!isOnPerimeter(maxX, y) && !isInside(maxX, y)) {
                return false;
            }
        }

        // Sample interior points as well
        const interiorSamples = 20;
        for (let i = 1; i < interiorSamples; i++) {
            for (let j = 1; j < interiorSamples; j++) {
                const x = Math.floor(minX + (i / interiorSamples) * (maxX - minX));
                const y = Math.floor(minY + (j / interiorSamples) * (maxY - minY));

                if (!isOnPerimeter(x, y) && !isInside(x, y)) {
                    return false;
                }
            }
        }

        return true;
    };

    let maxArea = 0;

    // Check all pairs of red tiles as opposite corners
    for (let i = 0; i < redTiles.length; i++) {
        for (let j = i + 1; j < redTiles.length; j++) {
            const [x1, y1] = redTiles[i];
            const [x2, y2] = redTiles[j];

            const minRectX = Math.min(x1, x2);
            const maxRectX = Math.max(x1, x2);
            const minRectY = Math.min(y1, y2);
            const maxRectY = Math.max(y1, y2);

            const width = maxRectX - minRectX + 1;
            const height = maxRectY - minRectY + 1;

            // Check if this rectangle is valid
            if (isRectangleValid(minRectX, minRectY, maxRectX, maxRectY)) {
                const area = width * height;
                maxArea = Math.max(maxArea, area);
            }
        }
    }

    return maxArea;
};
