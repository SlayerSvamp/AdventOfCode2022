import { groups } from "@/utils/common"

const delta = [[1, 0], [0, 1], [-1, 0], [0, -1]]

export default (input: string): any[] => {
    const [gridLines, [movesLine]] = groups(input)

    const grid = gridLines.map(x => [...x])
    const get = (x: number, y: number) => grid[y]?.[x] ?? ' '

    const xmax = Math.max(...grid.map(l => l.length - 1))
    const ymax = grid.length - 1
    const moves = movesLine.match(/(\d+|\D+)/g)?.map(x => +x ? +x : x) ?? []
    let [x, y] = [grid[0].indexOf('.'), 0]
    let direction = 0
    for (let move of moves) {
        if (typeof move === 'number') {
            while (move-- > 0) {
                const [dx, dy] = delta[direction]
                let nx = x
                let ny = y
                do {
                    nx += dx + xmax + 1
                    ny += dy + ymax + 1
                    nx %= xmax + 1
                    ny %= ymax + 1
                    console.log(x, y, dx, dy, nx, ny)
                } while (get(nx, ny) === ' ')
                if (get(nx, ny) !== '#') {
                    grid[y][x] = '>v<^'[direction]
                    x = nx
                    y = ny
                }
                if (get(nx, ny) === '#') break
            }
        } else {
            direction += [-1, 1]['LR'.indexOf(move)]
            direction += 4
            direction %= 4
        }
    }

    const passcode = (y + 1) * 1000 + 4 * (x + 1) + direction
    return [passcode, , {
        drawn: grid.map(x => x.join('').replace(/ /g, '_')).join('\n')
    }]
}
