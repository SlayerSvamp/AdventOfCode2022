import { rows, sum } from "@/utils/common"

const dirs = [[0, -1], [1, 0], [0, 1], [-1, 0]]
const key = (x: number, y: number) => `${x} ${y}`
const blizDir = (c: string) => '^>v<'.indexOf(c)

export default (input: string): any[] => {
    const grid = rows(input).flatMap((row, y) => [...row].map((cell, x) => [cell, x, y] as [string, number, number]))
    const height = Math.max(...grid.map(([c, x, y]) => y + 1))
    const width = Math.max(...grid.map(([c, x, y]) => x + 1))
    const wrap = (x: number, y: number) => {
        if (x === 0) return [width - 2, y]
        if (x === width - 1) return [1, y]
        if (y === 0) return [x, height - 2]
        if (y === height - 1) return [x, 1]
        return [x, y]
    }

    let blizzards = grid.filter(([c]) => blizDir(c) >= 0)
        .map(([c, x, y]) => [blizDir(c), x, y])

    const tiles = Object.fromEntries(
        grid.filter(([c]) => c !== '#')
            .map(([, x, y]) => [key(x, y), [x, y] as [number, number]]))



    const neighbours = Object.fromEntries(
        Object.entries(tiles)
            .map(([k, [x, y]]) => [
                k,
                dirs.map(([dx, dy]) => key(x + dx, y + dy))
                    .filter((k2) => tiles[k2])
            ]))

    const [, xstart] = grid.find(([k, , y]) => k === '.' && y === 0) ?? [, 1]
    const [, xend] = grid.find(([k, , y]) => k === '.' && y === height - 1) ?? [, width - 2]
    const start = key(xstart, 0)
    const end = key(xend, height - 1)
    let minute = 0
    const routes = [[start, end], [end, start], [start, end]]
    let route: string[] | undefined
    const result = []
    let numberOfMoves = []
    while (route = routes.pop()) {
        const [begin, goal] = route
        let moves = new Set([begin])
        while (!moves.has(goal)) {
            minute++
            blizzards = blizzards
                .map(([d, x, y]) => [d, dirs[d][0], dirs[d][1], x, y])
                .map(([d, dx, dy, x, y]) => [d, ...wrap(x + dx, y + dy)])
            const safe = new Set(Object.keys(tiles))
            blizzards.forEach(([, x, y]) => safe.delete(key(x, y)))

            const newMoves = new Set<string>()
            for (let move of moves) {
                if (safe.has(move)) newMoves.add(move)
                if (neighbours[move])
                    for (let neighbour of neighbours[move])
                        if (safe.has(neighbour))
                            newMoves.add(neighbour)
            }
            moves = newMoves
            numberOfMoves.push(moves.size)
        }
        result.push(minute)
    }
    return [result[0], result[2], {
        'maximum parallel paths': Math.max(...numberOfMoves),
        'average parallel paths': Math.round(100 * sum(numberOfMoves) / numberOfMoves.length) / 100,
    }]
}
