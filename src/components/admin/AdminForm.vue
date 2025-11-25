<template>
  <div class="bg-white p-6 rounded-lg shadow">
    <h3 class="text-lg font-semibold mb-4">{{ isEdit ? 'Edit' : 'Create' }} {{ title }}</h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-1">Name *</label>
        <input
          v-model="formData.name"
          required
          class="w-full border rounded px-3 py-2"
          placeholder="Enter name"
        />
      </div>

      <div class="flex items-center">
        <input
          v-model="formData.active"
          type="checkbox"
          class="mr-2"
        />
        <label class="text-sm font-medium">Active</label>
      </div>

      <div class="flex gap-4">
        <button
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          {{ isEdit ? 'Update' : 'Create' }}
        </button>
        <button
          type="button"
          @click="$emit('cancel')"
          class="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors shadow-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  title: String,
  initialData: Object,
  isEdit: Boolean
});

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({
  name: '',
  active: true
});

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    formData.value = { ...formData.value, ...newVal };
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
