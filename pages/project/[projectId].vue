<template>
  <div>
    <PageHeader />
    <div class="min-h-screen bg-gradient-to-b from-white dark:from-black to-indigo-200/30 dark:to-indigo-900/20">
      <div class="py-6 md:py-8 mx-auto container xl:w-[1200px]">
        <h1
          class="text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold"
        >
          {{ projectInfo.title }}
        </h1>
      </div>
      <Separator />
        <div class="my-8 mx-auto container xl:w-[1200px]">
          <SharedTodoList :projectId="projectId"/>
        </div>
      <Separator />
        <div class="my-8 mx-auto container xl:w-[1200px]">
          <KanbanBoard :projectId="projectId"/>
        </div>
      <Separator />
      <div class="mt-8 pb-16 mx-auto container xl:w-[1200px]">
        <div class="mb-4">
          <h1 class="text-xl font-semibold">Project Timeline</h1>
          <p class="text-base text-zinc-400 dark:text-zinc-500">
            A visual timeline of tasks and milestones over time. Hover over task bars to view full details.
          </p>
        </div>
        <GanttChart class="w-full" :projectId="projectId"/>
      </div>
    </div>
    <PageFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { SharedTodoList } from "@/components/custom/shared-todo-list";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/custom/page-header";
import { PageFooter } from "@/components/custom/page-footer";
import GanttChart from "../../components/custom/gantt-chart/GanttChart.vue";
import { KanbanBoard } from "../../components/custom/kanban";

const route = useRoute();
const projectId = route.params["projectId"];
const projectInfo = ref({});
</script>
