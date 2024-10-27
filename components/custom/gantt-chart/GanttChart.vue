<!-- GanttChart.vue -->
<template>
  <Card class="w-fit">
    <CardContent class="p-0.5">
      <!-- Wrapper with custom scrollbar class -->
      <div class="flex w-full">
        <!-- Fixed left column -->
        <div
          class="sticky left-0 z-10 md:w-80 lg:w-96 bg-background border-r shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]"
        >
          <!-- Fixed header -->
          <div class="flex h-14 border-b bg-background">
            <div class="flex-1 grid md:grid-cols-[1fr,120px] gap-4 p-3">
              <div class="font-medium">Task Name</div>
              <div class="font-medium" v-if="!isMobile">Assigned</div>
            </div>
          </div>

          <!-- Fixed task list -->
          <div>
            <div v-for="group in taskGroups" :key="group.id">
              <!-- Group Header -->
              <div
                class="h-12 flex bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer border-b"
                @click="toggleGroup(group.id)"
              >
                <div class="flex-1 grid gap-4 p-3">
                  <div class="flex items-center space-x-2">
                    <ChevronDown
                      :class="{
                        'transform rotate-[-90deg]': !expandedGroups[group.id],
                      }"
                      class="h-4 w-4 transition-transform"
                    />
                    <span class="font-medium">{{ group.title }}</span>
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
                    class="flex-1 grid md:grid-cols-[1fr,120px] gap-4 p-3 pl-9"
                  >
                    <div class="flex items-center space-x-2">
                      <span>{{ task.title }}</span>
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
        </div>

        <!-- Scrollable timeline -->
        <div class="overflow-x-auto flex-1">
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
          <div class="relative" :style="{ width: timelineWidth }">
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
                      'bg-primary/20': !task.isComplete,
                      'bg-primary': task.isComplete,
                    }"
                    :style="getTaskBarStyle(task)"
                  >
                    <TooltipProvider delayDuration="200">
                      <Tooltip>
                        <TooltipTrigger class="w-full h-full">
                          <div
                            class="h-full rounded-md bg-primary transition-all"
                            :style="{ width: `${task.progress}%` }"
                          ></div>
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
                    <TooltipProvider delayDuration="200">
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
    </CardContent>
  </Card>
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

const DAY_WIDTH = 5;
const isMobile = useMediaQuery("(max-width: 600px)");
const currentDate = ref(new Date());

// Task groups data structure
const taskGroups = ref([
  {
    id: 1,
    title: "Task group 1",
    progress: 87,
    tasks: [
      {
        id: 1,
        title: "Task 1",
        startDate: new Date("2024-10-26"),
        endDate: new Date("2024-10-28"),
        progress: 60,
        isComplete: false,
        isMilestone: false,
        assignee: {
          name: "Chloe",
          avatar: "/avatars/chloe.png",
        },
      },
      {
        id: 2,
        title: "Task 2",
        startDate: new Date("2024-10-28"),
        endDate: new Date("2024-10-30"),
        progress: 100,
        isComplete: true,
        isMilestone: false,
        assignee: {
          name: "Sarah",
          avatar: "/avatars/sarah.png",
        },
      },
      {
        id: 3,
        title: "Milestone A",
        startDate: new Date("2024-10-30"),
        endDate: new Date("2024-10-30"),
        progress: 100,
        isComplete: true,
        isMilestone: true,
        assignee: {
          name: "Chloe",
          avatar: "/avatars/chloe.png",
        },
      },
    ],
  },
  {
    id: 2,
    title: "Task group 2",
    progress: 40,
    tasks: [
      {
        id: 4,
        title: "Task 1",
        startDate: new Date("2024-10-31"),
        endDate: new Date("2024-11-02"),
        progress: 100,
        isComplete: false,
        isMilestone: false,
        assignee: {
          name: "Greg",
          avatar: "/avatars/greg.png",
        },
      },
      {
        id: 5,
        title: "Task 2",
        startDate: new Date("2024-11-02"),
        endDate: new Date("2024-11-04"),
        progress: 30,
        isComplete: false,
        isMilestone: false,
        assignee: {
          name: "Kiara",
          avatar: "/avatars/kiara.png",
        },
      },
    ],
  },
]);

// Track expanded/collapsed state of groups
const expandedGroups = ref(
  taskGroups.value.reduce((acc, group) => {
    acc[group.id] = true;
    return acc;
  }, {})
);

const toggleGroup = (groupId) => {
  expandedGroups.value[groupId] = !expandedGroups.value[groupId];
};

// Timeline configuration
const timelineStartDate = ref(new Date("2024-10-26"));
const timelineEndDate = ref(new Date("2024-11-10"));

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

onMounted(() => {
  const timer = setInterval(() => {
    currentDate.value = new Date();
  }, 3600000);

  onUnmounted(() => {
    clearInterval(timer);
  });
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
    left: `${startDiff * DAY_WIDTH + DAY_WIDTH / 2}rem`,
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

@keyframes dateline-pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.dateline {
  animation: dateline-pulse 3s ease-in-out infinite;
}
</style>
