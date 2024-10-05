<!-- TODO: Projects homepage, include create, edit and delete buttons for each project, maybe in a table -->
<template>
  <div>
    <div>
      <PageHeader/>
    </div>
    Projects Page for {{ user }}
  </div>
</template>

<script lang="ts" setup>
import { useNuxtApp } from 'nuxt/app';
import { ref } from 'vue';
import PageHeader from '../components/ui/page-header/PageHeader.vue';

const user = useSupabaseUser();

const displayName = ref(user.value.user_metadata.name);
const email = ref(user.value.email);
</script>

<style></style>