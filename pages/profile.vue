<template>
  <div>
    Profile Page for {{ user }}
  </div>
</template>

<script lang="ts" setup>

const { $supabase } = useNuxtApp();

const {
  data: { user },
} = await $supabase.auth.getUser();
</script>
