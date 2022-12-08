import { ints, range } from "@/utils/common"

export default (input: string): any[] => {
    const grid = ints([...input.replace(/\n/g, '')])
    const cols = input.indexOf('\n')
    const rows = grid.length / cols

    const treeRows = range(rows).map(row => range(cols).map(x => grid[row * cols + x]))
    const treeCols = range(cols).map(col => range(rows).map(x => grid[x * cols + col]))
    const directions = grid.map((_, i) => {
        const col = i % cols
        const row = (i - i % cols) / cols
        return [
            treeRows[row].slice(0, col).reverse(),
            treeRows[row].slice(col + 1),
            treeCols[col].slice(0, row).reverse(),
            treeCols[col].slice(row + 1),
        ]
    })
    const visible = grid.filter((tree, i) => directions[i].some(x => x.every(c => c < tree))).length
    const scenicScore = Math.max(
        ...grid.map((tree, i) =>
            directions[i].map(t => t.findIndex(x => x >= tree) + 1 || t.length)
                .reduce((a, c) => a * c, 1)
        ))

    return [visible, scenicScore, {
        'number of trees': `${grid.length} (${cols}×${rows})`,
    }]
}
