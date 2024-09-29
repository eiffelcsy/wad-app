<!-- TODO: Projects homepage, include create, edit and delete buttons for each project, maybe in a table -->
<template>
  <div>
    <div>
      <Header/>
    </div>
    Projects Page for {{ user }}
  </div>
</template>

<script lang="ts" setup>
import { useNuxtApp } from 'nuxt/app';
import { ref } from 'vue';
import Header from '../components/ui/header/header.vue';

const { $supabase } = useNuxtApp();

const displayName = ref("");
const email = ref("");

const {
  data: { user },
} = await $supabase.auth.getUser();

if (user) {
  email.value = user.email;
  displayName.value = user.user_metadata.name;
}
</script>

<style></style>