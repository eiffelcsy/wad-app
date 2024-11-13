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
                class="task-item p-2 mb-2 flex justify-between items-center bg-indigo-600 hover:bg-indigo-700 text-white shadow rounded-lg cursor-move transition-shadow duration-300 hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300"
              >
                <div class="w-2/5 flex flex-row items-center gap-2">
                  <div class="w-fit overflow-hidden">
                    <h1 class="text-nowrap">{{ task.title }}</h1>
                  </div>
                  <div
                    class="size-2 bg-amber-300 transform rotate-45"
                    v-if="task.is_milestone"
                  ></div>
                </div>
                <Badge
                  class="bg-red-600 hover:bg-red-700 text-white md:hidden lg:block"
                  >{{ task.status == "pending" ? "Pending" : "" }}</Badge
                >
                <div
                  class="size-4 mr-1 rounded-full bg-red-600 hover:bg-red-700 hidden md:block lg:hidden"
                ></div>
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
                class="p-2 mb-2 flex justify-between items-center bg-indigo-600 hover:bg-indigo-700 text-white shadow rounded-lg cursor-move hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-shadow duration-300"
              >
                <div class="flex flex-row items-center gap-2">
                  <h1>{{ task.title }}</h1>
                  <div
                    class="mx-auto size-2 bg-amber-300 transform rotate-45"
                    v-if="task.is_milestone"
                  ></div>
                </div>
                <Badge
                  class="bg-amber-600 hover:bg-amber-700 text-white md:hidden lg:block"
                  >{{
                    task.status == "in_progress" ? "In Progress" : ""
                  }}</Badge
                >
                <div
                  class="size-4 mr-1 rounded-full bg-amber-600 hover:bg-amber-700 hidden md:block lg:hidden"
                ></div>
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
            filter=".action-button"
          >
            <template #item="{ element: task }">
              <li
                class="p-2 mb-2 flex justify-between items-center bg-indigo-600 hover:bg-indigo-700 text-white shadow rounded-lg cursor-move transition-shadow duration-300 hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300"
              >
                <div class="flex flex-row items-center gap-2">
                  <h1>{{ task.title }}</h1>
                  <div
                    class="mx-auto size-2 bg-amber-300 transform rotate-45"
                    v-if="task.is_milestone"
                  ></div>
                </div>
                <Badge
                  class="bg-green-600 hover:bg-green-700 text-white md:hidden lg:block"
                  >{{ task.status == "completed" ? "Completed" : "" }}</Badge
                >
                <div
                  class="size-4 mr-1 rounded-full bg-green-600 hover:bg-green-700 hidden md:block lg:hidden"
                ></div>
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
import { Badge } from "@/components/ui/badge";

const supabase = useSupabaseClient();

const pendingTasks = ref([]);
const doingTasks = ref([]);
const doneTasks = ref([]);

const isPendingVisible = ref(true);
const isDoingVisible = ref(true);
const isDoneVisible = ref(true);
const channels = ref(null);
const isMobile = useMediaQuery("(max-width: 600px)");

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const setupRealTimeSubscription = () => {
  channels.value = supabase
    .channel("kanban-channel")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "todos" },
      async (payload) => {
        await fetchTasks();
      }
    )
    .subscribe();
};

const onDragEnd = async () => {

  await Promise.all(
    pendingTasks.value.map((task, index) => {
      task.status = "pending";
      task.order = index; // Set order based on current index in pendingTasks

      return supabase
        .from("todos")
        .update({ status: task.status, order: task.order })
        .eq("id", task.id);
    })
  );

  await Promise.all(
    doingTasks.value.map((task, index) => {
      task.status = "in_progress";
      task.order = index; // Set order based on current index in doingTasks

      return supabase
        .from("todos")
        .update({ status: task.status, order: task.order })
        .eq("id", task.id);
    })
  );

  await Promise.all(
    doneTasks.value.map((task, index) => {
      task.status = "completed";
      task.order = index; // Set order based on current index in doneTasks

      return supabase
        .from("todos")
        .update({ status: task.status, order: task.order })
        .eq("id", task.id);
    })
  );
};

async function fetchTasks() {
  try {
    const { data: pendingTodos, error: pendingError } = await supabase
      .from("todos")
      .select("*")
      .eq("project_id", props.projectId)
      .eq("status", "pending")
      .order("order", { ascending: true });

    if (pendingError) {
      throw new Error(pendingError.message);
    }

    pendingTasks.value = Array.isArray(pendingTodos) ? pendingTodos : [];
  } catch (error) {
    console.error("Error fetching todos:", error);
    pendingTasks.value = [];
  }

  try {
    const { data: doingTodos, error: doingError } = await supabase
      .from("todos")
      .select("*")
      .eq("project_id", props.projectId)
      .eq("status", "in_progress")
      .order("order", { ascending: true });

    if (doingError) {
      throw new Error(doingError.message);
    }

    doingTasks.value = Array.isArray(doingTodos) ? doingTodos : [];
  } catch (error) {
    console.error("Error fetching todos:", error);
    doingTasks.value = [];
  }

  try {
    const { data: doneTodos, error: doneError } = await supabase
      .from("todos")
      .select("*")
      .eq("project_id", props.projectId)
      .eq("status", "completed")
      .order("order", { ascending: true });

    if (doneError) {
      throw new Error(doneError.message);
    }

    doneTasks.value = Array.isArray(doneTodos) ? doneTodos : [];
  } catch (error) {
    console.error("Error fetching todos:", error);
    doneTasks.value = [];
  }
}

const updateTaskStatus = async (task) => {
  const { data: currStatus, error: currStatusError } = await supabase
    .from("todos")
    .select("status")
    .eq("id", task.id);

  if (currStatusError) {
    console.error(currStatusError.message);
  } else {
    if (currStatus.status != task.status) {
      const { error } = await supabase
        .from("todos")
        .update({ status: task.status })
        .eq("id", task.id);

      if (error) {
        console.error("Error updating task status:", error);
      }
    }
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
