import { rows } from "@/utils/common";

interface Monkey {
    name: string;
    value: number | undefined;
    actualValue: number | undefined;
    operator: string | undefined;
    monkeys: string[];
}

export default (input: string): any[] => {
    const ops = /[+*/-]/;
    const monkeyList = rows(input)
        .map((x) => x.split(/: /))
        .map<Monkey>(([name, data]) => ({
            name,
            value: +data || undefined,
            actualValue: +data || undefined,
            operator: data[data.search(ops)],
            monkeys: data.split(ops).map(x => x.trim()),
        }));
    const monkeys = monkeyList
        .map((x) => ({ [x.name]: x }))
        .reduce((a, c) => Object.assign(a, c));

    const resolve = (monkey: Monkey) => {
        if (monkey.value) return;
        if (!monkey.monkeys) return;
        if (!monkey.operator) return;
        let exp: string[] = [];
        for (let name of monkey.monkeys) {
            const other = monkeys[name];
            resolve(other);
            exp.push(`${other.value}`);
        }
        monkey.value = Number(eval(exp.join(monkey.operator)));
    };

    resolve(monkeys["root"]);
    return [monkeys["root"].value, , {

    }]
}
