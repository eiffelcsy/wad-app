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
      <Separator />
        <div class="my-8 mx-auto container xl:w-[1200px]">
          <SharedTodoList :projectId="projectId" />
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
        <GanttChart class="w-full" />
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
const supabase = useSupabaseClient();

const route = useRoute();
const projectId = route.params["projectId"];
const projectInfo = ref({});

const pendingTasks = ref([]);
const doingTasks = ref([]);
const doneTasks = ref([]);

const isPendingVisible = true;

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
      // Determine new status based on which list the task is in
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
    .from("todos")
    .update({ status: task.status })
    .eq("id", task.id);

  if (error) {
    console.error("Error updating task status:", error);
  }
};



onMounted(() => {
  fetchProjectDetails();
  fetchTasks();
});
</script>
