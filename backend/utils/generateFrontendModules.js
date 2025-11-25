const fs = require('fs');
const path = require('path');

const modules = [
    { name: 'properties', columns: [{ key: 'title', label: 'Title' }, { key: 'price', label: 'Price' }, { key: 'status', label: 'Status' }], fields: [{ key: 'title', label: 'Title', required: true }, { key: 'address', label: 'Address', type: 'textarea' }, { key: 'price', label: 'Price', type: 'number' }] },
    { name: 'leads', columns: [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'status', label: 'Status' }], fields: [{ key: 'name', label: 'Name', required: true }, { key: 'email', label: 'Email', type: 'email' }, { key: 'phone', label: 'Phone' }] },
    { name: 'agents', columns: [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' }], fields: [{ key: 'name', label: 'Name', required: true }, { key: 'email', label: 'Email', type: 'email' }, { key: 'license_number', label: 'License Number' }] },
    { name: 'companies', columns: [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }], fields: [{ key: 'name', label: 'Name', required: true }, { key: 'email', label: 'Email', type: 'email' }, { key: 'address', label: 'Address', type: 'textarea' }] },
    { name: 'tasks', columns: [{ key: 'title', label: 'Title' }, { key: 'status', label: 'Status' }, { key: 'due_date', label: 'Due Date' }], fields: [{ key: 'title', label: 'Title', required: true }, { key: 'description', label: 'Description', type: 'textarea' }, { key: 'due_date', label: 'Due Date', type: 'date' }] }
];

const frontendPath = path.join(__dirname, '../../src/views');

modules.forEach(mod => {
    const dir = path.join(frontendPath, mod.name);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const capitalized = mod.name.charAt(0).toUpperCase() + mod.name.slice(1);

    // Index.vue (List)
    const indexContent = `<template>
  <div>
    <CrudList
      title="${capitalized}"
      :items="items"
      :columns="columns"
      @create="showCreateForm"
      @edit="showEditForm"
      @delete="deleteItem"
    />

    <div v-if="showForm" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div class="relative w-full max-w-md">
        <CrudForm
          title="${capitalized}"
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

const columns = ${JSON.stringify(mod.columns)};
const fields = ${JSON.stringify(mod.fields)};

const fetchItems = async () => {
  try {
    const response = await api.get('/${mod.name}');
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
      await api.put(\`/${mod.name}/\${selectedItem.value.id}\`, formData);
    } else {
      await api.post('/${mod.name}', formData);
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
      await api.delete(\`/${mod.name}/\${id}\`);
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
};

onMounted(fetchItems);
</script>
`;
    fs.writeFileSync(path.join(dir, 'Index.vue'), indexContent);
    console.log(`Generated frontend files for ${mod.name}`);
});
