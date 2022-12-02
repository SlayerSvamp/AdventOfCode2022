<script setup lang="ts">
import { ref } from 'vue';
import DayViewer from './components/DayViewer.vue'
import day01 from './solvers/day01'
import day02 from './solvers/day02'
import { classnames } from './utils/common';

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
  place-items: start;
  justify-items: center;
  align-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  width: 29rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }
}

header>a {
  display: grid;
  width: 5rem;
  height: 5rem;
  text-align: center;
  align-items: center;
  font-size: 2rem;
  background-color: transparent;
}

main {
  display: grid;
  align-content: start;
  gap: 4rem;
}
</style>
