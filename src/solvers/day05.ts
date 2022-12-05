import { groups, ints } from "@/utils/common"

export default (input: string): any[] => {
    const [stackRows, instructionRows] = groups(input)

    let stacks = stackRows
        .map(x => (x + ' ').replace(/.(.). /g, (_, x) => x))
        .map(x => x.split(''))
    const numbers = stacks.pop() ?? []
    const stacks1 = stacks
        .reduceRight((a, c) => {
            c.forEach((x, i) => (x !== ' ') && a[i].push(x))
            return a
        }, numbers.map<string[]>(() => []))
    const stacks2 = stacks1.map(x => [...x])

    const instructions = instructionRows
        .map(x => x.match(/\d+/g) ?? [])
        .map(ints)

    for (let [n, from, to] of instructions) {
        const move = (items: string[][], reverse: boolean) => {
            const values = items[from - 1].splice(items[from - 1].length - n, n)
            if (reverse) values.reverse()
            items[to - 1].splice(items[to - 1].length, 0, ...values)
        }
        move(stacks1, true)
        move(stacks2, false)
    }

    const result = (items: string[][]) => items.map(x => [...x].reverse()[0]).join('')

    return [result(stacks1), result(stacks2), {
        instructions: instructions.length,
        stacks: stacks.length,
    }]
}
