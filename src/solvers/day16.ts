import { rows } from "@/utils/common"

export default (input: string): any[] => {
    const valves = rows(input)
        .map(x => x.split(/[^A-Z\d]+/g).slice(1))
        .map(([s, f, ...r]) => ({ [s]: { flow: +f, adjacent: r } }))
        .reduce((a, c) => Object.assign(a, c))

    const keys = Object.keys(valves)

    const costs: { [key: string]: { [key: string]: number } } = {}

    for (let key of keys) {
        const left = new Set(keys)
        costs[key] = {}
        let current = [key]
        let distance = 1
        while (current.length) {
            const next = []
            for (let adj of current.flatMap(c => valves[c].adjacent)) {
                if (left.delete(adj)) {
                    costs[key][adj] = distance + 1
                    next.push(adj)
                }
            }
            current = next
            distance++
        }
    }

    const hash = (set: Set<string>, c: string) => [...set].sort().join() + '.' + c
    const seen: { [key: string]: number } = {}
    const queue: [number, number, string, Set<string>][] = [[0, 30, "AA", new Set(keys)]]
    
    let max = 0
    while (queue.length) {
        let [released, time, current, left] = queue.pop()!
        released += valves[current].flow * time
        if (max < released) {
            max = released
            console.log(`max: ${max}, queue: ${queue.length}, seen: ${Object.keys(seen).length}`)
        }
        const hashed = hash(left, current)
        if (seen[hashed] >= released) continue
        seen[hashed] = released
        for (let next of left) {
            const cost = costs[current][next]
            const nextLeft = new Set(left)
            nextLeft.delete(next)
            nextLeft.forEach(x => costs[next][x] > time - cost ? nextLeft.delete(x) : {})
            if (time > cost)
                queue.push([released, time - cost, next, nextLeft])
        }
    }

    return [Math.max(...Object.values(seen)), , {

    }]
}
