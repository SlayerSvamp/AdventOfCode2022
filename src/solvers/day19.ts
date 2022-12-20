import { ints, rows, sum } from "@/utils/common"

type State = {
    oreRobots: number;
    clayRobots: number;
    obsidianRobots: number;
    geodeRobots: number;
    ore: number;
    clay: number;
    obsidian: number;
    geodes: number;
    minutes: number;
}
export default (input: string): any[] => {
    const blueprints = rows(input)
        .map(x => x.match(/\d+/g))
        .filter((x): x is string[] => !!x)
        .map(ints)

    const testBlueprint = (blueprint: number[]) => {
        const id = blueprint[0]
        const oreRobot = { ore: blueprint[1], oreRobots: 1 }
        const clayRobot = { ore: blueprint[2], clayRobots: 1 }
        const obsidianRobot = { ore: blueprint[3], clay: blueprint[4], obsidianRobots: 1 }
        const geodeRobot = { ore: blueprint[5], obsidian: blueprint[6], geodeRobots: 1 }
        let max = 0
        const queue: State[] = [{
            oreRobots: 1, clayRobots: 0, obsidianRobots: 0, geodeRobots: 0,
            ore: 0, clay: 0, obsidian: 0, geodes: 0, minutes: 24,
        }]
        let highest: { [key: number]: number } = {}
        let state: State | undefined
        while (state = queue.pop()) {
            if (highest[state.minutes] > state.geodes) continue
            highest[state.minutes] = Math.max(highest[state.minutes], state.geodes)
            state.minutes--
            const newState = { ...state }
            newState.ore += state.oreRobots
            newState.clay += state.clayRobots
            newState.obsidian += state.obsidianRobots
            newState.geodes += state.geodeRobots

            const build = (robot: Partial<State>) => {
                newState.ore -= robot.ore ?? 0
                newState.clay -= robot.clay ?? 0
                newState.obsidian -= robot.obsidian ?? 0
                newState.geodeRobots += robot.geodeRobots ?? 0
                newState.obsidianRobots += robot.obsidianRobots ?? 0
                newState.clayRobots += robot.clayRobots ?? 0
                newState.oreRobots += robot.oreRobots ?? 0
            }

            if (geodeRobot.ore <= state.ore && geodeRobot.obsidian <= state.obsidian)
                build(geodeRobot)
            else if (geodeRobot.ore > state.oreRobots && oreRobot.ore <= state.ore)
                build(oreRobot)
            else if (geodeRobot.obsidian > state.obsidianRobots && obsidianRobot.ore <= state.ore && obsidianRobot.clay <= state.clay)
                build(obsidianRobot)
            else if (obsidianRobot.clay > state.clayRobots && clayRobot.ore <= state.ore)
                build(clayRobot)


            if (newState.minutes > 0)
                queue.push(newState)

            max = Math.max(max, newState.geodes)
        }

        return id * max
    }

    const qualityLevels = blueprints.map(b => testBlueprint(b))
    return [sum(qualityLevels), , {
        'number of blueprints': blueprints.length,
    }]
}
