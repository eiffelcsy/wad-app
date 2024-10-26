<!-- GanttChart.vue -->
<template>
  <div>
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>
          Track your project tasks and milestones
        </CardDescription>
      </CardHeader>
      <CardContent class="p-0">
        <div class="w-full overflow-x-auto">
          <!-- Header with timeline -->
          <div class="flex sticky top-0 bg-background border-b">
            <div class="flex min-w-[300px] p-3 border-r">
              <div class="space-y-1">
                <div class="font-medium">Task Name</div>
                <div class="text-sm text-muted-foreground">Timeline</div>
              </div>
            </div>
            <div class="flex flex-1">
              <div
                v-for="date in timelineDates"
                :key="date"
                class="flex-none w-[100px] p-3 text-center border-r text-sm text-muted-foreground"
              >
                {{ formatDate(date) }}
              </div>
            </div>
          </div>

          <!-- Tasks -->
          <div class="relative">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="flex border-b group hover:bg-muted/50 transition-colors"
            >
              <div class="flex flex-col min-w-[300px] p-3 border-r space-y-1">
                <div class="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    class="opacity-0 group-hover:opacity-100"
                    @click="() => {}"
                  >
                    <Grip class="h-4 w-4" />
                  </Button>
                  <span class="font-medium">{{ task.title }}</span>
                </div>
                <div class="text-sm text-muted-foreground pl-8">
                  {{ formatDate(task.startDate) }} -
                  {{ formatDate(task.endDate) }}
                </div>
              </div>
              <div class="relative flex-1 h-[72px]">
                <div
                  class="absolute h-8 rounded-md cursor-move"
                  :class="{
                    'bg-primary/20': !task.isComplete,
                    'bg-primary': task.isComplete,
                  }"
                  :style="getTaskBarStyle(task)"
                  @mousedown="startDrag(task)"
                >
                  <div
                    class="h-full rounded-md bg-primary transition-all"
                    :style="{ width: `${task.progress}%` }"
                  ></div>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger class="absolute inset-0"></TooltipTrigger>
                      <TooltipContent>
                        <p>Progress: {{ task.progress }}%</p>
                        <p class="text-xs text-muted-foreground">
                          {{ formatDate(task.startDate) }} -
                          {{ formatDate(task.endDate) }}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Grip } from "lucide-vue-next";

// Sample data structure - replace with Supabase fetching
const tasks = ref([
  {
    id: 1,
    title: "Design System",
    startDate: new Date("2024-10-26"),
    endDate: new Date("2024-10-30"),
    progress: 60,
    isComplete: false,
  },
  {
    id: 2,
    title: "Backend Integration",
    startDate: new Date("2024-10-28"),
    endDate: new Date("2024-11-02"),
    progress: 30,
    isComplete: false,
  },
  {
    id: 3,
    title: "Documentation",
    startDate: new Date("2024-10-29"),
    endDate: new Date("2024-11-05"),
    progress: 100,
    isComplete: true,
  },
]);

// Timeline configuration
const timelineStartDate = ref(new Date("2024-10-26"));
const timelineEndDate = ref(new Date("2024-11-10"));
const draggingTask = ref(null);

// Generate array of dates for timeline
const timelineDates = computed(() => {
  const dates = [];
  const currentDate = new Date(timelineStartDate.value);

  while (currentDate <= timelineEndDate.value) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
});

// Utility functions
const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const getTaskBarStyle = (task) => {
  const totalDays = timelineDates.value.length;
  const startDiff = Math.floor(
    (task.startDate - timelineStartDate.value) / (1000 * 60 * 60 * 24)
  );
  const duration =
    Math.floor((task.endDate - task.startDate) / (1000 * 60 * 60 * 24)) + 1;

  return {
    left: `${(startDiff / totalDays) * 100}%`,
    width: `${(duration / totalDays) * 100}%`,
    top: "50%",
    transform: "translateY(-50%)",
  };
};

// Drag and drop functionality
const startDrag = (task) => {
  draggingTask.value = task;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
};

const onDrag = (e) => {
  if (!draggingTask.value) return;
  // Calculate new dates based on drag position
  // This is where you'd implement the date updating logic
};

const stopDrag = () => {
  draggingTask.value = null;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
};

// Placeholder for Supabase integration
const updateTaskDates = async (taskId, startDate, endDate) => {
  // Here you would implement the Supabase update logic
  console.log("Updating task dates in Supabase:", {
    taskId,
    startDate,
    endDate,
  });
};
</script>
