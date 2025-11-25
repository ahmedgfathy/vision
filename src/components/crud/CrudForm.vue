<template>
  <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <h3 class="text-xl font-semibold mb-4">{{ isEdit ? 'Edit' : 'Create' }} {{ title }}</h3>
    <form @submit.prevent="handleSubmit">
      <div v-for="field in fields" :key="field.key" class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" :for="field.key">
          {{ field.label }}
        </label>
        <input
          v-if="field.type !== 'textarea'"
          :id="field.key"
          :type="field.type || 'text'"
          v-model="formData[field.key]"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :required="field.required"
        >
        <textarea
          v-else
          :id="field.key"
          v-model="formData[field.key]"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          :required="field.required"
        ></textarea>
      </div>
      <div class="flex items-center justify-between">
        <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          {{ isEdit ? 'Update' : 'Create' }}
        </button>
        <button @click="$emit('cancel')" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
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
  fields: Array,
  initialData: Object,
  isEdit: Boolean
});

const emit = defineEmits(['submit', 'cancel']);

const formData = ref({});

watch(() => props.initialData, (newVal) => {
  if (newVal) {
    formData.value = { ...newVal };
  } else {
    formData.value = {};
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('submit', formData.value);
};
</script>
