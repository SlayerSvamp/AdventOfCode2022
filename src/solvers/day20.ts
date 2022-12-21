import { ints, rows, sum } from "@/utils/common"

interface Node {
    value: number;
    prev: Node;
    next: Node;
}

const remove = (node: Node) => {
    node.prev.next = node.next
    node.next.prev = node.prev
}

const insertBefore = (node: Node, target: Node) => {
    node.next = target
    node.prev = target.prev
    target.prev.next = node
    target.prev = node
}

export default (input: string): any[] => {
    const decrypt = (decryptionKey: number, mixes: number) => {
        const nodes = ints(rows(input))
            .map(value => ({ value }) as Node)
        nodes.forEach(n => {
            n.prev = n
            n.next = n
            n.value *= decryptionKey
        })
        let totalLoops = 0
        const startNode = nodes[0]
        const zero = nodes.find(x => x.value === 0) ?? nodes[0]
        for (let node of nodes)
            insertBefore(node, startNode)
        while (mixes--)
            for (let node of nodes) {
                let loops = Math.abs(node.value) % (nodes.length - 1)
                let target = node.next
                remove(node)
                totalLoops += loops
                while (loops--) {
                    target = node.value < 0 ? target.prev : target.next
                }
                insertBefore(node, target)
            }
        const xnd = (times: number) => {
            times %= nodes.length
            let current = zero
            while (times--)
                current = current.next
            return current.value
        }

        return [[xnd(1000), xnd(2000), xnd(3000)], totalLoops] as [number[], number]
    }

    const [falseDecrypt, totalLoopsFalse] = decrypt(1, 1)
    const [decrypted, totalLoops] = decrypt(811589153, 10)
    return [sum(falseDecrypt), sum(decrypted), {
        'total loops for partial': totalLoopsFalse,
        'total loops for true decryption': totalLoops,
        'false decrypt parts': falseDecrypt,
        'fully decrypted parts': decrypted,
    }]
}
