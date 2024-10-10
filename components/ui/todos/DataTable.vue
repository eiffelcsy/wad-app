<script setup lang="ts" generic="Todo, TValue">
import type { ColumnDef } from '@tanstack/vue-table'
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
} from '@tanstack/vue-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Props definition to include columns and data
const props = defineProps<{
  columns: ColumnDef<Todo, TValue>[]
  data: Todo[]
}>()

// Initialize the table with data and columns
const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  getCoreRowModel: getCoreRowModel(),
})

// Define your custom actions
const markCompleted = (todoId: number) => {
  console.log(`Marking task ${todoId} as completed`)
  // Add logic to mark task as completed (Supabase update query)
}

const deleteTask = (todoId: number) => {
  console.log(`Deleting task ${todoId}`)
  // Add logic to delete task (Supabase delete query)
}

const updateTask = (todoId: number) => {
  console.log(`Updating task ${todoId}`)
  // Add logic to update task (Supabase update query)
}
</script>

<template>
  <div class="border rounded-md">
    <Table>
      <!-- Table Header -->
      <TableHeader>
        <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>

      <!-- Table Body -->
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows" :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
            </TableCell>
          </TableRow>
        </template>

        <!-- No results message -->
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
