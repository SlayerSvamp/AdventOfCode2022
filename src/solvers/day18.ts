import { ints, rows } from "@/utils/common"

const adjacents = ([x, y, z]: number[]) =>
    ([
        [-1, 0, 0],
        [1, 0, 0],
        [0, -1, 0],
        [0, 1, 0],
        [0, 0, -1],
        [0, 0, 1],
    ])
        .map(([dx, dy, dz]) => [x + dx, y + dy, z + dz])

const hash = (values: number[]) => values.join(',')

export default (input: string): any[] => {
    const droplets = rows(input)
        .map(x => ints(x.split(',')))
    const check = new Set(droplets.map(hash))
    const min = droplets.reduce((a, c) => a.map((a, i) => Math.min(a, c[i])))
    const max = droplets.reduce((a, c) => a.map((a, i) => Math.max(a, c[i])))


    let surfaces = 0
    let exposed = 0
    for (let droplet of droplets) {
        const sides = adjacents(droplet).filter(d => !check.has(hash(d)))
        surfaces += sides.length
        for (let side of sides) {
            const queue = adjacents(side)
            let seen = new Set<string>()
            let current: number[] | undefined
            while (current = queue.pop()) {
                const h = hash(current)
                if (!seen.has(h) && !check.has(h)) {
                    seen.add(h)
                    adjacents(current).forEach(adj => queue.push(adj))
                    if (current.some((c, i) => c < min[i] || c > max[i])) {
                        exposed++
                        break
                    }
                }
            }
        }

    }

    return [surfaces, exposed, {
        'number of droplets': droplets.length,
        'total potential surfaces': droplets.length * 6,
        'percent surfaces': (100 * surfaces / droplets.length / 6).toFixed(2) + '%',
        'percent exposed': (100 * exposed / droplets.length / 6).toFixed(2) + '%',
    }]
}
