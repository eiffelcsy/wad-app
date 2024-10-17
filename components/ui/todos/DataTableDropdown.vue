<script setup lang="ts">
import { MoreHorizontal } from 'lucide-vue-next'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const supabase = useSupabaseClient();

defineProps<{
  todo: {
    id: string
    title: string
    status: string
  }
}>()

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
function editTask(todoId: string) {
  console.log(`Editing task ${todoId}`)
  // Implement your edit logic here
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
      <DropdownMenuItem @click="editTask(todo.id)">
        Edit
      </DropdownMenuItem>
      <DropdownMenuItem @click="deleteTask(todo.id)">
        Delete
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
