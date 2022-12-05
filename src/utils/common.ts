export const rows = (x: string) => x.split(/\n/)
export const groups = (x: string) => rows(x).reduce((a, c) => {
    if (!c.trim()) a.push([]);
    else a[a.length - 1].push(c);
    return a;
}, [[]] as string[][])
export const ints = (x: string[]) => x.map(x => +x)
export const sum = (x: number[]) => x.reduce((a, c) => a + c, 0)
export const asc = (x: number[]) => x.sort((l, r) => l - r)
export const desc = (l: number, r: number) => r - l
export const range = (start: number, stop?: number, step: number = 1) => {
    if (stop === undefined)
        [start, stop] = [0, start]
    const result = []
    for (let n = start; step < 0 ? n > stop : n < stop; n += step) {
        result.push(n)
    }
    return result
}

export const classnames = (...classes: (string | { [key: string]: boolean })[]) =>
    classes.map(x =>
        typeof x === 'string' ? x
            : Object.keys(x).filter((key: string) => x[key]).join(' ')
    ).join(' ')