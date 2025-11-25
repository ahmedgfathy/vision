<template>
  <div>
    <CrudList
      title="Tasks"
      :items="items"
      :columns="columns"
      @create="showCreateForm"
      @edit="showEditForm"
      @delete="deleteItem"
    />

    <div v-if="showForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="relative w-full max-w-md">
        <CrudForm
          title="Tasks"
          :fields="fields"
          :initialData="selectedItem"
          :isEdit="!!selectedItem"
          @submit="handleSubmit"
          @cancel="closeForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CrudList from '@/components/crud/CrudList.vue';
import CrudForm from '@/components/crud/CrudForm.vue';
import api from '@/api/axios';

const items = ref([]);
const showForm = ref(false);
const selectedItem = ref(null);

const columns = [{"key":"title","label":"Title"},{"key":"status","label":"Status"},{"key":"due_date","label":"Due Date"}];
const fields = [{"key":"title","label":"Title","required":true},{"key":"description","label":"Description","type":"textarea"},{"key":"due_date","label":"Due Date","type":"date"}];

const fetchItems = async () => {
  try {
    const response = await api.get('/tasks');
    items.value = response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
  }
};

const showCreateForm = () => {
  selectedItem.value = null;
  showForm.value = true;
};

const showEditForm = (item) => {
  selectedItem.value = item;
  showForm.value = true;
};

const closeForm = () => {
  showForm.value = false;
  selectedItem.value = null;
};

const handleSubmit = async (formData) => {
  try {
    if (selectedItem.value) {
      await api.put(`/tasks/${selectedItem.value.id}`, formData);
    } else {
      await api.post('/tasks', formData);
    }
    await fetchItems();
    closeForm();
  } catch (error) {
    console.error('Error saving item:', error);
  }
};

const deleteItem = async (id) => {
  if (confirm('Are you sure?')) {
    try {
      await api.delete(`/tasks/${id}`);
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
};

onMounted(fetchItems);
</script>
