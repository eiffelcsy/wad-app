<!-- GanttChart.vue -->
<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle>Project Timeline</CardTitle>
      <CardDescription>
        Track your project tasks and milestones
      </CardDescription>
    </CardHeader>
    <CardContent class="p-0">
      <!-- Wrapper with custom scrollbar -->
      <div
        class="flex w-full [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-muted-foreground/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/50"
      >
        <!-- Fixed left column -->
        <div
          class="sticky left-0 z-10 w-[400px] bg-background border-r shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]"
        >
          <!-- Fixed header -->
          <div class="flex h-[57px] border-b bg-background">
            <div class="flex-1 grid grid-cols-[1fr,120px] gap-4 p-3">
              <div class="font-medium">Task Name</div>
              <div class="font-medium">Assigned</div>
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
                <div class="flex-1 grid grid-cols-[1fr,120px] gap-4 p-3">
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
                  class="h-[57px] border-b hover:bg-muted/50 transition-colors"
                >
                  <div class="flex-1 grid grid-cols-[1fr,120px] gap-4 p-3 pl-9">
                    <div class="flex items-center space-x-2">
                      <span>{{ task.title }}</span>
                      <Badge v-if="task.isMilestone" variant="outline">
                        Milestone
                      </Badge>
                    </div>
                    <div class="flex items-center space-x-2">
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
          <div class="flex sticky top-0 bg-background border-b h-[57px]">
            <div
              v-for="date in timelineDates"
              :key="date"
              class="flex-none w-[100px] p-3 text-center border-r text-sm text-muted-foreground"
            >
              {{ formatDate(date) }}
            </div>
          </div>

          <!-- Timeline content -->
          <div>
            <div v-for="group in taskGroups" :key="group.id">
              <!-- Group progress bar -->
              <div class="h-12 border-b bg-muted/30">
                <div class="relative h-full">
                  <div
                    class="absolute h-2 top-1/2 -translate-y-1/2 bg-muted-foreground/20 rounded-full mx-4"
                    :style="getGroupProgressStyle(group)"
                  ></div>
                </div>
              </div>

              <!-- Group tasks -->
              <div v-show="expandedGroups[group.id]">
                <div
                  v-for="task in group.tasks"
                  :key="task.id"
                  class="relative h-[57px] border-b"
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
                    <TooltipProvider>
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
                    class="absolute w-4 h-4 rounded-full bg-primary"
                    :style="getMilestoneStyle(task)"
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger class="w-full h-full" />
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

// Task groups data structure
const taskGroups = ref([
  {
    id: 1,
    title: "Task group 1",
    progress: 100,
    tasks: [
      {
        id: 1,
        title: "Task 1",
        startDate: new Date("2024-10-26"),
        endDate: new Date("2024-10-28"),
        progress: 100,
        isComplete: true,
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

const getMilestoneStyle = (task) => {
  const totalDays = timelineDates.value.length;
  const startDiff = Math.floor(
    (task.startDate - timelineStartDate.value) / (1000 * 60 * 60 * 24)
  );

  return {
    left: `${(startDiff / totalDays) * 100}%`,
    top: "50%",
    transform: "translate(-50%, -50%)",
  };
};

const getGroupProgressStyle = (group) => {
  return {
    width: `${group.progress}%`,
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
