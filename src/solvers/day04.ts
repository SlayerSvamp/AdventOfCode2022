import { ints, range, rows } from "@/utils/common"

export default (input: string): any[] => {
    const pairs = rows(input)
        .map(x => x.split(/[,-]/))
        .map(ints)
        .map(x => [range(x[0], x[1] + 1), range(x[2], x[3] + 1)])

    const contained = pairs
        .map(x => [...x].sort((a, b) => a[0] - b[0] || b[b.length - 1] - a[a.length - 1]))
        .filter(x => x[1].every(y => x[0].includes(y)))

    const overlap = pairs.filter(x => x[1].some(y => x[0].includes(y)))

    return [contained.length, overlap.length, {
        'number of pairs': pairs.length,
    }]
}
