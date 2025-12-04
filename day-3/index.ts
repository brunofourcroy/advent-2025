function findMaxJoltage(bank: string): number {
    // Find the two largest digits in the bank
    // They should be in order (first digit comes before second digit in the string)
    let maxJoltage = 0;

    for (let i = 0; i < bank.length - 1; i++) {
        for (let j = i + 1; j < bank.length; j++) {
            const joltage = parseInt(bank[i] + bank[j]);
            maxJoltage = Math.max(maxJoltage, joltage);
        }
    }

    return maxJoltage;
}

export const part1 = (input: string) => {
    const banks = input.trim().split('\n');
    let totalJoltage = 0;

    for (const bank of banks) {
        totalJoltage += findMaxJoltage(bank);
    }

    return totalJoltage;
};

function findMaxJoltage12(bank: string): number {
    // Select exactly 12 batteries to form the largest 12-digit number
    // Strategy: greedily select the largest available digit at each position

    const batteries = bank.split('');
    const selected: string[] = [];
    let remaining = [...batteries];

    for (let pos = 0; pos < 12; pos++) {
        // We need to select 12 total, and we've selected 'pos' so far
        // So we need (12 - pos) more batteries
        const stillNeeded = 12 - pos;

        // We must leave at least (stillNeeded - 1) batteries after this selection
        // So we can only look at the first (remaining.length - stillNeeded + 1) batteries
        const maxSearchIndex = remaining.length - stillNeeded + 1;

        // Find the largest digit in the searchable range
        let maxDigit = '0';
        let maxIndex = 0;

        for (let i = 0; i < maxSearchIndex; i++) {
            if (remaining[i] > maxDigit) {
                maxDigit = remaining[i];
                maxIndex = i;
            }
        }

        // Select this battery and remove it from remaining
        selected.push(maxDigit);
        remaining = remaining.slice(maxIndex + 1);
    }

    return parseInt(selected.join(''));
}

export const part2 = (input: string) => {
    const banks = input.trim().split('\n');
    let totalJoltage = 0;

    for (const bank of banks) {
        totalJoltage += findMaxJoltage12(bank);
    }

    return totalJoltage;
};