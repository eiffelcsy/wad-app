<template>
  <div class="w-full mx-auto">
    <div class="flex flex-row justify-between mb-4">
      <div>
        <h1 class="text-xl font-semibold">Project TODOs</h1>
        <p class="text-base text-zinc-400 dark:text-zinc-500">
          List of tasks to be completed
        </p>
      </div>
      <div class="flex items-center">
        <Button @click="isOpen = true"
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
        <div class="grid gap-4 p-4">
          <div class="grid gap-2">
            <Label html-for="new-task-title">Task Title</Label>
            <Input
              id="new-task-title"
              v-model="newTaskTitle"
              placeholder="Enter task title"
            />
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
          <Button @click="createNewTask"> Save Task </Button>
        </div>
      </DialogContent>
    </Dialog>

    <!-- Drawer for creating new task (for mobile) -->
    <Drawer v-else v-model:open="isOpen">
      <DrawerTrigger as-child>
        <!-- Empty Trigger -->
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Task</DrawerTitle>
        </DrawerHeader>
        <div class="grid gap-4 p-4">
          <div class="grid gap-2">
            <Label html-for="new-task-title">Task Title</Label>
            <Input
              id="new-task-title"
              v-model="newTaskTitle"
              placeholder="Enter task title"
            />
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
          <Button @click="createNewTask"> Save Task </Button>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { columns } from "@/components/custom/todos/columns.ts";
import type { Todo } from "@components/custom/todos/columns.ts";
import { DataTable } from "@/components/custom/todos/";
import { PlusIcon } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
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

const supabase = useSupabaseClient();
const data = ref<Todo[]>([]);
const isOpen = ref(false);
const isDesktop = useMediaQuery("(min-width: 768px)");
const newTaskTitle = ref("");
const selectedMember = ref({ name: "", id: "" });
const members = ref([]);

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
    console.log("Deleted Todo:", oldTodo);
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
    name: selectedMember.value.name, // Add the selected member as assignee
    status: "pending", // Default status for a new task
  });

  if (error) {
    console.error("Error creating new task:", error);
  } else {
    newTaskTitle.value = ""; // Clear the input after saving
    selectedMember.value = ""; // Clear the selected member
    isOpen.value = false; // Close the dialog or drawer
  }
}

onMounted(async () => {
  // Fetch todos initially
  data.value = await getTodos();

  // Fetch project members
  await getProjectMembers();

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
