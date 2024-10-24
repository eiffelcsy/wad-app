<template>
  <div>
    <PageHeader />
    <div class="min-h-screen bg-zinc-50 dark:bg-black">
      <div class="py-6 md:py-8 mx-auto container xl:w-[1200px]">
        <h1
          class="text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold"
        >
          {{ projectInfo.title }}
        </h1>
      </div>

      <Separator class="w-full" />

      <div class="my-8 mx-auto container xl:w-[1200px]">
        <h2
          class="text-2xl lg:text-3xl text-zinc-800 dark:text-zinc-100 font-semibold"
        >
          Kanban Board
        </h2>
        <div class="grid grid-cols-3 gap-4">
          <div class="col-auto">
            <p class="mb-2 text-red-500 font-semibold font-sans tracking-wide">
              Pending
            </p>
            <draggable
              tag="ul"
              group="all-tasks"
              v-model="pendingTasks"
              item-key="id"
              @end="onDragEnd"
              class="w-auto max-w-md"
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
          <div class="col-auto">
            <p
              class="mb-2 text-amber-500 font-semibold font-sans tracking-wide"
            >
              In Progress
            </p>
            <draggable
              tag="ul"
              group="all-tasks"
              v-model="doingTasks"
              item-key="id"
              @end="onDragEnd"
              class="w-1auto max-w-md"
              :animation="200"
              ghost-class="moving-card"
              filter=".action-button"
              :empty-insert-threshold="100"
            >
              <template #item="{ element: task }">
                <li
                  class="p-2 mb-2 flex justify-between items-center bg-zinc-700 text-white shadow rounded-lg cursor-move hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300"
                >
                  {{ task.title }} - {{ task.status }}
                </li>
              </template>
            </draggable>
          </div>

          <!-- <div class="col-auto">
            <p
              class="mb-2 text-green-600 font-semibold font-sans tracking-wide"
            >
              Review
            </p>
            <draggable
              tag="ul"
              group="all-tasks"
              v-model="reviewTasks"
              item-key="id"
              @end="onDragEnd"
              class="w-auto max-w-md"
              :animation="200"
              ghost-class="moving-card"
              filter=".action-button"
              :empty-insert-threshold="100"
            >
              <template #item="{ element: task}">
                <li
                  class="p-2 mb-2 flex justify-between items-center bg-zinc-700 text-white shadow rounded-lg cursor-move"
                >
                  {{ task.title }} - {{ task.status }}
                </li>
              </template>
            </draggable>
          </div> -->

          <div class="col-auto">
            <p
              class="mb-2 text-green-500 font-semibold font-sans tracking-wide"
            >
              Completed
            </p>
            <draggable
              tag="ul"
              group="all-tasks"
              v-model="doneTasks"
              item-key="id"
              @end="onDragEnd"
              class="w-auto max-w-md"
              ghost-class="moving-card"
              :animation="200"
              :empty-insert-threshold="100"
              :hover
              filter=".action-button"
            >
              <template #item="{ element: task }">
                <li
                  class="p-2 mb-2 flex justify-between items-center bg-zinc-700 text-white shadow rounded-lg cursor-move transition-shadow duration-300 hover:shadow-lg hover:shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all duration-300"
                >
                  {{ task.title }} - {{ task.status }}
                </li>
              </template>
            </draggable>
          </div>
        </div>
        <SharedTodoList :projectId="projectId" />
      </div>
      <Separator class="w-full" />
    </div>
    <PageFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { SharedTodoList } from "@/components/custom/shared-todo-list";
import { Separator } from "~/components/ui/separator";
import { PageHeader } from "@/components/custom/page-header";
import { PageFooter } from "@/components/custom/page-footer";
import draggable from "vuedraggable";

const supabase = useSupabaseClient();

const route = useRoute();
const projectId = route.params["projectId"];
const projectInfo = ref({});

const pendingTasks = ref([]);
const doingTasks = ref([]);
const doneTasks = ref([]);
//const reviewTasks = ref([]);

const onDragEnd = async() => {
  console.log("Tasks updated:", {
    pendingTasks: pendingTasks.value,
    doingTasks: doingTasks.value,
    doneTasks: doneTasks.value,
    // reviewTasks: reviewTasks.value,
  });

  const allTasks = [
    ...pendingTasks.value,
    ...doingTasks.value,
    ...doneTasks.value,
  ];

  await Promise.all(allTasks.map(task => {
    // Determine new status based on which list the task is in
    if (pendingTasks.value.includes(task)) {
      task.status = 'pending';
    } else if (doingTasks.value.includes(task)) {
      task.status = 'in_progress';
    } else if (doneTasks.value.includes(task)) {
      task.status = 'completed';
    }
    return updateTaskStatus(task);
  }));
};

const fetchProjectDetails = async () => {
  const { data: projectDetails, error: projectDetailsError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (projectDetailsError) {
    console.error("Error fetching project details:", projectDetailsError);
    return;
  }

  projectInfo.value = projectDetails;
};

//get tasks from Supabase to populate pendingTasks, doingTasks, doneTasks arrays for kanban
const fetchTasks = async () => {
  try {
    const { data: todos, error: todosError } = await supabase
      .from("todos")
      .select("*")
      .eq("project_id", projectId)
      .eq("status", "pending");

    if (todosError) {
      throw new Error(todosError.message);
    }

    // populate pendingTasks array
    pendingTasks.value = Array.isArray(todos) ? todos : [];
    console.log(pendingTasks);

  } catch (error) {
    console.error("Error fetching todos:", error);
    pendingTasks.value = []; // Fallback to empty array on error
  }

  try {
    const { data: todos, error: todosError } = await supabase
      .from("todos")
      .select("*")
      .eq("project_id", projectId)
      .eq("status", "in_progress");

    if (todosError) {
      throw new Error(todosError.message);
    }

    // populate doingTasks array
    doingTasks.value = Array.isArray(todos) ? todos : [];
    console.log(doingTasks);

  } catch (error) {
    console.error("Error fetching todos:", error);
    doingTasks.value = []; // Fallback to empty array on error
  }

  try {
    const { data: todos, error: todosError } = await supabase
      .from("todos")
      .select("*")
      .eq("project_id", projectId)
      .eq("status", "completed");

    if (todosError) {
      throw new Error(todosError.message);
    }

    // populate doneTasks array
    doneTasks.value = Array.isArray(todos) ? todos : [];
    console.log(doneTasks);

  } catch (error) {
    console.error("Error fetching todos:", error);
    doneTasks.value = []; // Fallback to empty array on error
  }
};

// update status of tasks after drag-drop
const updateTaskStatus = async (task) => {
  const { error } = await supabase
    .from('todos')
    .update({ status: task.status })
    .eq('id', task.id);

  if (error) {
    console.error('Error updating task status:', error);
  }
};

onMounted(() => {
  fetchProjectDetails();
  fetchTasks();
});

</script>
