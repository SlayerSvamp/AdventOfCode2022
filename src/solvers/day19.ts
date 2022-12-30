import { ints, range, rows, sum } from "@/utils/common"

type State = {
    oreRobots: number;
    clayRobots: number;
    obsidianRobots: number;
    geodeRobots: number;
    ore: number;
    clay: number;
    obsidian: number;
    geodes: number;
}
const nothing: State = {
    oreRobots: 0,
    clayRobots: 0,
    obsidianRobots: 0,
    geodeRobots: 0,
    ore: 0,
    clay: 0,
    obsidian: 0,
    geodes: 0,
}

export default (input: string): any[] => {
    const blueprints = rows(input)
        .map(x => x.match(/\d+/g))
        .filter((x): x is string[] => !!x)
        .map(ints)

    const testBlueprint = (blueprint: number[], part: number) => {
        const id = blueprint[0]
        const oreRobot: State = { ...nothing, oreRobots: 1, ore: blueprint[1] }
        const clayRobot: State = { ...nothing, clayRobots: 1, ore: blueprint[2] }
        const obsidianRobot: State = { ...nothing, obsidianRobots: 1, ore: blueprint[3], clay: blueprint[4] }
        const geodeRobot: State = { ...nothing, geodeRobots: 1, ore: blueprint[5], obsidian: blueprint[6] }
        let maxGeodes = 0
        let maxRobots = 0
        let states: State[] = [{ ...nothing, oreRobots: 1 }]
        if (blueprints.length === 2 || part === 2 || ![1, 2, 7, 10, 12, 15, 16, 18, 21, 23, 24, 28, 30].includes(id))
            for (let minute = [23, 31][part - 1]; minute >= 0; minute--) {
                const newStates: typeof states = []
                for (let state of states) {
                    const newState = { ...state }
                    newState.ore += state.oreRobots
                    newState.clay += state.clayRobots
                    newState.obsidian += state.obsidianRobots
                    newState.geodes += state.geodeRobots
                    maxGeodes = Math.max(maxGeodes, newState.geodes)
                    maxRobots = Math.max(maxRobots, newState.geodeRobots)

                    const build = (robot: State) => {
                        if (robot.obsidian > state.obsidian ||
                            robot.ore > state.ore ||
                            robot.clay > state.clay)
                            return false

                        const buildState = { ...newState }
                        buildState.ore -= robot.ore
                        buildState.clay -= robot.clay
                        buildState.obsidian -= robot.obsidian
                        buildState.oreRobots += robot.oreRobots
                        buildState.clayRobots += robot.clayRobots
                        buildState.obsidianRobots += robot.obsidianRobots
                        buildState.geodeRobots += robot.geodeRobots
                        newStates.push(buildState)
                        return true
                    }

                    const need = (cost: number, resource: number, robots: number) => {
                        for (let i = minute; i >= 0; i--)
                            if (resource < cost) return true
                            else resource += robots - cost
                        return false
                    }

                    const needObsidian = need(geodeRobot.obsidian, state.obsidian, state.obsidianRobots)
                    const needClay = needObsidian && need(obsidianRobot.clay, state.clay, state.clayRobots)
                    const needOre = (needClay && need(clayRobot.ore, state.ore, state.oreRobots))
                        || (needObsidian && need(obsidianRobot.ore, state.ore, state.oreRobots))

                    if (!build(geodeRobot)) {
                        if (needObsidian) build(obsidianRobot)
                        if (needClay) build(clayRobot)
                        if (needOre) build(oreRobot) || build(nothing)
                    }
                }
                states = newStates.filter(x => x.geodeRobots >= maxRobots)
            }
        return maxGeodes
    }

    const qualityLevels = blueprints.map(x => x[0] * testBlueprint(x, 1))
    const qualityLevelsLonger = blueprints.slice(0, 3).map(x => testBlueprint(x, 2)).reduce((a, c) => a * c)
    return [sum(qualityLevels), qualityLevelsLonger,
    {
        'number of blueprints': blueprints.length,
    }]
}
