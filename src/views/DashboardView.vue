<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-700">Welcome back, {{ user?.username }}!</h2>
    <div class="mt-4">
      <p class="text-gray-600">You are logged in as: <span class="font-medium">{{ user?.role }}</span></p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>
