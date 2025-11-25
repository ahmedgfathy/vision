<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Admin Settings</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <router-link
        v-for="table in tables"
        :key="table.id"
        :to="`/dashboard/admin/settings/${table.id}`"
        class="bg-white p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
      >
        <h3 class="text-lg font-semibold mb-2">{{ table.name }}</h3>
        <p class="text-gray-600 text-sm">Manage {{ table.name.toLowerCase() }} dropdown</p>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import { storeToRefs } from 'pinia';

const adminStore = useAdminStore();
const { tables } = storeToRefs(adminStore);

onMounted(async () => {
  await adminStore.fetchTables();
});
</script>
