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

const supabase = useSupabaseClient();
const isDialogOpen = ref(false);
const editForm = ref({
  title: '',
  status: '',
  assigned_to: '',
});
const selectedMember = ref({name: ""});
const teamMembers = ref([]);


defineProps<{
  todo: {
    id: string
    title: string
    status: string
    assigned_to: string
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
    .select('name, user_id') // take the name and ID in project_members out
    .eq('project_id', projectId); 

    if (error) {
    console.error('Error fetching team members:', error);
    teamMembers.value = [];
  } else {
    teamMembers.value = data || [];
  }
  console.log("all team members: " + teamMembers.value)
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
    console.log(`Task ${todoId} status updated to ${newStatus}`)
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
    console.log(`Task ${todoId} deleted successfully`)
    window.location.reload();
  }
}

// Function to edit task (you can expand this based on your needs)
async function editTask(todo: { id: string; title: string; status: string; assigned_to: string }) {
  console.log("editing!!")
  editForm.value = { ...todo } // Populate the form with the task data

  const projectId = await fetchProjectId(todo.id);
  if (projectId) {
    await fetchTeamMembers(projectId);
  }
  console.log("Todo ID:", todo.id); // Check `id` - correct
  console.log("Project ID:", projectId); // Check `projectId` - correct
  console.log("Todo object:", todo);

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
  console.log('selected member is: '+ selectedMember.value);
  editForm.value.assigned_to = selectedMember.value;
  const { error } = await supabase
    .from('todos')
    .update({
      title: editForm.value.title,
      status: editForm.value.status,
      assigned_to: editForm.value.assigned_to,
    })
    .eq('id', editForm.value.id)

  if (error) {
    console.error('Error updating task:', error)
  } else {
    console.log(`Task ${editForm.value.id} updated successfully`)
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


  <div
    v-if="isDialogOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-black rounded-lg p-6 w-full max-w-md mx-4 shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Edit Task</h2>
      <form @submit.prevent="saveChanges">

        <!-- Title Input -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium">Title</label>
          <input
            id="title"
            v-model="editForm.title"
            type="text"
            class="border border-gray-300 rounded p-2 w-full bg-black text-white"
            required
          />
        </div>

        <!-- Change assigned member -->
        <Select v-model="selectedMember">
          <label for="member" class="block text-sm font-medium bg-black text-white">Assigned member</label>
          <SelectTrigger>
            <span v-if="selectedMember">
              {{ teamMembers.find(member => member.user_id === selectedMember)?.name || "Select a member" }}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Members</SelectLabel>
                <SelectItem v-for="member in teamMembers" :key="member.user_id" :value="member.user_id">
                  {{ member.name }} 
                </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <!-- Save and Close Buttons -->
        <div class="flex justify-end gap-2">
          <Button @click="isDialogOpen = false" variant="secondary">Cancel</Button>
          <Button @click="saveChanges()" type="submit" variant="primary">Save Changes</Button>
        </div>
      </form>
    </div>
  </div>
</template>

