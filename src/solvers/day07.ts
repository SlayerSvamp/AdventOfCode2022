import { rows } from "@/utils/common"

export default (input: string): any[] => {
    const dirs: { [key: string]: string[] } = {}
    const sizes: { [key: string]: number } = {}
    let current = ''
    for (let row of rows(input)) {
        if (/^\$ cd/.test(row)) {
            const dir = row.replace(/^\$ cd (.+)$/, '$1')
            if (dir === '/')
                current = dir
            else if (dir === '..')
                current = current.replace(/\/[^\/]+\/$/, '/')
            else
                current += dir + '/'
            dirs[current] ??= []
            sizes[current] ??= 0
        } else if (/^dir/.test(row)) {
            dirs[current].push(row.replace(/^dir (.+)$/, `${current}$1/`))
        } else if (/^\d+/.test(row)) {
            const [size, name] = row.split(' ')
            const path = current + name
            sizes[current] += +size
            sizes[path] = +size
        }
    }

    const allFiles = (dir: string): number => sizes[dir] + dirs[dir].reduce((a, c) => a + allFiles(c), 0)
    const part1 = Object.keys(dirs)
        .map(x => allFiles(x))
        .filter(x => 100_000 >= x)
        .reduce((a, c) => a + c, 0)

    const cached: { [key: string]: number } = {}
    const getSize = (dir: string): number => cached[dir] ??= sizes[dir] + dirs[dir].reduce((a, c) => a + getSize(c), 0)
    const total = 70000000
    const targetSize = total - 30000000
    const totalSize = getSize('/')
    const [[part2, selected]] = Object.keys(dirs)
        .map<[number, string]>(x => [getSize(x), x])
        .filter(x => totalSize - x[0] <= targetSize)
        .sort((l, r) => l[0] - r[0])

    const percent = (v: number) => `${(100 * v).toFixed(1)}%`
    return [part1, part2, {
        'deleted %': percent(part2 / total),
        'used space': totalSize,
        'used %': percent(totalSize / total),
        'used post del': totalSize - part2,
        'used post del %': percent((totalSize - part2) / total),
        'files deleted': Object.keys(sizes)
            .filter(x => !/\/$/.test(x))
            .filter(x => x.startsWith(selected))
            .join('\n'),
    }]
}
