<template>
  <div>
    <div class="mb-4">
      <h1 class="text-xl font-semibold">Kanban Board</h1>
      <p class="text-base text-zinc-400 dark:text-zinc-500">
        Track tasks across stages for clear progress management. Click and drag
        to move tasks around.
      </p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="col-auto border p-4 rounded-lg sm:col-span-1">
        <div class="flex flex-row justify-between mb-2">
          <p class="text-red-500 font-semibold font-sans tracking-wide">
            Pending
          </p>
          <Button
            v-if="isMobile"
            @click="togglePending"
            variant="outline"
            class="h-8"
          >
            {{ isPendingVisible ? "Collapse" : "Expand" }}
          </Button>
        </div>
        <div v-bind="isPendingVisible" v-if="isPendingVisible">
          <draggable
            tag="ul"
            group="all-tasks"
            v-model="pendingTasks"
            item-key="id"
            @end="onDragEnd"
            class="w-auto min-h-40 md:min-h-96 max-w-md bg-white/50 dark:bg-zinc-900/50 rounded-lg p-4"
            :animation="200"
            ghost-class="moving-card"
            filter=".action-button"
            :empty-insert-threshold="100"
          >
            <template #item="{ element: task }">
              <li
                class="task-item p-2 mb-2 flex justify-between items-center bg-zinc-700 text-white shadow rounded-lg cursor-move transition-shadow duration-300 hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300"
              >
                {{ task.title }} - {{ task.status }}
              </li>
            </template>
          </draggable>
        </div>
      </div>
      <div class="col-auto border p-4 rounded-lg">
        <div class="flex flex-row justify-between mb-2">
          <p class="text-amber-500 font-semibold font-sans tracking-wide">
            In Progress
          </p>
          <Button
            v-if="isMobile"
            @click="toggleDoing"
            variant="outline"
            class="h-8"
          >
            {{ isDoingVisible ? "Collapse" : "Expand" }}
          </Button>
        </div>
        <div v-if="isDoingVisible">
          <draggable
            tag="ul"
            group="all-tasks"
            v-model="doingTasks"
            item-key="id"
            @end="onDragEnd"
            class="w-auto min-h-40 md:min-h-96 max-w-md bg-white/50 dark:bg-zinc-900/50 rounded-lg p-4"
            :animation="200"
            ghost-class="moving-card"
            filter=".action-button"
            :empty-insert-threshold="100"
          >
            <template #item="{ element: task }">
              <li
                class="p-2 mb-2 flex justify-between items-center bg-zinc-700 text-white shadow rounded-lg cursor-move hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-shadow duration-300"
              >
                {{ task.title }} - {{ task.status }}
              </li>
            </template>
          </draggable>
        </div>
      </div>
      <div class="col-auto border p-4 rounded-lg">
        <div class="flex flex-row justify-between mb-2">
          <p class="text-green-500 font-semibold font-sans tracking-wide">
            Completed
          </p>
          <Button
            v-if="isMobile"
            @click="toggleDone"
            variant="outline"
            class="h-8"
          >
            {{ isDoneVisible ? "Collapse" : "Expand" }}
          </Button>
        </div>
        <div v-if="isDoneVisible">
          <draggable
            tag="ul"
            group="all-tasks"
            v-model="doneTasks"
            item-key="id"
            @end="onDragEnd"
            class="w-auto min-h-40 md:min-h-96 max-w-md bg-white/50 dark:bg-zinc-900/50 rounded-lg p-4"
            ghost-class="moving-card"
            :animation="200"
            :empty-insert-threshold="100"
            :hover
            filter=".action-button"
          >
            <template #item="{ element: task }">
              <li
                class="p-2 mb-2 flex justify-between items-center bg-zinc-700 text-white shadow rounded-lg cursor-move transition-shadow duration-300 hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300"
              >
                {{ task.title }} - {{ task.status }}
              </li>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMediaQuery } from "@vueuse/core";
import { ref, onMounted, onUnmounted } from "vue";
import draggable from "vuedraggable";

const supabase = useSupabaseClient();

const pendingTasks = ref([]);
const doingTasks = ref([]);
const doneTasks = ref([]);

const isPendingVisible = ref(true);
const isDoingVisible = ref(true);
const isDoneVisible = ref(true);
const channels = ref(null);
const isMobile = useMediaQuery("max-width: 600px;");

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const setupRealTimeSubscription = () => {
  channels.value = supabase.channel('kanban-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'todos' },
      async (payload) => {
        console.log('Change received!', payload);
        
        await fetchTasks();
      }
    )
    .subscribe();
};


const onDragEnd = async () => {
  console.log("Tasks updated:", {
    pendingTasks: pendingTasks.value,
    doingTasks: doingTasks.value,
    doneTasks: doneTasks.value,
  });

  const allTasks = [
    ...pendingTasks.value,
    ...doingTasks.value,
    ...doneTasks.value,
  ];

  await Promise.all(
    allTasks.map((task) => {
      if (pendingTasks.value.includes(task)) {
        task.status = "pending";
      } else if (doingTasks.value.includes(task)) {
        task.status = "in_progress";
      } else if (doneTasks.value.includes(task)) {
        task.status = "completed";
      }
      return updateTaskStatus(task);
    })
  );
};

async function fetchTasks() {
  console.log("Fetching tasks for kanban...");
  try {
    const { data: todos, error: todosError } = await supabase
      .from("todos")
      .select("*")
      .eq("project_id", props.projectId)
      .eq("status", "pending");

    if (todosError) {
      throw new Error(todosError.message);
    }

    pendingTasks.value = Array.isArray(todos) ? todos : [];
  } catch (error) {
    console.error("Error fetching todos:", error);
    pendingTasks.value = [];
  }

  try {
    const { data: todos, error: todosError } = await supabase
      .from("todos")
      .select("*")
      .eq("project_id", props.projectId)
      .eq("status", "in_progress");

    if (todosError) {
      throw new Error(todosError.message);
    }

    doingTasks.value = Array.isArray(todos) ? todos : [];
  } catch (error) {
    console.error("Error fetching todos:", error);
    doingTasks.value = [];
  }

  try {
    const { data: todos, error: todosError } = await supabase
      .from("todos")
      .select("*")
      .eq("project_id", props.projectId)
      .eq("status", "completed");

    if (todosError) {
      throw new Error(todosError.message);
    }

    doneTasks.value = Array.isArray(todos) ? todos : [];
  } catch (error) {
    console.error("Error fetching todos:", error);
    doneTasks.value = [];
  }
};

const updateTaskStatus = async (task) => {
  const { error } = await supabase
    .from("todos")
    .update({ status: task.status })
    .eq("id", task.id);

  if (error) {
    console.error("Error updating task status:", error);
  }
};

const togglePending = () => {
  isPendingVisible.value = !isPendingVisible.value;
};

const toggleDoing = () => {
  isDoingVisible.value = !isDoingVisible.value;
};

const toggleDone = () => {
  isDoneVisible.value = !isDoneVisible.value;
};

onMounted(async () => {
  await fetchTasks();
  setupRealTimeSubscription();
  onUnmounted(() => {
    clearInterval(timer);
    if (channels.value) {
      channels.value.unsubscribe();
    }
  });
});
</script>
