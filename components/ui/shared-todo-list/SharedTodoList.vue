<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { columns } from '@/components/ui/todos/columns.ts'
import type { Todo } from '../todos/columns.ts' 
import { DataTable } from '@/components/ui/todos/'

const supabase = useSupabaseClient();

const data = ref<Todo[]>([])

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

// Define a function to fetch todos from the Supabase database
async function getTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .eq('project_id', props.projectId) // Replace with the actual project_id dynamically

  if (error) {
    console.error('Error fetching todos:', error)
    return []
  }

  return data || [] // Return the todos data or an empty array if none
}

onMounted(async () => {
  data.value = await getTodos() // Fetch todos on mount and update the data
})
</script>

<template>
  <div class="w-full mx-auto">
    <DataTable :columns="columns" :data="data" /> <!-- Pass columns and data to the DataTable -->
  </div>
</template>
