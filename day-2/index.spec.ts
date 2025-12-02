import { part1, part2 } from ".";
import { readFileSync } from 'fs';
import { join } from 'node:path';

describe('Day 2', () => {
    describe('Part 1', () =>{
        it('should return the correct answer for the example input', () => {
            expect(part1(readFileSync(join(__dirname, 'sample.txt'), 'utf8'))).toBe(1227775554);
        })
        it('should return the correct answer for the real input', () => {
            expect(part1(readFileSync(join(__dirname, 'input.txt'), 'utf8'))).toBe(31000881061);
        })
    });
    describe('Part 2', () =>{
        it('should return the correct answer for the example input', () => {
            expect(part2(readFileSync(join(__dirname, 'sample.txt'), 'utf8'))).toBe(4174379265);
        })
        it('should return the correct answer for the real input', () => {
            expect(part2(readFileSync(join(__dirname, 'input.txt'), 'utf8'))).toBe(46769308485);
        })
    });
});