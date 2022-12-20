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
    type State = {
        actors: [number, string][];
        released: number;
        left: Set<string>
    }
    const copy = (actor: State['actors'][0]) => JSON.parse(JSON.stringify(actor)) as typeof actor
    const hash = (set: Set<string>) => [...set].sort().join('')
    const run = (part: number) => {
        const maxValues: { [key: string]: number } = {}
        const queue: State[] = [{
            actors: Array.from({ length: part }).map(() => [[30, 26][part - 1], "AA"]),
            released: 0,
            left: new Set(keys.filter(x => valves[x].flow > 0))
        }]

        let state: State | undefined
        while (state = queue.pop()) {
            for (let i of state.actors.keys()) {
                let { released } = state
                const [time, valve] = state.actors[i]
                released += valves[valve].flow * time
                const hashed = hash(state.left)
                if (maxValues[hashed] > released) continue
                maxValues[hashed] = released
                for (let next of state.left) {
                    const left = new Set(state.left)
                    const cost = costs[valve][next]
                    left.delete(next)
                    if (time > cost) {
                        const actors = state.actors.map(copy)
                        actors[i] = [time - cost, next]
                        queue.unshift({ released, left, actors })
                    }
                }
            }
        }
        return Math.max(...Object.values(maxValues))
    }
    const maxReleasedAlone = run(1)
    const maxReleasedWithElephant = run(2)

    return [maxReleasedAlone, maxReleasedWithElephant, {

    }]
}
