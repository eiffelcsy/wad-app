<template>
  <div class="w-full mx-auto">
    <div class="flex flex-row justify-between mb-4">
      <div>
        <h1 class="text-xl font-semibold">Project Tasks</h1>
        <p class="text-base text-zinc-400 dark:text-zinc-500">
          List of tasks to be completed
        </p>
      </div>
      <div class="flex items-center">
        <Button
          @click="isOpen = true"
          class="bg-indigo-600 hover:bg-indigo-700 text-white"
          >New Task<PlusIcon class="size-4 ml-2"
        /></Button>
      </div>
    </div>
    <DataTable :columns="columns" :data="data" />

    <!-- Dialog for creating new task (for desktop) -->
    <Dialog v-if="isDesktop" v-model:open="isOpen">
      <DialogTrigger as-child>
        <!-- Empty Trigger -->
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <div class="grid gap-6 p-4">
          <div class="grid gap-2">
            <Label html-for="new-task-title">Task Title</Label>
            <Input
              id="new-task-title"
              v-model="newTaskTitle"
              placeholder="Enter task title"
            />
          </div>
          <RadioGroup default-value="task" v-model="taskType">
            <div class="flex items-center space-x-2">
              <RadioGroupItem id="task" value="task" />
              <Label for="task">Task</Label>
            </div>
            <div class="flex items-center space-x-2">
              <RadioGroupItem id="milestone" value="milestone" />
              <Label for="milestone">Milestone</Label>
            </div>
          </RadioGroup>
          <div v-if="taskType === 'task'">
            <Label for="dateRange">Task Date Range</Label>
            <p class="float-right text-xs pt-1.5 dark:text-zinc-500">
              *Optional
            </p>
            <RangeCalendar
              v-model="dateValue"
              :weekday-format="'short'"
              class="rounded-md grid items-center justify-center border w-full mx-auto"
            />
          </div>
          <div v-if="taskType === 'milestone'">
            <Label for="dateRange">Milestone Due Date</Label>
            <p class="float-right text-xs pt-1.5 dark:text-zinc-500">
              *Optional
            </p>
            <Calendar
              v-model="dateValue.start"
              :weekday-format="'short'"
              class="rounded-md grid items-center justify-center border w-full mx-auto"
            />
          </div>
          <div>
            <Label for="taskGroup">Task Group</Label>
            <Select v-model="selectedTaskGroup">
              <SelectTrigger>
                <span v-if="selectedTaskGroup">
                  {{ selectedTaskGroup }}
                </span>
                <span v-else class="text-zinc-500 dark:text-zinc-400">
                  Select a group
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <span v-for="group in taskGroups">
                    <SelectItem v-if="group" :key="group" :value="group">
                      {{ group }}
                    </SelectItem>
                  </span>
                </SelectGroup>
                <Separator class="my-4" label="Or" />
                <div class="flex w-full items-center gap-2 px-2 pb-2">
                  <Input
                    v-model="newTaskGroup"
                    placeholder="Add new task group..."
                  />
                  <Button @click="addNewTaskGroup" size="icon" variant="outline"
                    ><PlusIcon class="w-4 h-4"
                  /></Button>
                </div>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-2">
            <Label for="assignee">Assign to</Label>
            <Select v-model="selectedMember">
              <SelectTrigger>
                <span v-if="selectedMember.name">
                  {{ selectedMember.name }}
                </span>
                <span v-else class="text-zinc-500 dark:text-zinc-400">
                  Select a member
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="member in members"
                    :key="member.name"
                    :value="{ name: member.name, id: member.user_id }"
                  >
                    {{ member.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            @click="createNewTask"
            class="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Save Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Drawer for creating new task (for mobile) -->
    <Drawer v-else v-model:open="isOpen" class="h-screen max-h-screen">
      <DrawerTrigger as-child>
        <!-- Empty Trigger -->
      </DrawerTrigger>
      <DrawerContent class="h-5/6 max-h-screen">
        <ScrollArea class="h-screen max-h-screen">
          <DrawerHeader class="pb-0">
            <DrawerTitle>Create New Task</DrawerTitle>
          </DrawerHeader>
          <div class="grid gap-6 p-8 pb-10">
            <div class="grid gap-2">
              <input autofocus class="hidden" />
              <Label html-for="new-task-title">Task Title</Label>
              <Input
                id="new-task-title"
                v-model="newTaskTitle"
                placeholder="Enter task title"
              />
            </div>
            <RadioGroup default-value="task" v-model="taskType">
              <div class="flex items-center space-x-3">
                <RadioGroupItem id="task" value="task" />
                <Label for="task" class="text-left">Task</Label>
              </div>
              <div class="flex items-center space-x-3">
                <RadioGroupItem id="milestone" value="milestone" />
                <Label for="milestone" class="text-left">Milestone</Label>
              </div>
            </RadioGroup>
            <div v-if="taskType === 'task'">
              <Label for="dateRange">Task Date Range</Label>
              <p class="float-right text-xs pt-1.5 dark:text-zinc-500">
                *Optional
              </p>
              <RangeCalendar
                v-model="dateValue"
                :weekday-format="'short'"
                class="rounded-md grid items-center justify-center border w-full mx-auto"
              />
            </div>
            <div v-if="taskType === 'milestone'">
              <Label for="dateRange">Milestone Due Date</Label>
              <p class="float-right text-xs pt-1.5 dark:text-zinc-500">
                *Optional
              </p>
              <Calendar
                v-model="dateValue.start"
                :weekday-format="'short'"
                class="rounded-md grid items-center justify-center border w-full mx-auto"
              />
            </div>
            <div>
              <Label for="taskGroup">Task Group</Label>
              <Select v-model="selectedTaskGroup">
                <SelectTrigger>
                  <span v-if="selectedTaskGroup">
                    {{ selectedTaskGroup }}
                  </span>
                  <span v-else class="text-zinc-500 dark:text-zinc-400">
                    Select a group
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <span v-for="group in taskGroups">
                      <SelectItem v-if="group" :key="group" :value="group">
                        {{ group }}
                      </SelectItem>
                    </span>
                  </SelectGroup>
                  <Separator class="my-4" label="Or" />
                  <div class="flex w-full items-center gap-2 px-2 pb-2">
                    <Input
                      v-model="newTaskGroup"
                      placeholder="Add new task group..."
                    />
                    <Button
                      @click="addNewTaskGroup"
                      size="icon"
                      variant="outline"
                      ><PlusIcon class="w-4 h-4"
                    /></Button>
                  </div>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-2">
              <Label html-for="assignee">Assign to</Label>
              <Select v-model="selectedMember">
                <SelectTrigger>
                  <span v-if="selectedMember.name">
                    {{ selectedMember.name }}
                  </span>
                  <span v-else class="text-zinc-500 dark:text-zinc-400">
                    Select a member
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Members</SelectLabel>
                    <SelectItem
                      v-for="member in members"
                      :key="member.name"
                      :value="{ name: member.name, id: member.user_id }"
                    >
                      {{ member.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button
              @click="createNewTask"
              class="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Save Task
            </Button>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { type DateRange } from "radix-vue";
import dayjs from "dayjs";
import { type Ref, ref, onMounted, onBeforeUnmount } from "vue";
import { columns } from "@/components/custom/todos/columns.ts";
import type { Todo } from "@components/custom/todos/columns.ts";
import { DataTable } from "@/components/custom/todos/";
import { PlusIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMediaQuery } from "@vueuse/core";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RangeCalendar } from "@/components/ui/range-calendar";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Calendar } from "@/components/ui/calendar";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const data = ref<Todo[]>([]);
const isOpen = ref(false);
const isDesktop = useMediaQuery("(min-width: 768px)");
const newTaskTitle = ref("");
const selectedMember = ref({ name: "", id: "" });
const selectedTaskGroup = ref("");
const members = ref([]);
const taskGroups = ref([]);
const taskType = ref("task");
const start = today(getLocalTimeZone());
const end = start.add({ days: 7 });
const newTaskGroup = ref("");
const title = ref({ title: "" });

const dateValue = ref({
  start,
  end,
}) as Ref<DateRange>;

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

// Function to fetch todos from Supabase database
async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("project_id", props.projectId);

  if (error) {
    console.error("Error fetching todos:", error);
    return [];
  }

  return data || [];
}

async function getProjectMembers() {
  const { data: projectMembers, error: projectMembersError } = await supabase
    .from("project_members")
    .select("*")
    .eq("project_id", props.projectId);

  if (projectMembersError) {
    console.error("Error fetching project members:", projectMembersError);
    return [];
  }
  members.value = projectMembers || [];
}

async function getProjectTaskGroups() {
  const { data: projectTaskGroups, error: projectTaskGroupsError } =
    await supabase
      .from("todos")
      .select("task_group")
      .eq("project_id", props.projectId)
      .neq("task_group", null);

  if (projectTaskGroupsError) {
    console.error("Error fetching task groups:", projectTaskGroupsError);
    return [];
  }

  const projectTaskGroupsUnique = [
    ...new Set(projectTaskGroups.map((todo) => todo.task_group)),
  ];
  taskGroups.value = projectTaskGroupsUnique || [];
}

async function getProjectTitle() {
  const { data: projectTitle, error: projectTitleError } = await supabase
    .from("projects")
    .select("title")
    .eq("id", props.projectId)
    .single();

  if (projectTitleError) {
    console.error("Error fetching project title:", projectTitleError);
    return "";
  }
  title.value = projectTitle || "";
}

const handleRealTimeChange = (payload) => {
  const newTodo = payload.new;
  const oldTodo = payload.old;

  if (
    newTodo?.project_id !== props.projectId &&
    oldTodo?.project_id !== props.projectId
  ) {
    return;
  }

  if (payload.eventType === "INSERT") {
    data.value = [...data.value, newTodo];
  } else if (payload.eventType === "UPDATE") {
    const index = data.value.findIndex((todo) => todo.id === newTodo.id);
    if (index !== -1) {
      data.value = [
        ...data.value.slice(0, index),
        newTodo,
        ...data.value.slice(index + 1),
      ];
    }
  } else if (payload.eventType === "DELETE") {
    const index = data.value.findIndex((todo) => todo.id === oldTodo.id);
    if (index !== -1) {
      data.value = [
        ...data.value.slice(0, index),
        ...data.value.slice(index + 1),
      ];
    }
  }
};

const addNewTaskGroup = () => {
  if (newTaskGroup.value) {
    taskGroups.value.push(newTaskGroup.value);
    newTaskGroup.value = "";
  }
};

async function createNewTask() {
  if (!newTaskTitle.value || !selectedMember.value) {
    console.error("Task title or assignee is missing");
    return;
  }

  const { error } = await supabase.from("todos").insert({
    title: newTaskTitle.value,
    project_id: props.projectId,
    assigned_to: selectedMember.value.id,
    assignee_name: selectedMember.value.name,
    status: "pending",
    start_date: dayjs(dateValue.value.start).format("YYYY-MM-DD"),
    end_date:
      taskType.value === "milestone"
        ? null
        : dayjs(dateValue.value.end).format("YYYY-MM-DD"),
    is_milestone: taskType.value === "milestone",
    task_group: selectedTaskGroup.value,
  });

  if (error) {
    console.error("Error creating new task:", error);
  } else {
    if (user.value.id != selectedMember.value.id) {
      const { error } = await supabase.from("notifications").insert({
        user_id: selectedMember.value.id,
        message: `You have been assigned a new ${taskType.value} in ${title.value.title}!`,
        target_path: `/project/${props.projectId}`,
      });

      if (error) {
        console.error("Error sending notification to assignee:", error);
      }
    }
    newTaskTitle.value = ""; // Clear the input after saving
    selectedMember.value = { name: "", id: "" }; // Clear the selected member
    isOpen.value = false; // Close the dialog or drawer
  }
}

onMounted(async () => {
  // Fetch todos initially
  data.value = await getTodos();

  // Fetch project members
  await getProjectMembers();

  // Fetch task groups
  await getProjectTaskGroups();

  await getProjectTitle();

  // Set up real-time subscription to the todos table
  const subscription = supabase
    .channel(`public:todos`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "todos",
        filter: `project_id=eq.${props.projectId}`,
      },
      handleRealTimeChange
    )
    .subscribe();

  // Clean up the subscription when component is unmounted
  onBeforeUnmount(() => {
    supabase.removeChannel(subscription);
  });
});
</script>
