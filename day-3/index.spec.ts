import { part1, part2 } from ".";
import { readFileSync } from 'fs';
import { join } from 'node:path';

describe('Day 3', () => {
    describe('Part 1', () =>{
        it('should return the correct answer for the example input', () => {
            expect(part1(readFileSync(join(__dirname, 'sample.txt'), 'utf8'))).toBe(357);
        })
        it('should return the correct answer for the real input', () => {
            expect(part1(readFileSync(join(__dirname, 'input.txt'), 'utf8'))).toBe(17346);
        })
    });
    describe('Part 2', () =>{
        it('should return the correct answer for the example input', () => {
            expect(part2(readFileSync(join(__dirname, 'sample.txt'), 'utf8'))).toBe(3121910778619);
        })
        it('should return the correct answer for the real input', () => {
            expect(part2(readFileSync(join(__dirname, 'input.txt'), 'utf8'))).toBe(172981362045136);
        })
    });
});