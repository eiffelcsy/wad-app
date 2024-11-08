<!-- GanttChart.vue -->
<template>
  <Card>
    <CardContent class="p-0.5">
      <!-- Wrapper with custom scrollbar class -->
      <div class="flex w-full">
        <!-- Fixed left column -->
        <div
          class="sticky left-0 z-10 w-[14rem] md:w-[40rem] lg:w-[32rem] bg-background border-r shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]"
        >
          <!-- Fixed header -->
          <div class="w-full flex h-14 border-b bg-background">
            <div
              class="flex-1 grid grid-cols-[14rem,0px] md:grid-cols-[1fr,70px] lg:grid-cols-[1fr,120px] gap-4 p-3"
            >
              <div class="font-medium">Task Name</div>
              <div class="font-medium hidden md:block" v-if="!isMobile">Assigned</div>
            </div>
          </div>

          <!-- Fixed task list -->
          <div class="w-full" v-if="taskGroups.length > 0">
            <div v-for="group in taskGroups" :key="group.id">
              <!-- Group Header -->
              <div
                class="h-12 flex bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border-b"
                @click="toggleGroup(group.id)"
              >
                <div class="flex-1 grid gap-4 p-3">
                  <div class="flex items-center space-x-2 overflow-hidden">
                    <ChevronDown
                      :class="{
                        'transform rotate-[-90deg]': !expandedGroups[group.id],
                      }"
                      class="h-4 w-4 transition-transform"
                    />
                    <span class="font-medium max-w-32 text-nowrap">{{
                      group.title
                    }}</span>
                    <Badge variant="secondary">{{ group.progress }}%</Badge>
                  </div>
                </div>
              </div>

              <!-- Tasks within group -->
              <div v-show="expandedGroups[group.id]">
                <div
                  v-for="task in group.tasks"
                  :key="task.id"
                  class="h-12 border-b hover:bg-muted/50 transition-colors"
                >
                  <div
                    class="flex-1 grid grid-cols-[1fr,0px] md:grid-cols-[1fr,70px] lg:grid-cols-[1fr,100px] gap-4 p-3 lg:pl-9"
                  >
                    <div
                      class="flex items-center space-x-2 overflow-x-scroll hidden-scrollbar noselect [::-webkit-scrollbar]:hidden"
                    >
                      <span class="text-nowrap">{{ task.title }}</span>
                      <Badge
                        v-if="task.isMilestone && !isMobile"
                        variant="outline"
                        class="hidden lg:block"
                      >
                        Milestone
                      </Badge>
                    </div>
                    <div class="flex items-center space-x-2" v-if="!isMobile">
                      <Avatar class="h-6 w-6">
                        <AvatarImage :src="task.assignee.avatar" />
                        <AvatarFallback>{{
                          getInitials(task.assignee.name)
                        }}</AvatarFallback>
                      </Avatar>
                      <span class="text-sm">{{ task.assignee.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full h-20 flex items-center justify-center text-zinc-500 text-sm" v-else>
            No tasks found
          </div>
        </div>

        <!-- Scrollable timeline -->
        <div class="overflow-x-auto w-fit">
          <div class="w-fit flex-1" v-if="timelineDates.length > 0 && taskGroups.length > 0">
            <!-- Timeline header -->
            <div
              class="w-fit flex sticky top-0 bg-background border-b h-14"
              :style="{ width: timelineWidth }"
            >
              <div
                v-for="date in timelineDates"
                :key="date"
                class="flex-none w-20 p-3 text-center border-r text-sm text-muted-foreground"
              >
                {{ formatDate(date) }}
              </div>
            </div>

            <!-- Timeline content -->
            <div class="relative border-r" :style="{ width: timelineWidth }">
              <div
                v-if="isDatelineVisible"
                class="absolute top-0 bottom-0 w-px bg-red-500 z-20 dateline"
                :style="datelineStyle"
              >
                <!-- Date indicator tooltip -->
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      class="absolute w-2 h-2 rounded-r-full bg-red-500"
                    />
                    <TooltipContent>
                      <p class="text-sm font-medium">Current Date</p>
                      <p class="text-xs text-muted-foreground">
                        {{ formatDateLong(currentDate) }}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div v-for="group in taskGroups" :key="group.id">
                <!-- Group progress bar -->
                <div class="h-12 border-b bg-muted/30 px-4">
                  <div class="relative h-full">
                    <Progress
                      class="absolute h-2 top-1/2 -translate-y-1/2"
                      v-model="group.progress"
                    ></Progress>
                  </div>
                </div>

                <!-- Group tasks -->
                <div v-show="expandedGroups[group.id]">
                  <div
                    v-for="task in group.tasks"
                    :key="task.id"
                    class="relative h-12 border-b"
                  >
                    <div
                      v-if="!task.isMilestone"
                      class="absolute h-6 rounded-md"
                      :class="{
                        'bg-indigo-600/20': !task.isComplete,
                        'bg-indigo-600': task.isComplete,
                      }"
                      :style="getTaskBarStyle(task)"
                    >
                      <TooltipProvider :delayDuration="200">
                        <Tooltip>
                          <TooltipTrigger class="w-full h-full">
                            <Popover>
                              <PopoverTrigger class="w-full h-full">
                                <div
                                  class="h-full rounded-md bg-indigo-600 transition-all"
                                  :style="{ width: `${task.progress}%` }"
                                ></div>
                              </PopoverTrigger>
                              <PopoverContent>
                                <Label for="progress">Progress</Label>
                                <div class="flex gap-2 items-center">
                                  <NumberField
                                    id="progress"
                                    v-model="task.progress"
                                  >
                                    <NumberFieldContent>
                                      <NumberFieldDecrement />
                                      <NumberFieldInput />
                                      <NumberFieldIncrement />
                                    </NumberFieldContent>
                                  </NumberField>
                                  <Button
                                    @click="
                                      updateTaskProgress(task.id, task.progress)
                                    "
                                    class="text-white bg-indigo-600 hover:bg-indigo-700"
                                  >
                                    Save
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div class="space-y-1">
                              <p class="font-medium">{{ task.title }}</p>
                              <p class="text-xs text-muted-foreground">
                                {{ formatDateLong(task.startDate) }} -
                                {{ formatDateLong(task.endDate) }}
                              </p>
                              <p class="text-xs">
                                Progress: {{ task.progress }}%
                              </p>
                              <p class="text-xs">
                                Assigned to: {{ task.assignee.name }}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div
                      v-else
                      class="absolute -translate-y-1.5 rotate-45 transition-transform duration-200 ease-in-out hover:rotate-0 w-3 h-3 bg-amber-300"
                      :style="getMilestoneStyle(task)"
                    >
                      <TooltipProvider :delayDuration="200">
                        <Tooltip>
                          <TooltipTrigger
                            class="w-full h-full -translate-y-1.5"
                          />
                          <TooltipContent>
                            <div class="space-y-1">
                              <p class="font-medium">{{ task.title }}</p>
                              <p class="text-xs text-muted-foreground">
                                Due: {{ formatDateLong(task.startDate) }}
                              </p>
                              <p class="text-xs">
                                Assigned to: {{ task.assignee.name }}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-vue-next";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { useMediaQuery } from "@vueuse/core/index.cjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const supabase = useSupabaseClient();
const DAY_WIDTH = 5;
const isMobile = useMediaQuery("(max-width: 600px)");
const currentDate = ref(new Date().setHours(0, 0, 0, 0));
const taskGroups = ref([]);
const expandedGroups = ref({});
const timelineStartDate = ref(new Date());
const timelineEndDate = ref(new Date());
const channels = ref(null);

// Function to toggle group expansion
const toggleGroup = (groupId) => {
  expandedGroups.value[groupId] = !expandedGroups.value[groupId];
};

const setupRealTimeSubscription = () => {
  channels.value = supabase
    .channel("gantt-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "todos" },
      async (payload) => {
        console.log("Change received!", payload);

        await fetchData();
      }
    )
    .subscribe();
};

// Fetch data when the component is mounted
onMounted(async () => {
  await fetchData();

  // Initialize expandedGroups state
  expandedGroups.value = taskGroups.value.reduce((acc, group) => {
    acc[group.id] = true;
    return acc;
  }, {});

  setupRealTimeSubscription();

  // Update current date every hour
  const timer = setInterval(() => {
    currentDate.value = new Date();
  }, 3600000);

  onUnmounted(() => {
    clearInterval(timer);
    if (channels.value) {
      channels.value.unsubscribe();
    }
  });
});

// Function to fetch data from Supabase
async function fetchData() {
  // Fetch all todos from the "todos" table
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("project_id", props.projectId);

  if (error) {
    console.error("Error fetching data:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.warn("No data fetched from todos table.");
    return;
  }

  // Group tasks by "task_group"
  const groups = {};
  data.forEach((todo) => {
    console.log(todo)
    const groupName = todo.task_group;
    if (!groups[groupName]) {
      groups[groupName] = {
        id: groupName, // Using groupName as id
        title: groupName,
        tasks: [],
      };
    }

    // Map the todo to the task structure expected by your UI
    const task = {
      id: todo.id,
      title: todo.title,
      startDate: todo.start_date ? new Date(todo.start_date) : null,
      endDate: todo.end_date ? new Date(todo.end_date) : null,
      progress: todo.progress,
      isComplete: todo.progress === 100,
      isMilestone: todo.is_milestone,
      assignee: {
        name: todo.assignee_name, // Adjust field names as per your schema
      },
    };

    groups[groupName].tasks.push(task);
  });

  Object.values(groups).forEach((group) => {
    const totalProgress = group.tasks.reduce(
      (sum, task) => sum + task.progress,
      0
    );
    const numTasks = group.tasks.length;
    group.progress = Math.round(totalProgress / numTasks);
  });

  taskGroups.value = Object.values(groups);

  const allStartDates = data
    .map((todo) => (todo.start_date ? new Date(todo.start_date) : null))
    .filter((date) => date !== null && !isNaN(date));
  const allEndDates = data
    .map((todo) => (todo.end_date ? new Date(todo.end_date) : null))
    .filter((date) => date !== null && !isNaN(date));

  if (allStartDates.length > 0) {
    timelineStartDate.value = new Date(
      new Date(
        Math.min(...allStartDates.map((date) => date.getTime()))
      ).setHours(0, 0, 0, 0)
    );
  } else {
    timelineStartDate.value = new Date();
  }

  if (allEndDates.length > 0) {
    timelineEndDate.value = new Date(
      new Date(Math.max(...allEndDates.map((date) => date.getTime()))).setHours(
        0,
        0,
        0,
        0
      )
    );
    timelineEndDate.value.setDate(timelineEndDate.value.getDate() + 1);
  } else {
    timelineEndDate.value = new Date();
  }

  const minEndDate = new Date(timelineStartDate.value);
  minEndDate.setDate(minEndDate.getDate() + 8); // Add 8 days to make it a 9-day span

  if (timelineEndDate.value < minEndDate) {
    timelineEndDate.value = minEndDate;
  }

  timelineEndDate.value.setDate(timelineEndDate.value.getDate() + 1);
}

// Computed properties and utility functions
const timelineDates = computed(() => {
  const dates = [];
  const current = new Date(timelineStartDate.value);

  while (current <= timelineEndDate.value) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
});

const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
};

const formatDateLong = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const isDatelineVisible = computed(() => {
  return (
    currentDate.value >= timelineStartDate.value &&
    currentDate.value <= timelineEndDate.value
  );
});

const datelineStyle = computed(() => {
  const diffDays = Math.floor(
    (currentDate.value - timelineStartDate.value) / (1000 * 60 * 60 * 24)
  );

  return {
    left: `${diffDays * DAY_WIDTH + DAY_WIDTH / 2}rem`,
  };
});

const getTaskBarStyle = (task) => {
  const startDiff = Math.floor(
    (task.startDate - timelineStartDate.value) / (1000 * 60 * 60 * 24)
  );
  const duration =
    Math.floor((task.endDate - task.startDate) / (1000 * 60 * 60 * 24)) + 1;

  return {
    left: `${startDiff * DAY_WIDTH}rem`,
    width: `${duration * DAY_WIDTH}rem`,
    top: "50%",
    transform: "translateY(-50%)",
  };
};

const timelineWidth = computed(() => {
  const totalDays = timelineDates.value.length;
  return `${totalDays * DAY_WIDTH}rem`;
});

const getMilestoneStyle = (task) => {
  const startDiff = Math.floor(
    (task.startDate - timelineStartDate.value) / (1000 * 60 * 60 * 24)
  );

  return {
    left: `${startDiff * DAY_WIDTH + DAY_WIDTH / 2 - 0.375}rem`,
    top: "50%",
  };
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

async function updateTaskProgress(taskId, newProgress) {
  try {
    const { data, error } = await supabase
      .from("todos")
      .update({ progress: newProgress })
      .eq("id", taskId)
      .select();

    if (error) {
      console.error("Error updating progress:", error);
    } else {
      console.log("Progress updated successfully:", data, newProgress);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  height: 0.5rem;
}

::-webkit-scrollbar-track {
  background-color: hsl(var(--muted));
}

::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted-foreground) / 0.3);
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--muted-foreground) / 0.5);
}

.hidden-scrollbar::-webkit-scrollbar {
  display: none;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
}

@keyframes dateline-pulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
}

.dateline {
  animation: dateline-pulse 3s ease-in-out infinite;
}
</style>
