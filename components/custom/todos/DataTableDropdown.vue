<script setup lang="ts">
import { ref } from "vue";
import { MoreHorizontal } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'

const supabase = useSupabaseClient();
const isDialogOpen = ref(false);
const editForm = ref({
  title: '',
  status: '',
  assigned_to: '',
  assignee_name: '',
});
const selectedMember = ref({ assignee_name: "", assigned_to: "" });
const teamMembers = ref([]);


defineProps<{
  todo: {
    id: string
    title: string
    status: string
    assigned_to: string
    assignee_name: string
    projectId: string
  }
}>()

// first get the project id this todo task is in
async function fetchProjectId(todoId) {
  const { data, error } = await supabase
    .from('todos')
    .select('project_id')
    .eq('id', todoId)
    .single();
    

  if (error) {
    console.error('Error fetching project ID:', error);
    return null;

  }

  return data?.project_id || null;
  
}


async function fetchTeamMembers(projectId) {
  const { data, error } = await supabase
    .from('project_members') 
    .select('user_id, name') // take the name and ID in project_members out
    .eq('project_id', projectId); 

    if (error) {
    console.error('Error fetching team members:', error);
    teamMembers.value = [];
  } else {
    teamMembers.value = data || [];
  }
} 


async function toggleTaskStatus(todoId: string, currentStatus: string) {
  const newStatus = currentStatus === 'completed' ? 'pending' : 'completed'

  const { error } = await supabase
    .from('todos')
    .update({ status: newStatus })
    .eq('id', todoId)

  if (error) {
    console.error('Error updating task status:', error)
  } else {
    // console.log(`Task ${todoId} status updated to ${newStatus}`)
    // You might want to refetch data or update local state here after the status update
  }
}

// Function to delete the task
async function deleteTask(todoId: string) {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', todoId)

  if (error) {
    console.error('Error deleting task:', error)
  } else {
    // console.log(`Task ${todoId} deleted successfully`)
    window.location.reload();
  }
}

// Function to edit task (you can expand this based on your needs)
async function editTask(todo: { id: string; title: string; status: string; assigned_to: string }) {
  editForm.value = { ...todo } // Populate the form with the task data

  const projectId = await fetchProjectId(todo.id);
  if (projectId) {
    await fetchTeamMembers(projectId);
  }

  // Pre-select the assigned member based on their name from the todo's `assigned_to`
  // selectedMember.value = teamMembers.value.find((member) => member.name === todo.assigned_to) || { name: "" };
  // selectedMember.value = teamMembers.value.find((member) => member === todo.assigned_to) || "";
  isDialogOpen.value = true
}


// Function to save changes to edit
async function saveChanges() {
  // Prevent saving if no valid member is selected
  if (!selectedMember.value) {
    console.error("No member selected.");
    return; 
  }
  // Sync selected member
  editForm.value.assigned_to = selectedMember.value.assigned_to;
  editForm.value.assignee_name = selectedMember.value.assignee_name;
  const { error } = await supabase
    .from('todos')
    .update({
      title: editForm.value.title,
      status: editForm.value.status,
      assigned_to: editForm.value.assigned_to,
      assignee_name: editForm.value.assignee_name
    })
    .eq('id', editForm.value.id)

  if (error) {
    console.error('Error updating task:', error)
  } else {
    // console.log(`Task ${editForm.value.id} updated successfully`)
    isDialogOpen.value = false // Close the dialog after saving
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="toggleTaskStatus(todo.id, todo.status)">
        <!-- Show Mark as Incomplete or Completed based on task status -->
        {{ todo.status === 'completed' ? 'Mark as Incomplete' : 'Mark as Completed' }}
      </DropdownMenuItem>
      <DropdownMenuItem @click="editTask(todo)">
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem @click="deleteTask(todo.id)">
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>


  <Dialog v-model:open="isDialogOpen">
    <DialogOverlay />
    <DialogContent class="bg-white dark:bg-black rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
      <DialogHeader>
        <DialogTitle>Edit Task</DialogTitle>
      </DialogHeader>
        <!-- Title Input -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium">Title</label>
          <Input
            id="title"
            v-model="editForm.title"
            type="text"
            placeholder="Enter Title"
            required
          />
        </div>

        <!-- Change assigned member -->
        <div class="mb-4">
          <label for="member" class="block text-sm font-medium">Assigned Member</label>
          <Select id="member" v-model="selectedMember">
            <SelectTrigger>
              <SelectValue placeholder="Select a member">{{ selectedMember ? selectedMember.assignee_name : 'Select an option' }}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Members</SelectLabel>
                <SelectItem
                  v-for="member in teamMembers"
                  :key="member.user_id"
                  :value="{assigned_to: member.user_id, assignee_name: member.name}"
                >
                  {{ member.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <!-- Save and Close Buttons -->
        <DialogFooter class="flex justify-end gap-2">
          <DialogClose>Cancel</DialogClose>
          <Button @click="saveChanges" class="bg-indigo-600 hover:bg-indigo-700 text-white">Save Changes</Button>
        </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

