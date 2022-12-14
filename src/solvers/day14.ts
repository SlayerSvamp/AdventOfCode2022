import { ints, range, rows } from "@/utils/common"

enum ItemType {
    Air,
    Start,
    Stone,
    Sand,
    Flow,
}

interface Grid { [key: string]: number }

export default (input: string): any[] => {
    const walls = rows(input)
        .map(x => x.split(' -> ')
            .map(x => x.split(','))
            .map(ints))

    let [xmin, xmax, ymin, ymax] = [500, 500, 0, 0]
    const baseGrid: Grid = { '500,0': ItemType.Start }
    for (let wall of walls) {
        let prev: number[]
        let current: number[]
        [prev, ...wall] = wall
        while (wall.length) {
            [current, ...wall] = wall
            console.log(prev, current)
            const [xfrom, xto] = [prev[0], current[0]].sort().map((x, i) => x + i)
            const [yfrom, yto] = [prev[1], current[1]].sort().map((y, i) => y + i)
            xmin = Math.min(xmin, xfrom)
            xmax = Math.max(xmax, xto)
            ymin = Math.min(ymin, yfrom)
            ymax = Math.max(ymax, yto)
            for (let y of range(yfrom, yto))
                for (let x of range(xfrom, xto))
                    baseGrid[`${x},${y}`] = ItemType.Stone;
            prev = current
        }
    }

    const simulate = (grid: Grid, part: number) => {
        grid = { ...grid }
        const key = (x: number, y: number) => `${x},${y}`
        const available = (key: string) => ![ItemType.Stone, ItemType.Sand].includes(grid[key] ?? 0)
        let placed = true
        while (placed) {
            placed = false
            let [cx, cy] = [500, 0]
            while (cy < ymax) {
                const next = key(cx, cy + 1)
                if (available(next)) {
                    grid[next] = ItemType.Flow
                    cy++
                }
                else if (available(key(cx - 1, cy + 1)))
                    xmin = Math.min(cx--, xmin)
                else if (available(key(cx + 1, cy + 1)))
                    xmax = Math.max(cx++, xmax)
                else {
                    const current = [cx, cy].join(',')
                    grid[current] = ItemType.Sand
                    placed = true
                    if (part === 2 && cx === 500 && cy === 0)
                        return grid
                    break
                }
            }
            if (part === 2 && cy === ymax) {
                grid[key(cx, cy - 1)] = ItemType.Sand
                placed = true
            }
        }
        return grid
    }


    const items = '.+#o~'
    ymax += 3
    const grid1 = simulate(baseGrid, 1)
    const drawn1 = range(ymin, ymax)
        .map(y => range(xmin - 1, xmax)
            .map(x => items[grid1[`${x},${y}`] ?? 0]).join(''))
        .join('\n')

    ymax -= 2
    const grid2 = simulate(baseGrid, 2)
    const drawn2 = range(ymin, ymax + 1)
        .map(y => range(xmin - 3, xmax + 4)
            .map(x => y >= ymax ? '#' : items[grid2[`${x},${y}`] ?? 0]).join(''))
        .join('\n')

    const count = (grid: Grid) => Object.values(grid).filter(x => x === ItemType.Sand).length

    return [count(grid1), count(grid2), {
        'result of simulation 1': drawn1,
        'result of simulation 2': drawn2,
    }]
}
