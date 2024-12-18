<template>
  <div>
    <PageHeader />
    <div class="min-h-screen bg-white dark:bg-black">
      <div
        class="py-6 md:py-8 mx-auto container xl:w-[1200px] relative flex justify-between"
      >
        <h1
          class="text-3xl lg:text-4xl text-zinc-800 dark:text-zinc-100 font-semibold"
        >
          {{ project.title }}
        </h1>
        <div class="flex gap-2 align-middle">
          <!-- Edit Icon Button -->
          <Button
            @click="startEditing(project.id, project.title)"
            class="text-zinc-400"
            variant="outline"
            size="icon"
          >
            <Edit class="size-5" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button
                size="icon"
                class="border border-red-200 dark:border-red-900 bg-red-700 text-white hover:bg-red-900"
              >
                <Trash2 class="size-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle
                  >Are you sure you want to delete this project?</AlertDialogTitle
                >
                <AlertDialogDescription>
                  This action cannot be undone. Once deleted, the project will be
                  permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  class="bg-red-700 text-white hover:bg-red-900"
                  @click="() => deleteProject(project.id)"
                  >Delete</AlertDialogAction
                >
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
            A visual timeline of tasks and milestones over time. Hover over task
            bars to view full details.
          </p>
        </div>
        <Button
          v-if="isMobile"
          @click="toggleLandscape"
          variant="outline"
          class="h-8"
        >
          {{ isLandscape ? "Portrait View" : "Landscape View" }}
        </Button>
        <div class="content-wrapper">
          <GanttChart class="w-full" :projectId="projectId" />
          <div v-show="isLandscape" class="overlay">
            <div class="overlay-content">
              <button @click="closeOverlay" class="close-button">X</button>
              <div class="landscape-wrapper">
                <GanttChart class="w-full" :projectId="projectId" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PageFooter />

    <!-- Edit Form using Dialog components -->
    <Dialog v-model:open="isDialogOpen">
      <DialogContent
        class="bg-white dark:bg-black rounded-lg p-6 w-full max-w-md mx-4 shadow-lg"
      >
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium">Title</label>
          <Input
            id="title"
            v-model="editTitle"
            type="text"
            placeholder="Enter Title"
            required
          />
        </div>

        <DialogFooter class="flex justify-end gap-2">
          <DialogClose> Cancel </DialogClose>
          <Button @click="saveProjectTitle" class="bg-indigo-600 hover:bg-indigo-700 text-white"
            >Save Changes</Button
          >
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
import { Edit, Trash2 } from "lucide-vue-next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@vueuse/core";

const route = useRoute();
const projectId = route.params["projectId"];
const project = ref({});
const projects = ref([]);
const supabase = useSupabaseClient();
const editingProjectId = ref(null);
const editTitle = ref("");
const isDialogOpen = ref(false);
const isLandscape = ref(false);
const isMobile = useMediaQuery("(max-width: 600px)");

const toggleLandscape = async () => {
  isLandscape.value = !isLandscape.value;
  console.log("Toggling landscape view:", isLandscape.value); // Check if this gets logged
};

const closeOverlay = async () => {
  isLandscape.value = !isLandscape.value;
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

const saveProjectTitle = async () => {
  if (!editingProjectId.value) {
    console.error("No project ID set for editing.");
    return;
  }

  try {
    const { error: updateError } = await supabase
      .from("projects")
      .update({ title: editTitle.value }) // Update database
      .eq("id", editingProjectId.value);

    if (updateError) {
      console.error("Error updating project title:", updateError);
      return;
    }

    project.value = { ...project.value, title: editTitle.value };
    // Spread `project.value` to create a new reference and update the title

    isDialogOpen.value = false; // Close dialog after successful save
  } catch (err) {
    console.error("Unexpected error updating project title:", err);
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
      navigateTo("/projects");
    if (deleteMembersError) {
      console.error(
        "Error deleting associated project members:",
        deleteMembersError
      );
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
  } catch (err) {
    console.error("Unexpected error deleting project:", err);
  }
};
</script>

<style scoped>
/* Container that holds the rotated content */
.content-wrapper {
  position: relative;
  width: 90%;
  height: 90%;
}

/* Overlay styling */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent background */
  z-index: 999; /* Ensure it appears above other content */
}

/* Overlay content */
.overlay-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 100%;
  max-height: 100%;
  overflow-y: hidden;
  text-align: center;
  align-items: center;
  position: relative;

}

.landscape-wrapper {
  transform: rotate(90deg); /* Rotate the chart 90 degrees */
  transform-origin: center center; /* Ensure it rotates around the center */
  width: 100vw; /* Height of viewport becomes the width in landscape */
  height: 100vh; /* Width of viewport becomes the height in landscape */
}

/* Close button for overlay */
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  z-index: 9999;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.2s ease-in-out;
}

/* Disable scrolling when in landscape view */
/* body,
html {
  margin: 0;
  padding: 0;
  overflow: hidden; /* Prevent page scroll when in landscape mode */
  /* height: 100%;
} */ 
</style>
