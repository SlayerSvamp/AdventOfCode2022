import { rows, sum } from "@/utils/common"

export default (input: string): any[] => {
    let X = 1
    let cycle = 0
    const strengths: number[] = []
    let middle = 20
    const CRT: string[] = []
    let lowest = 1
    let highest = 1
    const draw = () => {
        if (cycle % 40 === 0) CRT.push('')
        CRT[CRT.length - 1] += '.#'[+[-1, 0, 1].includes(X - cycle % 40)]
        cycle++
    }
    for (let row of rows(input)) {
        const value = +row.split(' ')[1]
        draw()
        if (value) draw()
        if (cycle >= middle) {
            strengths.push(middle * X)
            middle += 40
        }
        if (value) X += value
        lowest = Math.min(X, lowest)
        highest = Math.max(X, highest)
    }

    return [sum(strengths), CRT.join('\n'), {
        'number of instructions': rows(input).length,
        'number of cycles': cycle,
        'number of noops': rows(input).filter(x => x === 'noop').length,
        'lowest sprite position': lowest,
        'highest sprite position': highest,
    }]
}
