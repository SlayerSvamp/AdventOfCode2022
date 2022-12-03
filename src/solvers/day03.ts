import { rows, sum } from "@/utils/common"

const common = (items: string[]) => [...items[0]].find(x => items.every(y => y.includes(x))) ?? ''
const priority = (x: string) => {
    const n = x.charCodeAt(0)
    return (0x1f & n) + ((n & 0x20) ? 0 : 26)
}

export default (input: string): any[] => {
    const rucksacks = rows(input)

    const priorities = rucksacks
        .map(x => ({ x, i: x.length / 2 }))
        .map(({ x, i }) => [x.slice(0, i), x.slice(i)])
        .map(common)
        .map(priority)

    const groupPrios = rucksacks
        .map((x, i) => ({ x, g: Math.floor(i / 3) }))
        .reduce((a, { x, g }) => {
            (a[g] = a[g] ?? []).push(x)
            return a
        }, [] as string[][])
        .map(common)
        .map(priority)

    return [sum(priorities), sum(groupPrios), {
        'number of elves': priorities.length,
        'number of groups': groupPrios.length,
        'average item count': Math.round(sum(rucksacks.map(x => x.length)) / rucksacks.length),
    }]
}
