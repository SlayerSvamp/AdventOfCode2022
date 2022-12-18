interface RockPart { x: number, y: number }
type Rock = RockPart[]
const coord = (r: RockPart) => r.y + r.x / 10
const row = [0, 1, 2, 3, 4, 5, 6]

const draw = (pile: Set<number>) => {
    const start = Math.ceil(Math.max(...pile))
    const end = Math.floor(Math.min(...pile))
    return [...Array(start - end).keys()].reverse()
        .map(y => row.map(x => pile.has(coord({ y: y + end, x })) ? '#' : '.').join(''))
        .join('\n')
}
export default (input: string): any[] => {
    const run = (maxRocks: number) => {
        const jets = [...input].map(x => x === '<' ? -1 : 1)
        const rocks: Rock[] = [['####'], ['.#.', '###', '.#.'], ['..#', '..#', '###'], ['#', '#', '#', '#'], ['##', '##']]
            .map(rock => rock
                .flatMap((row, y, items) => [...row]
                    .map((cell, x) => ['.#'.indexOf(cell), x])
                    .filter(([c]) => c > 0)
                    .map(([, x]) => ({ x, y: items.length - y - 1 }))))

        let n = 0
        let start = 4
        const pile = new Set<number>(row.map(x => x / 10))
        const copy = <T>(o: T) => JSON.parse(JSON.stringify(o)) as T
        const states: string[] = []
        const heights: number[] = []
        let skippedHeight = undefined as number | undefined
        const canMove = (rock: Rock) => rock.map(coord).every(c => !pile.has(c))
        for (let i = 0; i < maxRocks; ++i) {
            let rock = copy(rocks[i % rocks.length])
            rock.forEach(p => {
                p.x += 2
                p.y += start
            })
            while (true) {
                // jet blowing rock horizontally
                const jet = jets[n++ % input.length]
                const movedX = copy(rock)
                movedX.forEach(r => r.x += jet)
                if (movedX.every(r => 0 <= r.x && r.x < 7) && canMove(movedX))
                    rock = movedX
                // rock falling
                const movedY = copy(rock)
                movedY.forEach(r => r.y--)
                if (movedY.every(r => r.y >= 0) && canMove(movedY))
                    rock = movedY
                else
                    break
            }
            rock.map(coord).forEach(c => pile.add(c))
            start = Math.max(start, ...rock.map(r => r.y + 4))

            if (skippedHeight === undefined) {
                // detecting previous states (which are the latest 40 rows)
                const height = Math.floor(Math.max(...pile))
                const state = [...Array(7 * 40).keys()]
                    .map(v => ({ x: v % 7, y: Math.floor(v / 7) + start - 40 }))
                    .map(v => '.#'[+pile.has(coord(v))])
                    .join('')
                if (states.includes(state)) {
                    // previous occurance detected! skipping past loops
                    const prev = states.indexOf(state)
                    const frequency = i - prev
                    const loops = Math.floor((maxRocks - i) / frequency)
                    maxRocks -= loops * frequency
                    skippedHeight = loops * (height - heights[prev])
                }
                states.push(state)
                heights.push(height)
            }
        }
        return [Math.floor(Math.max(...pile)) + (skippedHeight ?? 0), pile] as [number, Set<number>]
    }
    const [after2022, pile] = run(2022)
    const [after1T] = run(1000_000_000_000)
    return [after2022, after1T, {
        drawn: draw(pile)
    }]
}
