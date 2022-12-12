import { rows } from "@/utils/common"

export default (input: string): any[] => {
    const lines = rows(input).map(r => [...r])
    const heights = lines
        .map(r => r.map(c => c.charCodeAt(0)))
        .map(r => r.map((c => (0x20 & c) ? (0x1f & c) : (((c === 0x53) ? 1 : 26)))))

    const [[sy, sx], [ey, ex]] = ['S', 'E']
        .flatMap(c => lines.map((r, y) => [y, r.indexOf(c)]))
        .filter(([, p]) => p > -1)

    const visited: (number | undefined)[][] = lines.map(r => r.map(() => undefined))
    const seen = new Set<string>()
    const isNew = (...items: number[]) => {
        const key = items.join(' ')
        return seen.has(key) ? false : !!seen.add(key)
    }
    let latest = [[ey, ex]]
    isNew(ey, ex)

    let current = 0
    const diffs = [[-1, 0], [0, -1], [1, 0], [0, 1]]
    while (latest.length) {
        for (let [y, x] of latest)
            visited[y][x] = current
        current++

        latest = latest.flatMap(([y, x]) =>
            diffs.map(([dy, dx]) => [y + dy, x + dx, y, x]))
            .filter(([ny,]) => -1 < ny && ny < lines.length)
            .filter(([, nx]) => -1 < nx && nx < lines[0].length)
            .filter(([ny, nx, y, x]) => heights[y][x] - heights[ny][nx] < 2)
            .filter(([ny, nx]) => isNew(ny, nx))
    }

    const hikeStarts = heights
        .flatMap((r, y) => r.map((c, x) => [c, y, x]))
        .filter(([c]) => c === 1)
        .map(([, y, x]) => visited[y][x])
        .filter((x): x is number => !!x)
        .sort()

    const width = lines[0].length
    const height = lines.length
    return [visited[sy][sx], hikeStarts[0], {
        'size of map': `${width * height} (${width}×${height})`,
        'start distances': [...new Set(hikeStarts).values()],
        'map': input.replace(/[^\n]/g, x => ' rivcytljfxznusaeomhpqbdkmw'[x.charCodeAt(0) & 0x1f]),
    }]
}
