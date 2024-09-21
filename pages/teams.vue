<!-- TODO: Teams homepage, include create, edit and delete buttons for each team, maybe in a table -->
<template>
  <div>
    Teams page for {{ user }}
  </div>
</template>

<script lang="ts" setup>
const { $supabase } = useNuxtApp();

const {
  data: { user },
} = await $supabase.auth.getUser();
</script>

<style></style>