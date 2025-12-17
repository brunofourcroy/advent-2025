export const part1 = (input: string) => {
    const lines = input.trim().split('\n');

    // Build the graph: device -> list of outputs
    const graph = new Map<string, string[]>();

    for (const line of lines) {
        const [device, outputsStr] = line.split(': ');
        const outputs = outputsStr.split(' ');
        graph.set(device, outputs);
    }

    // Count all paths from "you" to "out" using DFS
    let pathCount = 0;

    const dfs = (current: string, visited: Set<string>) => {
        if (current === 'out') {
            pathCount++;
            return;
        }

        const outputs = graph.get(current);
        if (!outputs) return;

        for (const next of outputs) {
            if (!visited.has(next)) {
                visited.add(next);
                dfs(next, visited);
                visited.delete(next);
            }
        }
    };

    dfs('you', new Set(['you']));

    return pathCount;
};

export const part2 = (input: string) => {
    const lines = input.trim().split('\n');

    // Build the graph: device -> list of outputs
    const graph = new Map<string, string[]>();

    for (const line of lines) {
        const [device, outputsStr] = line.split(': ');
        const outputs = outputsStr.split(' ');
        graph.set(device, outputs);
    }

    // Memoization for DAG: (node, hasDac, hasFft) -> count of valid paths
    const memo = new Map<string, number>();

    const makeKey = (node: string, hasDac: boolean, hasFft: boolean) =>
        `${node},${hasDac ? 1 : 0},${hasFft ? 1 : 0}`;

    const countPaths = (current: string, hasDac: boolean, hasFft: boolean): number => {
        if (current === 'out') {
            return (hasDac && hasFft) ? 1 : 0;
        }

        const key = makeKey(current, hasDac, hasFft);
        if (memo.has(key)) {
            return memo.get(key)!;
        }

        const outputs = graph.get(current);
        if (!outputs) {
            memo.set(key, 0);
            return 0;
        }

        let count = 0;
        for (const next of outputs) {
            const newHasDac = hasDac || next === 'dac';
            const newHasFft = hasFft || next === 'fft';
            count += countPaths(next, newHasDac, newHasFft);
        }

        memo.set(key, count);
        return count;
    };

    return countPaths('svr', false, false);
};
