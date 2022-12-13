import { groups, sum, zip } from "@/utils/common"

type Item = number | Item[]



const compare = (left: Item, right: Item): number => {
    const lnum = typeof left === 'number'
    const rnum = typeof right === 'number'

    if (lnum && rnum)
        return left < right ? -1 : left === right ? 0 : 1

    const litems = lnum ? [left] : left
    const ritems = rnum ? [right] : right
    for (let [l, r] of zip(litems, ritems)) {
        const comp = compare(l, r)
        if (comp !== 0) return comp
    }
    return litems.length - ritems.length
}

export default (input: string): any[] => {
    const pairs = groups(input)
        .map(pair => pair.map(row => JSON.parse(row)))


    const indices = pairs.map(([left, right], i) => [left, right, i + 1])
        .filter(([left, right]) => compare(left, right) < 0)
        .map(([, , i]) => i)

    const dividers = [[[2]], [[6]]]
    const all = [...pairs, dividers].flat().sort(compare)
    const decoderKey = dividers
        .map(x => all.indexOf(x) + 1)
        .reduce((a, c) => a * c)
        
    return [sum(indices), decoderKey, {
        'max': sum(pairs.map(([], i) => i + 1)),
        'number of pairs': pairs.length,
    }]
}
