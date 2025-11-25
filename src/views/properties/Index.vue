<template>
  <div>
    <CrudList
      title="Properties"
      :items="items"
      :columns="columns"
      @create="showCreateForm"
      @edit="showEditForm"
      @delete="deleteItem"
    />

    <div v-if="showForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="relative w-full max-w-md">
        <CrudForm
          title="Properties"
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

const columns = [{"key":"title","label":"Title"},{"key":"price","label":"Price"},{"key":"status","label":"Status"}];
const fields = [{"key":"title","label":"Title","required":true},{"key":"address","label":"Address","type":"textarea"},{"key":"price","label":"Price","type":"number"}];

const fetchItems = async () => {
  try {
    const response = await api.get('/properties');
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
      await api.put(`/properties/${selectedItem.value.id}`, formData);
    } else {
      await api.post('/properties', formData);
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
      await api.delete(`/properties/${id}`);
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
};

onMounted(fetchItems);
</script>
