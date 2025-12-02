import { part1, part2 } from ".";
import { readFileSync } from 'fs';
import { join } from 'node:path';

describe('Day X', () => {
    describe('Part 1', () =>{
        it('should return the correct answer for the example input', () => {
            expect(part1(readFileSync(join(__dirname, 'sample.txt'), 'utf8'))).toBe(0);
        })
        it.skip('should return the correct answer for the real input', () => {
            expect(part1(readFileSync(join(__dirname, 'input.txt'), 'utf8'))).toBe(0);
        })
    });
    describe('Part 2', () =>{
        it.skip('should return the correct answer for the example input', () => {
            expect(part2(readFileSync(join(__dirname, 'sample.txt'), 'utf8'))).toBe(0);
        })
        it.skip('should return the correct answer for the real input', () => {
            expect(part2(readFileSync(join(__dirname, 'input.txt'), 'utf8'))).toBe(0);
        })
    });
});