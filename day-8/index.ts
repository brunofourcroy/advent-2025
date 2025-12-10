class UnionFind {
    parent: number[];
    size: number[];

    constructor(n: number) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.size = Array(n).fill(1);
    }

    find(x: number): number {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // Path compression
        }
        return this.parent[x];
    }

    union(x: number, y: number): boolean {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) {
            return false; // Already in same set
        }

        // Union by size
        if (this.size[rootX] < this.size[rootY]) {
            this.parent[rootX] = rootY;
            this.size[rootY] += this.size[rootX];
        } else {
            this.parent[rootY] = rootX;
            this.size[rootX] += this.size[rootY];
        }

        return true;
    }

    getCircuitSizes(): number[] {
        const sizes = new Map<number, number>();
        for (let i = 0; i < this.parent.length; i++) {
            const root = this.find(i);
            sizes.set(root, this.size[root]);
        }
        return Array.from(sizes.values());
    }
}

export const part1 = (input: string, numConnections: number = 1000) => {
    const lines = input.trim().split('\n');
    const junctions: Array<[number, number, number]> = [];

    // Parse junction positions
    for (const line of lines) {
        const [x, y, z] = line.split(',').map(Number);
        junctions.push([x, y, z]);
    }

    const n = junctions.length;

    // Calculate all pairwise distances
    const edges: Array<{ dist: number; i: number; j: number }> = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const [x1, y1, z1] = junctions[i];
            const [x2, y2, z2] = junctions[j];
            const dist = Math.sqrt(
                (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
            );
            edges.push({ dist, i, j });
        }
    }

    // Sort edges by distance
    edges.sort((a, b) => a.dist - b.dist);

    // Make the specified number of connection attempts
    const uf = new UnionFind(n);

    for (let i = 0; i < Math.min(numConnections, edges.length); i++) {
        uf.union(edges[i].i, edges[i].j);
    }

    // Get circuit sizes and find three largest
    const circuitSizes = uf.getCircuitSizes();
    circuitSizes.sort((a, b) => b - a);

    // Multiply the three largest
    return circuitSizes[0] * circuitSizes[1] * circuitSizes[2];
};

export const part2 = (input: string) => {
    const lines = input.trim().split('\n');
    const junctions: Array<[number, number, number]> = [];

    // Parse junction positions
    for (const line of lines) {
        const [x, y, z] = line.split(',').map(Number);
        junctions.push([x, y, z]);
    }

    const n = junctions.length;

    // Calculate all pairwise distances
    const edges: Array<{ dist: number; i: number; j: number }> = [];
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            const [x1, y1, z1] = junctions[i];
            const [x2, y2, z2] = junctions[j];
            const dist = Math.sqrt(
                (x2 - x1) ** 2 + (y2 - y1) ** 2 + (z2 - z1) ** 2
            );
            edges.push({ dist, i, j });
        }
    }

    // Sort edges by distance
    edges.sort((a, b) => a.dist - b.dist);

    const uf = new UnionFind(n);

    // Connect until all junction boxes are in one circuit
    let lastI = -1;
    let lastJ = -1;

    for (const edge of edges) {
        // Try to union these two junctions
        if (uf.union(edge.i, edge.j)) {
            lastI = edge.i;
            lastJ = edge.j;

            // Check if all junctions are now in one circuit
            const circuitSizes = uf.getCircuitSizes();
            if (circuitSizes.length === 1) {
                // All junctions are connected
                break;
            }
        }
    }

    // Return product of X coordinates of the last two connected junctions
    return junctions[lastI][0] * junctions[lastJ][0];
};