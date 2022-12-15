<script setup lang="ts">
import { ref } from 'vue';
import DayViewer from './components/DayViewer.vue'
import day01 from './solvers/day01'
import day02 from './solvers/day02'
import day03 from './solvers/day03'
import day04 from './solvers/day04'
import day05 from './solvers/day05'
import day06 from './solvers/day06'
import day07 from './solvers/day07'
import day08 from './solvers/day08'
import day09 from './solvers/day09'
import day10 from './solvers/day10'
import day11 from './solvers/day11'
import day12 from './solvers/day12'
import day13 from './solvers/day13'
import day14 from './solvers/day14'
import day15 from './solvers/day15';
import { classnames } from './utils/common'

export interface Day {
  name: string;
  solver?: (input: string) => any[];
  correct: any[];
  correctTest: any[];
}

const selected = ref<Day>()
const selectedNumber = ref<number>()

const days: Day[] = [
  { name: 'Calorie Counting', solver: day01, correct: [67450, 199357], correctTest: [24000, 45000] },
  { name: 'Rock Paper Scissors', solver: day02, correct: [12740, 11980], correctTest: [15, 12] },
  { name: 'Rucksack Reorganization', solver: day03, correct: [7826, 2577], correctTest: [157, 70] },
  { name: 'Camp Cleanup', solver: day04, correct: [560, 839], correctTest: [2, 4] },
  { name: 'Supply Stacks', solver: day05, correct: ['MQSHJMWNH', 'LLWJRBHVZ'], correctTest: ['CMZ', 'MCD'] },
  { name: 'Tuning Trouble', solver: day06, correct: [1802, 3551], correctTest: [7, 19] },
  { name: 'No Space Left On Device', solver: day07, correct: [1989474, 1111607], correctTest: [95437, 24933642] },
  { name: 'Treetop Tree House', solver: day08, correct: [1672, 327180], correctTest: [21, 8] },
  { name: 'Rope Bridge', solver: day09, correct: [6464, 2604], correctTest: [13, 1] },
  {
    name: 'Cathode-Ray Tube', solver: day10,
    correct: [13520, [
      '###...##..###..#..#.###..####..##..###..',
      '#..#.#..#.#..#.#..#.#..#.#....#..#.#..#.',
      '#..#.#....#..#.####.###..###..#..#.###..',
      '###..#.##.###..#..#.#..#.#....####.#..#.',
      '#....#..#.#....#..#.#..#.#....#..#.#..#.',
      '#.....###.#....#..#.###..####.#..#.###..'].join('\n')],
    correctTest: [13140, [
      '##..##..##..##..##..##..##..##..##..##..',
      '###...###...###...###...###...###...###.',
      '####....####....####....####....####....',
      '#####.....#####.....#####.....#####.....',
      '######......######......######......####',
      '#######.......#######.......#######.....'].join('\n')],
  },
  { name: 'Monkey in the Middle', solver: day11, correct: [112815, 25738411485], correctTest: [10605, 2713310158] },
  { name: 'Hill Climbing Algorithm', solver: day12, correct: [490, 488], correctTest: [31, 29] },
  { name: 'Distress Signal', solver: day13, correct: [5675, 20383], correctTest: [13, 140] },
  { name: 'Regolith Reservoir', solver: day14, correct: [665, 25434], correctTest: [24, 93] },
  { name: 'Beacon Exclusion Zone', solver: day15, correct: [5525847, 13340867187704], correctTest: [26, 56000011] },
  { name: '', solver: undefined, correct: [], correctTest: [] },
  { name: '', solver: undefined, correct: [], correctTest: [] },
  { name: '', solver: undefined, correct: [], correctTest: [] },
  { name: '', solver: undefined, correct: [], correctTest: [] },
  { name: '', solver: undefined, correct: [], correctTest: [] },
  { name: '', solver: undefined, correct: [], correctTest: [] },
  { name: '', solver: undefined, correct: [], correctTest: [] },
  { name: '', solver: undefined, correct: [], correctTest: [] },
  { name: '', solver: undefined, correct: [], correctTest: [] },
  { name: '', solver: undefined, correct: [], correctTest: [] },
]
</script>

<template>
  <header>
    <a v-for="(day, index) of days" :class="classnames({
      'no-hover': !day.solver || index + 1 === selectedNumber,
      'disabled': !day.solver,
      'active': !!day.solver && day.solver === selected?.solver,
    })" @click="selected = day; selectedNumber = index + 1;">
      [{{ `0${days.indexOf(day) + 1}`.slice(-2) }}]
    </a>
  </header>
  <main v-if="selected">
    <DayViewer :key="selected.name" v-if="selectedNumber" :num="selectedNumber" :day="selected" />
  </main>
</template>

<style scoped>
header {
  display: flex;
  align-content: start;
  flex-wrap: wrap;
  justify-self: end;
  gap: 1rem;
  width: 29rem;
}

header>a {
  display: grid;
  width: 5rem;
  aspect-ratio: 1;
  place-items: center;
  font-size: 2rem;
}

main {
  display: grid;
  align-content: start;
  gap: 4rem;
  justify-self: start;
}
</style>
