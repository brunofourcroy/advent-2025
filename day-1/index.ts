export const part1 = (input: string) => {
    const lines = input.trim().split('\n');
    let position = 50;
    let count = 0;

    for (const line of lines) {
        const direction = line[0];
        const distance = parseInt(line.substring(1));

        if (direction === 'L') {
            position = (position - distance) % 100;
            if (position < 0) {
position += 100;
}
        } else if (direction === 'R') {
            position = (position + distance) % 100;
        }

        if (position === 0) {
            count++;
        }
    }

    return count;
};

export const part2 = (input: string) => {
    const lines = input.trim().split('\n');
    let position = 50;
    let count = 0;

    for (const line of lines) {
        const direction = line[0];
        const distance = parseInt(line.substring(1));

        if (direction === 'L') {
            // Count every position we hit during the rotation (including end position)
            for (let i = 1; i <= distance; i++) {
                let pos = (position - i) % 100;
                if (pos < 0) {
pos += 100;
}
                if (pos === 0) {
count++;
}
            }
            position = (position - distance) % 100;
            if (position < 0) {
position += 100;
}
        } else if (direction === 'R') {
            // Count every position we hit during the rotation (including end position)
            for (let i = 1; i <= distance; i++) {
                const pos = (position + i) % 100;
                if (pos === 0) {
count++;
}
            }
            position = (position + distance) % 100;
        }
    }

    return count;
};