<template>
  <div>
    <h2>Todo List</h2>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <Checkbox v-model="todo.status" @update:checked="toggleStatus(todo)" />
        <span :class="{ completed: todo.status === 'completed' }">{{
          todo.title
        }}</span>
      </li>
    </ul>
    <form @submit.prevent="addTodo">
      <div class="flex flex-row">
        <Input v-model="newTodo" placeholder="New todo" class="w-5/6" />
        <Button type="submit" class="ml-2">Add</Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const supabase = useSupabaseClient();
const todos = ref([]);
const newTodo = ref("");

const fetchTodos = async () => {
  let { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("project_id", props.projectId);

  if (!error) {
    todos.value = data;
  }
};

const addTodo = async () => {
  if (newTodo.value.trim() === "") return;

  const { data, error } = await supabase
    .from("todos")
    .insert([
      { title: newTodo.value, project_id: props.projectId, status: "pending" },
    ])
    .select();

  if (!error) {
    todos.value.push(data[0]);
    newTodo.value = "";
  }
};

const toggleStatus = async (todo) => {
  const newStatus = todo.status === "completed" ? "pending" : "completed";

  await supabase.from("todos").update({ status: newStatus }).eq("id", todo.id);

  todo.status = newStatus;
};

onMounted(() => {
  fetchTodos();

  const subscription = supabase
    .channel("todos")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "todos",
        filter: `project_id=eq.${props.projectId}`,
      },
      (payload) => {
        fetchTodos();
      }
    )
    .subscribe();

  return () => {
    supabase.removeSubscription(subscription);
  };
});
</script>

<style scoped>
.completed {
  text-decoration: line-through;
}
</style>
