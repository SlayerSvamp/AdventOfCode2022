import { rows, sum } from '@/utils/common';

export default (input: string): any[] => {
    const assumed: { [key: string]: number } = {
        'A X': 3 + 1,
        'A Y': 6 + 2,
        'A Z': 0 + 3,
        'B X': 0 + 1,
        'B Y': 3 + 2,
        'B Z': 6 + 3,
        'C X': 6 + 1,
        'C Y': 0 + 2,
        'C Z': 3 + 3,
    }

    const actual: { [key: string]: number } = {
        'A X': 0 + 3,
        'A Y': 3 + 1,
        'A Z': 6 + 2,
        'B X': 0 + 1,
        'B Y': 3 + 2,
        'B Z': 6 + 3,
        'C X': 0 + 2,
        'C Y': 3 + 3,
        'C Z': 6 + 1,
    }

    const rounds = rows(input)
    let part1 = sum(rounds.map(x => assumed[x] ?? 0))
    let part2 = sum(rounds.map(x => actual[x] ?? 0))

    return [part1, part2, {
        'rounds': rounds.length,
        'loses': rounds.filter(x => x.includes('X')).length,
        'draws': rounds.filter(x => x.includes('Y')).length,
        'wins': rounds.filter(x => x.includes('Z')).length,
    }];
}
