function isInvalidId(num: number): boolean {
    const str = num.toString();
    const len = str.length;

    // Must be even length to be repeated pattern
    if (len % 2 !== 0) {
        return false;
    }

    const half = len / 2;
    const firstHalf = str.slice(0, half);
    const secondHalf = str.slice(half);

    return firstHalf === secondHalf;
}

export const part1 = (input: string) => {
    const ranges = input.replace(/\n/g, '').split(',').filter(r => r.trim());

    let sum = 0;

    for (const range of ranges) {
        const [start, end] = range.trim().split('-').map(Number);

        for (let id = start; id <= end; id++) {
            if (isInvalidId(id)) {
                sum += id;
            }
        }
    }

    return sum;
};

function isInvalidIdPart2(num: number): boolean {
    const str = num.toString();
    const len = str.length;

    for (let patternLen = 1; patternLen <= len / 2; patternLen++) {
        // Check if the string length is divisible by pattern length
        if (len % patternLen !== 0) {
            continue;
        }

        const pattern = str.slice(0, patternLen);
        const repeatCount = len / patternLen;

        let isValid = true;
        for (let i = 0; i < repeatCount; i++) {
            const segment = str.slice(i * patternLen, (i + 1) * patternLen);
            if (segment !== pattern) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            return true;
        }
    }

    return false;
}

export const part2 = (input: string) => {
    const ranges = input.replace(/\n/g, '').split(',').filter(r => r.trim());

    let sum = 0;

    for (const range of ranges) {
        const [start, end] = range.trim().split('-').map(Number);

        for (let id = start; id <= end; id++) {
            if (isInvalidIdPart2(id)) {
                sum += id;
            }
        }
    }

    return sum;
};