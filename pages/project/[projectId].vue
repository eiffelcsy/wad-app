<template>
  <div>
    <PageHeader />
    <div class="min-h-screen bg-white dark:bg-black">
      <div class="py-6 md:py-8 mx-auto container xl:w-[1200px] relative">
        <h1
          class="text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold"
        >
          {{ project.title }}
        </h1>
        <div class="absolute top-8 right-2 flex gap-2 align-middle">
          <!-- Edit Icon Button -->
          <Button
            @click="startEditing(project.id, project.title)"
            class="text-blue-500 hover:text-blue-700"
            variant="ghost"
            size="icon"
          >
            <Edit class="size-10" />
          </Button>

          <!-- Delete Icon Button -->
          <Button
            @click="deleteProject(project.id)"
            class="text-red-500 hover:text-red-700"
            variant="ghost"
            size="icon"
          >
            <Trash class="size-10" />
          </Button>
        </div>
      </div>
      <Separator />
      <div class="my-8 mx-auto container xl:w-[1200px]">
        <SharedTodoList :projectId="projectId" />
      </div>
      <Separator />
      <div class="my-8 mx-auto container xl:w-[1200px]">
        <KanbanBoard :projectId="projectId" />
      </div>
      <Separator />
      <div class="mt-8 pb-16 mx-auto container xl:w-[1200px]">
        <div class="mb-4">
          <h1 class="text-xl font-semibold">Project Timeline</h1>
          <p class="text-base text-zinc-400 dark:text-zinc-500">
            A visual timeline of tasks and milestones over time. Hover over task bars to view full details.
          </p>
        </div>
        <GanttChart class="w-full" :projectId="projectId" />
      </div>
    </div>
    <PageFooter />
  </div>

  <!-- edit form -->
  <div
    v-if="isDialogOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-black rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Edit Task</h2>
      <form @submit.prevent="saveProjectTitle">

        <!-- Title Input -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium">Title</label>
          <input
            id="title"
            v-model="editTitle"
            type="text"
            class="border border-gray-300 rounded p-2 w-full bg-black text-white"
            required
          />
        </div>

        <!-- Save and Close Buttons -->
        <div class="flex justify-end gap-2">
          <Button @click="isDialogOpen = false" variant="secondary">Cancel</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </form>
    </div>
  </div>

</template>

<script setup>
import { nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { SharedTodoList } from "@/components/custom/shared-todo-list";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/custom/page-header";
import { PageFooter } from "@/components/custom/page-footer";
import { GanttChart } from "@/components/custom/gantt-chart";
import { KanbanBoard } from "@/components/custom/kanban";
import { Trash, Edit } from "lucide-vue-next";

const route = useRoute();
const projectId = route.params["projectId"];
const project = ref({});
const projects = ref([]);
const supabase = useSupabaseClient();
const editingProjectId = ref(null);
const editTitle = ref("");
const isEditing = ref({});
const isDialogOpen = ref(false);

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
  project.value = projectDetails;
};

onMounted(async () => {
  await nextTick();
  fetchProjectDetails();
});

const startEditing = (projectId, currentTitle) => {
  editingProjectId.value = projectId;
  editTitle.value = currentTitle;
  isDialogOpen.value = true;
};

const cancelEditMode = (projectId) => {
  isEditing.value[projectId] = false;
  editTitle.value = "";
};

const saveProjectTitle = async () => {
  if (!editingProjectId.value) {
    console.error("❌ No project ID set for editing.");
    return;
  }

  try {
    const { error: updateError } = await supabase
      .from("projects")
      .update({ title: editTitle.value }) // Update database
      .eq("id", editingProjectId.value);

    if (updateError) {
      console.error("❌ Error updating project title:", updateError);
      return;
    }

    // 🟢 Update the project title safely
    project.value = { ...project.value, title: editTitle.value }; 
    // Spread `project.value` to create a new reference and update the title

    closeDialog(); // Close dialog after successful save
    console.log("✅ Project title updated successfully.");
  } catch (err) {
    console.error("❌ Unexpected error updating project title:", err);
  }
};


const deleteProject = async (projectId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this project? This action cannot be undone."
  );

  if (!confirmed) return;

  try {
    const { error: deleteMembersError } = await supabase
      .from("project_members")
      .delete()
      .eq("project_id", projectId);
      navigateTo('/projects');
    if (deleteMembersError) {
      console.error("Error deleting associated project members:", deleteMembersError);
      return;
    }

    const { error: deleteProjectError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (deleteProjectError) {
      console.error("Error deleting project:", deleteProjectError);
      return;
    }

    projects.value = projects.value.filter((p) => p.id !== projectId);
    console.log("Project and associated members deleted successfully.");
  } catch (err) {
    console.error("Unexpected error deleting project:", err);
  }
};

</script>
