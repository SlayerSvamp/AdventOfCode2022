import { direction, range, rows } from "@/utils/common"

export default (input: string): any[] => {
    let [x, y] = [0, 0]
    let tail = Array.from({ length: 9 }).map(() => ({ x: 0, y: 0 }))
    const visited = Array.from({ length: 9 }).map(() => new Set<string>())
    let totalMoves = 0
    const moves = Array.from({ length: 9 }).map(() => 0)
    const longest = Array.from({ length: 9 }).map(() => 0)

    for (let row of rows(input)) {
        const [d, n] = row.split(' ')
        for (let _ in range(+n)) {
            totalMoves++
            if ('UD'.includes(d))
                y += 'U' === d ? -1 : 1
            if ('LR'.includes(d))
                x += 'L' === d ? -1 : 1

            let prev = { x, y }
            for (let [key, current] of Object.entries(tail)) {
                const i = +key
                if (Math.abs(prev.y - current.y) > 1 || Math.abs(prev.x - current.x) > 1) {
                    current.y += direction(prev.y - current.y)
                    current.x += direction(prev.x - current.x)
                    moves[i] = 0;
                }
                else {
                    moves[i]++
                    longest[i] = Math.max(moves[i], longest[i])
                }
                visited[i].add(`${current.y} ${current.x}`)
                prev = current
            }
        }
    }

    return [visited[0].size, visited[8].size, {
        'total moves': totalMoves,
        ...longest.map((x, i) => ({ [`longest between moves (${i + 1})`]: x, }))
            .reduce((a, c) => ({ ...a, ...c })),
    }]
}
