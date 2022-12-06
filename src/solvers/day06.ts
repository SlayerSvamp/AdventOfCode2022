import { range } from "@/utils/common"

export default (input: string): any[] => {
    const startOfPacket = (n: number) => {
        for (let i of range(n, input.length)) {
            if (new Set(input.slice(i - n, i)).size === n)
                return i
        }
    }

    return [startOfPacket(4), startOfPacket(14), {
        'number of characters': input.length,
        ...range(4, 15).reduce((a, n) => ({
            ...a,
            [`start of packet ${n}`]: startOfPacket(n),
        }), {}),
    }]
}
