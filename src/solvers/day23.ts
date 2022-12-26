import { range, rows } from "@/utils/common"

class Grid<T> {
    static readonly key = (x: number, y: number) => JSON.stringify([x, y])
    static readonly fromKey = (key: string) => JSON.parse(key) as [number, number]
    static readonly north = [[-1, -1], [0, -1], [1, -1]] as [number, number][]
    static readonly south = [[-1, 1], [0, 1], [1, 1]] as [number, number][]
    static readonly west = [[-1, -1], [-1, 0], [-1, 1]] as [number, number][]
    static readonly east = [[1, -1], [1, 0], [1, 1]] as [number, number][]
    static readonly neighbours = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]] as [number, number][]

    constructor(inputValues: T[][]) {
        inputValues.forEach((l, y) => [...l].forEach((v, x) => this.set(x, y)(v)))
        this.ymax = inputValues.length
        this.xmax = Math.max(...inputValues.map(x => x.length))
    }

    xmin = 0
    xmax: number
    ymin = 0
    ymax: number
    get height() { return this.ymax - this.ymin + 1 }
    get width() { return this.xmax - this.xmin + 1 }
    data: { [key: string]: T } = {}
    get = (x: number, y: number) => this.data[Grid.key(x, y)]
    set = (x: number, y: number) => (value: T) => {
        this.data[Grid.key(x, y)] = value
        this.xmin = Math.min(x, this.xmin)
        this.xmax = Math.max(x, this.xmax)
        this.ymin = Math.min(y, this.ymin)
        this.ymax = Math.max(y, this.ymax)
    }
    del = (x: number, y: number) => {
        delete this.data[Grid.key(x, y)];
        [this.xmin, this.ymin] = this.getAll()
            .map(([x, y]) => [x, y])
            .reduce((a, c) => [Math.min(a[0], c[0]), Math.min(a[1], c[1])]);
        [this.xmax, this.ymax] = this.getAll()
            .map(([x, y]) => [x, y])
            .reduce((a, c) => [Math.max(a[0], c[0]), Math.max(a[1], c[1])]);
    }
    get length() { return this.getAll().length }
    getAll = (match?: (value: T) => boolean) => Object.entries(this.data).filter(([, value]) => !match || match(value)).map(([key, value]) => {
        const [x, y] = Grid.fromKey(key)
        return [x, y, value] as [number, number, T]
    })
    getRelative = (x: number, y: number, relative: [number, number][]) =>
        relative.map(([dx, dy]) => [x + dx, y + dy])
            .map(([nx, ny]) => this.get(nx, ny))

    draw = (empty?: string, replace?: { [key: string]: string }) => {
        let text = range(this.ymin, this.ymax + 1).map(y =>
            range(this.xmin, this.xmax + 1).map(x =>
                this.get(x, y) ?? empty).join('')).join('\n')
        if (replace)
            for (let [key, value] of Object.entries(replace))
                text = text.replaceAll(key, value)
        return text
    }

}
export default (input: string): any[] => {
    const grid = new Grid<string>(rows(input).map(x => [...x]))
    const considered = [Grid.north, Grid.south, Grid.west, Grid.east]
    let emptyTiles = 0
    let finished = 0
    for (let i = 1; ; i++) {
        const moves: [number, number][][] = []
        for (let [x, y] of grid.getAll(v => /#/.test(v))) {
            if (grid.getRelative(x, y, Grid.neighbours).some(v => /#/.test(v))) {
                const moveTo = considered.filter(c => grid.getRelative(x, y, c).every(v => /[^#]/.test(v)))
                    .reduce<[number, number] | undefined>((a, c) => a ?? c[1], undefined)
                if (moveTo)
                    moves.push([[x, y], [x + moveTo[0], y + moveTo[1]]])
            }
        }
        const toMove: [number, number][][] = []
        for (let move of moves) {
            if (!moves.filter(m => m !== move).filter(m => Grid.key(...m[1]) === Grid.key(...move[1])).length)
                toMove.push(move)
        }
        for (let [[fx, fy], [tx, ty]] of toMove) {
            grid.set(fx, fy)('.')
            grid.set(tx, ty)('#')
        }
        considered.push(considered.splice(0, 1)[0])
        if (i === 10) {
            grid.getAll(x => /[^#]/.test(x)).forEach(([x, y]) => grid.del(x, y))
            emptyTiles = grid.height * grid.width - grid.getAll(v => /#/.test(v)).length
        }
        if (!toMove.length) {
            finished = i
            break
        }
    }

    // this runs veeeerrry slow, 240 seconds last run measured
    // just want to be done, so i won't be optimizing it
    return [emptyTiles, finished, {
        draw: grid.draw('.'),
    }]
}
