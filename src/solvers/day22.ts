import { groups } from "@/utils/common"

const delta = [[1, 0], [0, 1], [-1, 0], [0, -1]]
enum Face { Front = 0, Back = 1, Left = 2, Right = 3, Up = 4, Down = 5 }
const faceKeys = Object.keys(Face).map<Face>(x => +x).filter(x => !isNaN(x))
export default (input: string): any[] => {
    const [gridLines, [movesLine]] = groups(input)
    const test = gridLines.length < 50;

    const grid = gridLines.map(x => [...x])
    const get = (x: number, y: number) => grid[y]?.[x] ?? ' '

    const faceSize = test ? 4 : 50
    const faceWidth = Math.max(...gridLines.map(x => x.length)) / faceSize
    const faceHeight = gridLines.length / faceSize

    const moves = movesLine.match(/(\d+|\D+)/g)?.map(x => +x ? +x : x) ?? []
    let start = [grid[0].indexOf('.'), 0]

    const run = (part: number, [x, y]: number[], grid: string[][]) => {
        let direction = 0
        for (let move of moves) {
            if (typeof move === 'number') {
                while (move-- > 0) {
                    const [dx, dy] = delta[direction]
                    let nx = x
                    let ny = y
                    let ndir = direction

                    if (part === 1) {
                        do {
                            nx += dx + faceWidth * faceSize
                            nx %= faceWidth * faceSize
                            ny += dy + faceHeight * faceSize
                            ny %= faceHeight * faceSize
                        } while (get(nx, ny) === ' ')
                    }
                    else {
                        nx += dx
                        ny += dy
                        if (get(nx, ny) === ' ') {
                            if (test) {
                                switch (direction) {
                                    case 0:
                                        if (y < 4) {
                                            nx = 15
                                            ny = 11 - y
                                            ndir = 2
                                        } else if (y < 8) {
                                            nx = 15 - (y % 4)
                                            ny = 8
                                            ndir = 1
                                        } else {
                                            nx = 11
                                            ny = 3 - (y % 4)
                                            ndir = 2
                                        }
                                        break
                                    case 1:
                                        if (x < 4) {
                                            nx = 11 - x
                                            ny = 11
                                            ndir = 3
                                        } else if (x < 8) {
                                            nx = 8
                                            ny = 11 - (x % 4)
                                            ndir = 0
                                        } else if (x < 12) {
                                            nx = 3 - (x % 4)
                                            ny = 7
                                            ndir = 3
                                        } else {
                                            nx = 0
                                            ny = 7 - (x % 4)
                                            ndir = 0
                                        }
                                        break
                                    case 2:
                                        if (y < 4) {
                                            nx = 4 + y
                                            ny = 4
                                            ndir = 1
                                        } else if (y < 8) {
                                            nx = 15 - (y % 4)
                                            y = 11
                                            ndir = 3
                                        } else {
                                            nx = 7 - (y % 4)
                                            ny = 7
                                            ndir = 3
                                        }
                                        break
                                    case 3:
                                        if (x < 4) {
                                            nx = 11 - x
                                            ny = 0
                                            ndir = 1
                                        } else if (x < 8) {
                                            nx = 8
                                            ny = x % 4
                                            ndir = 0
                                        } else if (x < 12) {
                                            nx = 3 - (x % 4)
                                            ny = 4
                                            ndir = 1
                                        } else {
                                            nx = 11
                                            ny = 7 - (x % 4)
                                            ndir = 2
                                        }
                                        break
                                }

                            } else {
                                switch (direction) {
                                    case 0:
                                        if (y < 50) {
                                            nx = 99
                                            ny = 149 - y
                                            ndir = 2
                                        } else if (y < 100) {
                                            nx = y + 50
                                            ny = 49
                                            ndir = 3
                                        } else if (y < 150) {
                                            nx = 149
                                            ny = 149 - y
                                            ndir = 2
                                        } else {
                                            nx = y - 100
                                            ny = 149
                                            ndir = 3
                                        }
                                        break
                                    case 1:
                                        if (x < 50) {
                                            nx = x + 100
                                            ny = 0
                                            ndir = 1
                                        } else if (x < 100) {
                                            nx = 49
                                            ny = x + 100
                                            ndir = 2
                                        } else {
                                            nx = 99
                                            ny = x - 50
                                            ndir = 2
                                        }
                                        break
                                    case 2:
                                        if (y < 50) {
                                            nx = 0
                                            ny = 149 - y
                                            ndir = 0
                                        } else if (y < 100) {
                                            nx = y - 50
                                            ny = 100
                                            ndir = 1
                                        } else if (y < 150) {
                                            nx = 50
                                            ny = 149 - y
                                            ndir = 0
                                        } else {
                                            nx = y - 100
                                            ny = 0
                                            ndir = 1
                                        }
                                        break
                                    case 3:
                                        if (x < 50) {
                                            nx = 50
                                            ny = x + 50
                                            ndir = 0
                                        } else if (x < 100) {
                                            nx = 0
                                            ny = x + 100
                                            ndir = 0
                                        } else {
                                            nx = x - 100
                                            ny = 199
                                            ndir = 3
                                        }
                                        break
                                }
                            }
                        }
                    }
                    grid[y][x] = '>v<^'[direction]
                    if (get(nx, ny) !== '#') {
                        x = nx
                        y = ny
                        direction = ndir
                    }
                    if (get(nx, ny) === '#') break
                }
            } else {
                direction += [-1, 1]['LR'.indexOf(move)]
                direction += 4
                direction %= 4
            }
        }
        return [x, y, direction]
    }
    const passcode = ([x, y, direction]: number[]) => (y + 1) * 1000 + 4 * (x + 1) + direction
    const grid1 = grid.map(l => [...l])
    const grid2 = grid.map(l => [...l])
    const wrap = run(1, start, grid1)
    const cube = run(2, start, grid2)
    return [passcode(wrap), passcode(cube), {
        'too low': 19207,
        'too high': 141134,
        'wrapping': grid1.map(x => x.join('').replace(/ /g, '_')).join('\n'),
        'as a cube': grid2.map(x => x.join('').replace(/ /g, '_')).join('\n'),
    }]
}
