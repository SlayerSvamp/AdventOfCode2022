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
import day15 from './solvers/day15'
import day16 from './solvers/day16'
import day17 from './solvers/day17'
import day18 from './solvers/day18'
import day19 from './solvers/day19'
import day20 from './solvers/day20'
import day21 from './solvers/day21'
import day22 from './solvers/day22'
import day23 from './solvers/day23'
import day24 from './solvers/day24'
import day25 from './solvers/day25'
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
  { name: 'Proboscidea Volcanium', solver: day16, correct: [2253, 2838], correctTest: [1651, 1707] },
  { name: 'Pyroclastic Flow', solver: day17, correct: [3144, 1565242165201], correctTest: [3068, 1514285714288] },
  { name: 'Boiling Boulders', solver: day18, correct: [3564, 2106], correctTest: [64, 58] },
  { name: 'Not Enough Minerals', solver: day19, correct: [1389, 3003], correctTest: [33, 3472] },
  { name: 'Grove Positioning System', solver: day20, correct: [8721, 831878881825], correctTest: [3, 1623178306] },
  { name: 'Monkey Math', solver: day21, correct: [93813115694560, 3910938071092], correctTest: [152, 301] },
  { name: 'Monkey Map', solver: day22, correct: [31568], correctTest: [6032, 5031] },
  { name: 'Unstable Diffusion', solver: day23, correct: [3906, 895], correctTest: [110, 20] },
  { name: 'Blizzard Basin', solver: day24, correct: [326, 976], correctTest: [18, 54] },
  { name: 'Full of Hot Air', solver: day25, correct: ['2=20---01==222=0=0-2'], correctTest: ['2=-1=0'] },
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
