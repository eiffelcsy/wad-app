<template>
  <div>
    <div class="my-8 mx-auto container xl:w-[1200px]">
      <SharedTodoList />
    </div>
    <Separator />
    <div class="my-8 mx-auto container xl:w-[1200px]">
      <div class="mb-4">
        <h1 class="text-xl font-semibold">Project Timeline</h1>
        <p class="text-base text-zinc-400 dark:text-zinc-500">
          A visual timeline of tasks and milestones over time. Hover over task bars to view full details.
        </p>
      </div>
      <GanttChart class="w-full" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { GanttChart } from "@/components/custom/gantt-chart";
import SharedTodoList from "../components/custom/shared-todo-list/SharedTodoList.vue";
import { Separator } from "@/components/ui/separator";
</script>

<style></style>
