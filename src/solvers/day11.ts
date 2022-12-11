import { groups, sum } from "@/utils/common"

const findNumber = (x: string) => +x.replace(/\D/g, '')

export default (input: string): any[] => {
    const monkeys = groups(input).map((lines) => {
        const cached: { [v: number]: number } = {}
        const monkey = {
            id: findNumber(lines[0]),
            items: lines[1].split(',').map(findNumber),
            inspect: (v: number) => cached[v] ??= eval(lines[2].replace(/(.*= )?old/g, `${v}`)),
            divisor: findNumber(lines[3]),
            iftrue: findNumber(lines[4]),
            iffalse: findNumber(lines[5]),
        }
        return monkey
    })
    const commonDivisor = monkeys.map(x => x.divisor).reduce((a, c) => a * c, 1)

    const play = (rounds: number, part: number) => {
        const inspected = monkeys.map(() => 0)
        const items = monkeys.map(x => [...x.items])
        for (let i = 0; i < rounds; i++) {
            for (let monkey of monkeys) {
                for (let item of items[monkey.id]) {
                    item = monkey.inspect(item)
                    if (part === 1)
                        item = Math.floor(item / 3)
                    else
                        item %= commonDivisor
                    const target = item % monkey.divisor ? monkey.iffalse : monkey.iftrue
                    items[target].push(item)
                }
                inspected[monkey.id] += items[monkey.id].length
                items[monkey.id] = []
            }
        }
        return inspected.sort((a, b) => b - a)
    }

    const inspected1 = play(20, 1)
    const inspected2 = play(10_000, 2)
    const monkeyBusiness1 = inspected1[0] * inspected1[1]
    const monkeyBusiness2 = inspected2[0] * inspected2[1]
    return [monkeyBusiness1, monkeyBusiness2, {
        'number of monkeys': monkeys.length,
        'total inspections after 20 rounds': sum(inspected1),
        'total inspections after 10_000 rounds': sum(inspected2),
        'inspecions after 20 rounds': inspected1.join(', '),
        'inspecions after 10000 rounds': inspected2.join(', '),

    }]
}
