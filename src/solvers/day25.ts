import { rows, sum } from "@/utils/common"

const decimal = (snafu: string) => {
    let place = 1
    let result = 0
    for (let c of [...snafu].reverse()) {
        result += [-2, -1, 0, 1, 2]['=-012'.indexOf(c)] * place
        place *= 5
    }
    return result
}

const snafu = (decimal: number) => {
    let result = []
    while (decimal) {
        const d = decimal % 5
        result.unshift('012=-'[d])
        decimal = Math.floor(decimal / 5)
        decimal += d > 2 ? 1 : 0
    }
    return result.join('')
}

export default (input: string): any[] => {
    const values = rows(input).map(decimal)

    return [snafu(sum(values)), , {
        'snafu(1)': snafu(1),
        'snafu(9)': snafu(9),
        'snafu(2022)': snafu(2022),
        'snafu(314159265)': snafu(314159265),
    }]
}
