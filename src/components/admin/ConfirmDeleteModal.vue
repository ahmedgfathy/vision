<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
    <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-lg font-semibold mb-4">Confirm Delete</h3>
      
      <div v-if="usageCount > 0" class="mb-4 p-4 bg-red-50 border border-red-200 rounded">
        <p class="text-red-800 text-sm font-semibold">⚠️ Cannot Delete</p>
        <p class="text-red-700 text-sm mt-2">
          This item is currently used in <strong>{{ usageCount }}</strong> {{ usageCount === 1 ? 'property' : 'properties' }}.
        </p>
        <p class="text-red-600 text-sm mt-2">
          Please remove all references before deleting.
        </p>
      </div>

      <div v-else class="mb-4">
        <p class="text-gray-700">
          Are you sure you want to delete <strong>{{ itemName }}</strong>?
        </p>
        <p class="text-sm text-gray-500 mt-2">
          This action cannot be undone.
        </p>
      </div>

      <div class="flex gap-4">
        <button
          v-if="usageCount === 0"
          @click="$emit('confirm')"
          class="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete
        </button>
        <button
          @click="$emit('cancel')"
          class="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          {{ usageCount > 0 ? 'Close' : 'Cancel' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  itemName: String,
  usageCount: {
    type: Number,
    default: 0
  }
});

defineEmits(['confirm', 'cancel']);
</script>
