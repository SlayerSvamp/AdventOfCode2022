import { ints, range, rows } from "@/utils/common"

export default (input: string): any[] => {
    const data = rows(input)
        .map(x => ints(x.match(/-?\d+/g) ?? []))

    const [part1_targetY, part2_limit] = input.startsWith("Sensor at x=2, y=18: closest beacon is at x=-2, y=15")
        ? [10, 20]
        : [2000000, 4000000]

    const part1_ranges = data.map(([sensorX, sensorY, beaconX, beaconY]) => [
        sensorX,
        Math.abs(sensorY - beaconY) + Math.abs(sensorX - beaconX) - Math.abs(sensorY - part1_targetY)
    ])
        .filter(([, l]) => l > 0)
        .map(([x, size]) => range(x - size, x + size))
        .flat()

    const cannotBe = new Set(part1_ranges)

    const part2_rangesRows: number[][][] = []
    for (let y = 0; y < part2_limit; y++) {
        const ranges = [[0, part2_limit]]
        part2_rangesRows.push(ranges)
    }

    let maxRowRangesLength = 0

    for (let [sensorX, sensorY, beaconX, beaconY] of data) {
        const diff = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY)
        for (let y of range(Math.max(0, sensorY - diff), Math.min(part2_limit, sensorY + diff + 1))) {
            const ydiff = Math.abs(sensorY - y)
            const xdiff = diff - ydiff
            const [xmin, xmax] = [Math.max(0, sensorX - xdiff), Math.min(part2_limit, sensorX + xdiff)]

            for (let rangeKey = part2_rangesRows[y].length - 1; rangeKey >= 0; rangeKey--) {
                let ranges = part2_rangesRows[y][rangeKey]
                if (ranges[0] >= xmin && ranges[1] <= xmax)
                    part2_rangesRows[y].splice(rangeKey, 1)
                else if (ranges[0] >= xmin && ranges[0] <= xmax)
                    ranges[0] = xmax + 1
                else if (ranges[1] >= xmin && ranges[1] <= xmax)
                    ranges[1] = xmin - 1
                else if (ranges[0] < xmin && ranges[1] > xmax) {
                    part2_rangesRows[y].push([xmax + 1, ranges[1]])
                    ranges[1] = xmin - 1
                }
            }
            maxRowRangesLength = Math.max(maxRowRangesLength, part2_rangesRows[y].length)
        }
    }

    const part2 = part2_rangesRows
        .map<[number[][], number]>((x, i) => [x, i])
        .filter(([x]) => x.length)
        .map(([[[x]], i]) => x * 4000_000 + i)
        .reduce((a, c) => a ?? c)

    return [cannotBe.size, part2, {
        'longest list of ranges': maxRowRangesLength,
    }]
}
