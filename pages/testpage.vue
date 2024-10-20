<template>
  <div class="h-screen p-4 bg-black">
    <table class="max-w-full table-auto border-separate border-spacing-y-0.5 border-spacing-x-1">
      <tbody>
        <tr v-for="(row, rowIndex) in 20" :key="row">
          <td
            v-for="(col, colIndex) in 10"
            :key="col"
            class="h-10 w-20 p-0 text-center"
            @click="toggleCellSelection(rowIndex, colIndex)"
          >
            <div
              :class="[ 
                'h-full w-full flex items-center justify-center border border-zinc-700 bg-zinc-950',
                isSelected(rowIndex, colIndex) ? getMergedClass(rowIndex, colIndex) + ' selected merged' : 'rounded-lg'
              ]"
            >
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const selectedCells = ref<{ row: number; col: number }[]>([]);

const toggleCellSelection = (rowIndex: number, colIndex: number) => {
  const cellIndex = selectedCells.value.findIndex(
    (cell) => cell.row === rowIndex && cell.col === colIndex
  );

  if (cellIndex === -1) {
    // If the cell is not already selected, add it
    selectedCells.value.push({ row: rowIndex, col: colIndex });
  } else {
    // If the cell is already selected, remove it
    selectedCells.value.splice(cellIndex, 1);
  }
};

const isSelected = (rowIndex: number, colIndex: number) => {
  return selectedCells.value.some(
    (cell) => cell.row === rowIndex && cell.col === colIndex
  );
};

const getMergedClass = (rowIndex: number, colIndex: number) => {
  const hasAbove = isSelected(rowIndex - 1, colIndex);
  const hasBelow = isSelected(rowIndex + 1, colIndex);

  let classes = '';

  // Handle top and bottom corners only
  if (!hasAbove) {
    classes += ' rounded-t-lg'; // Rounded top if no selected cell above
  }
  if (!hasBelow) {
    classes += ' rounded-b-lg'; // Rounded bottom if no selected cell below
  }

  return classes.trim();
};
</script>

<style>
/* Tailwind utilities applied using @apply */

/* Selected cells */
.selected {
  @apply bg-red-400 border-red-400;
}

/* Remove border-spacing for merged cells to ensure they visually merge */
.merged {
  border-spacing: 0 !important;
}
</style>
