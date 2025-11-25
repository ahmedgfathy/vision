<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">{{ tableTitle }}</h1>
        <p class="text-gray-600">Manage {{ tableTitle.toLowerCase()}} dropdown items</p>
      </div>
      <button
        v-if="canCreate"
        @click="showCreateModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        + Add New
      </button>
    </div>

    <div v-if="error" class="bg-red-50 border border-red-200 rounded p-4 mb-6">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Loading...</p>
    </div>

    <AdminTable
      v-else-if="items && items.length > 0"
      :items="items"
      :can-update="canUpdate"
      :can-delete="canDelete"
      @toggle-active="handleToggleActive"
      @edit="handleEdit"
      @delete="handleDeleteClick"
    />

    <div v-else class="bg-white rounded-lg shadow p-8 text-center text-gray-500">
      <p>No items found. Click "Add New" to create one.</p>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="relative w-full max-w-md">
        <AdminForm
          :title="tableTitle"
          :is-edit="showEditModal"
          :initial-data="selectedItem"
          @submit="handleSubmit"
          @cancel="closeModals"
        />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmDeleteModal
      :show="showDeleteModal"
      :item-name="selectedItem?.name"
      :usage-count="selectedItem?.usage_count || 0"
      @confirm="handleDeleteConfirm"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAdminStore } from '@/stores/adminStore';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import { storeToRefs } from 'pinia';
import AdminTable from '@/components/admin/AdminTable.vue';
import AdminForm from '@/components/admin/AdminForm.vue';
import ConfirmDeleteModal from '@/components/admin/ConfirmDeleteModal.vue';

const route = useRoute();
const adminStore = useAdminStore();
const authStore = useAuthStore();
const toast = useToast();

const { items, loading, error } = storeToRefs(adminStore);

const tableName = computed(() => route.params.table);
const tableTitle = computed(() => {
  return tableName.value?.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || '';
});

const canCreate = computed(() => authStore.user?.role === 'admin');
const canUpdate = computed(() => authStore.user?.role === 'admin');
const canDelete = computed(() => authStore.user?.role === 'admin');

const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedItem = ref(null);

const handleToggleActive = async (id) => {
  try {
    await adminStore.toggleActive(tableName.value, id);
    toast.success('Status updated successfully!');
  } catch (error) {
    toast.error('Failed to toggle status: ' + error.message);
  }
};

const handleEdit = (item) => {
  selectedItem.value = item;
  showEditModal.value = true;
};

const handleDeleteClick = (item) => {
  selectedItem.value = item;
  showDeleteModal.value = true;
};

const handleSubmit = async (data) => {
  try {
    if (showEditModal.value) {
      await adminStore.updateItem(tableName.value, selectedItem.value.id, data);
      toast.success('Item updated successfully!');
    } else {
      await adminStore.createItem(tableName.value, data);
      toast.success('Item created successfully!');
    }
    closeModals();
    await adminStore.fetchItems(tableName.value);
  } catch (error) {
    toast.error('Failed to save: ' + error.message);
  }
};

const handleDeleteConfirm = async () => {
  try {
    await adminStore.deleteItem(tableName.value, selectedItem.value.id);
    toast.success('Item deleted successfully!');
    showDeleteModal.value = false;
    selectedItem.value = null;
  } catch (error) {
    toast.error('Failed to delete: ' + error.message);
  }
};

const closeModals = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  selectedItem.value = null;
};

onMounted(async () => {
  if (tableName.value) {
    try {
      await adminStore.fetchItems(tableName.value);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    }
  }
});
</script>
