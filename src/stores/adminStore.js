import { defineStore } from 'pinia';
import api from '@/api/axios';
import { ref } from 'vue';

export const useAdminStore = defineStore('admin', () => {
    const tables = ref([]);
    const currentTable = ref(null);
    const items = ref([]);
    const currentItem = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // Fetch allowed tables
    const fetchTables = async () => {
        try {
            const response = await api.get('/admin/dropdown/tables');
            tables.value = response.data;
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch tables';
            throw err;
        }
    };

    // Fetch all items from a dropdown table
    const fetchItems = async (tableName) => {
        loading.value = true;
        error.value = null;
        currentTable.value = tableName;
        try {
            const response = await api.get(`/admin/dropdown/${tableName}`);
            items.value = response.data;
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch items';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Fetch single item
    const fetchItem = async (tableName, id) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get(`/admin/dropdown/${tableName}/${id}`);
            currentItem.value = response.data;
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch item';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Create new item
    const createItem = async (tableName, data) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post(`/admin/dropdown/${tableName}`, data);
            items.value.unshift(response.data);
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to create item';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Update item
    const updateItem = async (tableName, id, data) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.put(`/admin/dropdown/${tableName}/${id}`, data);
            const index = items.value.findIndex(item => item.id === id);
            if (index !== -1) {
                items.value[index] = response.data;
            }
            currentItem.value = response.data;
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to update item';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Delete item
    const deleteItem = async (tableName, id) => {
        loading.value = true;
        error.value = null;
        try {
            await api.delete(`/admin/dropdown/${tableName}/${id}`);
            items.value = items.value.filter(item => item.id !== id);
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to delete item';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    // Toggle active status
    const toggleActive = async (tableName, id) => {
        try {
            const response = await api.patch(`/admin/dropdown/${tableName}/${id}/toggle-active`);
            const index = items.value.findIndex(item => item.id === id);
            if (index !== -1) {
                items.value[index] = response.data;
            }
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to toggle active';
            throw err;
        }
    };

    return {
        tables,
        currentTable,
        items,
        currentItem,
        loading,
        error,
        fetchTables,
        fetchItems,
        fetchItem,
        createItem,
        updateItem,
        deleteItem,
        toggleActive
    };
});
