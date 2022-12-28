import { rows } from "@/utils/common"

export default (input: string): any[] => {
    const valves = rows(input)
        .map(x => x.split(/[^A-Z\d]+/g).slice(1))
        .map(([s, f, ...r]) => ({ [s]: { flow: +f, adjacent: r } }))
        .reduce((a, c) => Object.assign(a, c))

    const keys = Object.keys(valves)
    const relevantValves = keys.filter(x => valves[x].flow > 0)

    const costs: { [key: string]: { [key: string]: number } } = {}

    for (let key of keys) {
        const left = new Set(keys)
        costs[key] = {}
        let current = [key]
        for (let distance = 1; current.length; distance++) {
            const next = []
            for (let valve of current)
                for (let adj of valves[valve].adjacent) {
                    if (left.delete(adj)) {
                        costs[key][adj] = distance + 1
                        next.push(adj)
                    }
                }
            current = next
        }
    }

    const run = (part: number) => {
        let scenarios = [{
            released: 0,
            valvesLeft: new Set(relevantValves),
            states: [["AA", [30, 26][part - 1]], ["AA", 26]] as [string, number][],
        }]
        let turn = 0
        // max_length may have to be tweaked to be accurate for other inputs
        const MAX_STATE_LENGTH = 5000
        let maxReleased = 0
        while (scenarios.length) {
            const newItems: typeof scenarios = []
            for (let item of scenarios) {
                for (let valve of item.valvesLeft) {
                    const valvesLeft = new Set(item.valvesLeft)
                    valvesLeft.delete(valve)
                    let [individual, time] = item.states[turn]
                    time -= costs[individual][valve]
                    if (time > 0) {
                        const states = [...item.states]
                        states[turn] = [valve, time]
                        const released = item.released + valves[valve].flow * time
                        maxReleased = Math.max(maxReleased, released)
                        newItems.push({ states, valvesLeft, released })
                    }
                }
            }
            scenarios = newItems.sort((a, b) => b.released - a.released).slice(0, MAX_STATE_LENGTH)
            if (part === 2)
                turn = 1 - turn
        }

        return maxReleased
    }
    const maxReleasedAlone = run(1)
    const maxReleasedWithElephant = run(2)

    return [maxReleasedAlone, maxReleasedWithElephant, {
        'number of valves': keys.length,
        'number of relevant valves':  relevantValves.length,
    }]
}
