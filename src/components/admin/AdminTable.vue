<template>
  <div class="bg-white rounded-lg shadow">
    <!-- Search -->
    <div class="p-4 border-b">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="w-full md:w-64 border rounded px-3 py-2"
      />
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage Count</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm">{{ item.id }}</td>
            <td class="px-6 py-4 text-sm font-medium">{{ item.name }}</td>
            <td class="px-6 py-4 text-sm">
              <button
                @click="$emit('toggle-active', item.id)"
                :class="item.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                class="px-2 py-1 rounded text-xs font-semibold cursor-pointer hover:opacity-80"
              >
                {{ item.active ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td class="px-6 py-4 text-sm">
              <span :class="item.usage_count > 0 ? 'text-blue-600 font-semibold' : 'text-gray-400'">
                {{ item.usage_count }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ formatDate(item.updated_at) }}
            </td>
            <td class="px-6 py-4 text-sm text-right space-x-2">
              <button
                v-if="canUpdate"
                @click="$emit('edit', item)"
                class="text-yellow-600 hover:text-yellow-900"
              >
                Edit
              </button>
              <button
                v-if="canDelete"
                @click="$emit('delete', item)"
                :disabled="item.usage_count > 0"
                :class="item.usage_count > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:text-red-900'"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredItems.length === 0" class="p-8 text-center text-gray-500">
      No items found
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: Array,
  canUpdate: Boolean,
  canDelete: Boolean
});

defineEmits(['toggle-active', 'edit', 'delete']);

const searchQuery = ref('');

const filteredItems = computed(() => {
  if (!searchQuery.value) return props.items;
  return props.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};
</script>
