import { desc, groups, ints, rows, sum } from '@/utils/common';

export default (input: string): any[] => {
    let elves = groups(input)
        .map(rows)
        .map(ints)
        .map(sum)
        .sort(desc);

    return [elves[0], sum(elves.slice(0, 3)), {
        'number of elves': elves.length,
        'average total calories': Math.round(sum(elves) / elves.length),
    }];
}
