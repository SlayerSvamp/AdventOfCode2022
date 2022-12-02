<script setup lang="ts">
import type { Day } from '@/App.vue';
import { classnames } from '@/utils/common';
import { ref } from 'vue';

enum Status {
    None,
    Verified,
    Error,
}
const props = defineProps<{
    num: number,
    day: Day,
}>()


let part1 = ref<any>(undefined)
let part2 = ref<any>(undefined)
let info = ref<{ [key: string]: any }>()
let metrics = ref<{ [key: string]: any }>()
let part1Status = ref(Status.None)
let part2Status = ref(Status.None)
let running = ref(false)

function getStatus(value: any, test: boolean, index: number) {
    var correct = test ? props.day.correctTest : props.day.correct;
    if (correct[index] === undefined) {
        return Status.None;
    } else if (correct[index] === value) {
        return Status.Verified;
    }
    return Status.Error;

}

async function getInput(test: boolean) {
    const path = test ? '/data/test' : '/data'
    const num = `0${props.num}`.slice(-2)
    const url = `${path}/day${num}.txt`
    return await fetch(url).then(x => x.text());
}

async function runSolver(test: boolean) {
    running.value = true
    document.querySelectorAll('.buttons>a').forEach(b => b.classList.remove('active'))
    document.querySelector(test ? '#test-button' : '#run-button')?.classList.add('active')
    const start = new Date().valueOf()
    const input = await getInput(test);
    [part1, part2, info] = props.day.solver?.(input) ?? []
    part1Status.value = getStatus(part1, test, 0)
    part2Status.value = getStatus(part2, test, 1)
    const end = new Date().valueOf()
    metrics.value = { 'elapsed time': `${end - start} ms` }
    running.value = false
}

const copy = (value: any) => navigator.clipboard.writeText(value);

</script>

<template>
    <div>
        <h1>Day {{ props.num }}: {{ props.day.name }}</h1>
        <div v-if="props.day.solver" class="buttons">
            <a id="test-button" @click="runSolver(true)">[Test]</a>
            <a id="run-button" @click="runSolver(false)">[Run]</a>
        </div>
    </div>
    <div v-if="!props.day.solver">
        I've got nothing to show here yet!
    </div>
    <template v-if="props.day.solver">
        <h2 v-if="running" class="">Running process...</h2>
        <template v-if="!running">
            <div class="results info-cols">
                <div>
                    <label>Part 1</label>
                    <span v-if="!part1" class="no-data"></span>
                    <span><a v-if="part1" :class="classnames('result no-hover', {
                        'verified': part1Status === Status.Verified,
                        'error': part1Status === Status.Error,
                    })" @click="copy(part1)">{{ part1 }}</a></span>
                </div>
                <div>
                    <label>Part 2</label>
                    <span v-if="!part2" class="no-data"></span>
                    <span><a v-if="part2" :class="classnames('result no-hover', {
                        'verified': part2Status === Status.Verified,
                        'error': part2Status === Status.Error,
                    })" @click="copy(part2)">{{ part2 }}</a></span>
                </div>
            </div>
            <template v-if="metrics">
                <div class="info-cols">
                    <div v-for="(metricValue, metricName) in metrics">
                        <label>{{ metricName }}</label>
                        <span>{{ metricValue }}</span>
                    </div>
                    <template v-if="info">
                        <div v-for="(infoValue, infoName) in info">
                            <label>{{ infoName }}</label>
                            <span>{{ infoValue }}</span>
                        </div>
                    </template>
                </div>
            </template>
        </template>
    </template>
</template>

<style>
.buttons {
    display: flex;
    gap: 1rem;
    font-size: 1.5rem;
}

.buttons>a {
    flex-grow: 1;
}

.info-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.info-cols>:not(div) {
    grid-column: 1/-1;
}

.info-cols>div {
    display: grid;
}

.info-cols>div>:first-child {
    color: var(--color-gray);
}

.info-cols>div>:not(:first-child) {
    font-size: 1.5rem;
}

.result {
    color: var(--color-silver);
    cursor: pointer;
}

.verified {
    color: var(--color-gold);
    text-shadow: 0 0 .6rem var(--color-gold);
}

.error {
    color: #ff0000;
    text-shadow: 0 0 .6rem #ff0000;
}

.no-data::after {
    content: 'Not calculated';
    color: var(--color-dark);
}
</style>