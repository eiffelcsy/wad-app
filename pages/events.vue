<template>
  <div>
    Events Page for {{ user }}
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp();

const {
  data: { user },
} = await $supabase.auth.getUser();

</script>
