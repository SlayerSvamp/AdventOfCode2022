import { rows } from "@/utils/common";

interface Monkey {
    name: string;
    value: string | undefined;
    operator: string | undefined;
    monkeys: string[];
}

export default (input: string): any[] => {
    const ops = /[+*/-]/;
    const monkeyList = rows(input)
        .map((x) => x.split(/: /))
        .map<Monkey>(([name, data]) => ({
            name,
            value: /\d+/.test(data) ? data : undefined,
            operator: data[data.search(ops)],
            monkeys: data.split(ops).map(x => x.trim()),
        }));
    const monkeys = monkeyList
        .map((x) => ({ [x.name]: x }))
        .reduce((a, c) => Object.assign(a, c));

    const root = monkeys["root"]
    const humn = monkeys["humn"]

    const resolve = (monkey: Monkey, forced = false) => {
        if (monkey === root) monkey.value = undefined
        if (monkey.value || !monkey.monkeys || !monkey.operator)
            return;
        let exp: string[] = [];
        for (let name of monkey.monkeys) {
            const other = monkeys[name];
            resolve(other);
            exp.push(other === humn ? 'humn' : other.value ?? '');
        }
        monkey.value = `(${exp.join(monkey.operator)})`;
    };

    const solver = (exp: string) =>
        (value: string | number | undefined) =>
            Number(eval(exp.replace('humn', `${value}`) ?? ''))

    resolve(root);
    const with_wrong_translation = solver(root.value ?? '')(humn.value)

    const [hashumn, nohumn] = root.monkeys
        .map(x => monkeys[x])
        .sort(x => x.value?.includes('humn') ? -1 : 1)
        .map(x => x.value ?? '')

    const expected = solver(nohumn)(0)
    const solve = solver(hashumn)
    let human_value = 0
    let steps = 1
    let actual = solve(0)
    let invert = actual > expected
    let loops = 0
    while ((actual = solve(human_value)) !== expected) {
        loops++
        if (actual > expected !== invert) {
            human_value -= steps / 2
            steps = 1
        } else {
            human_value += steps
            steps *= 2
        }
    }

    return [with_wrong_translation, human_value, {
        'number of search loops': loops,
        'expression length for root': root.value!.length,
        'expression length for my side': hashumn.length,
    }]
}
