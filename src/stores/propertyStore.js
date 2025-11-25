import { defineStore } from 'pinia';
import api from '@/api/axios';
import { ref } from 'vue';

export const usePropertyStore = defineStore('property', () => {
    const properties = ref([]);
    const currentProperty = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // Dynamic lists (dropdowns)
    const areas = ref([]);
    const malls = ref([]);
    const communities = ref([]);
    const types = ref([]);
    const phases = ref([]);

    /**
     * Fetch all dynamic lists (dropdowns)
     */
    const fetchDynamicLists = async () => {
        try {
            const [areasRes, mallsRes, communitiesRes, typesRes, phasesRes] = await Promise.all([
                api.get('/dynamic-lists/category/area'),
                api.get('/dynamic-lists/category/mall'),
                api.get('/dynamic-lists/category/community'),
                api.get('/dynamic-lists/category/type'),
                api.get('/dynamic-lists/category/phase')
            ]);

            areas.value = areasRes.data;
            malls.value = mallsRes.data;
            communities.value = communitiesRes.data;
            types.value = typesRes.data;
            phases.value = phasesRes.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch dropdown data';
            throw err;
        }
    };

    /**
     * Fetch all properties
     */
    const fetchProperties = async (filters = {}) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get('/properties', { params: filters });
            properties.value = response.data;
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch properties';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Fetch single property
     */
    const fetchProperty = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get(`/properties/${id}`);
            currentProperty.value = response.data;
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to fetch property';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Create property
     */
    const createProperty = async (data) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post('/properties', data);
            properties.value.unshift(response.data);
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to create property';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Update property
     */
    const updateProperty = async (id, data) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.put(`/properties/${id}`, data);
            const index = properties.value.findIndex(p => p.id === id);
            if (index !== -1) {
                properties.value[index] = response.data;
            }
            currentProperty.value = response.data;
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to update property';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Delete property
     */
    const deleteProperty = async (id) => {
        loading.value = true;
        error.value = null;
        try {
            await api.delete(`/properties/${id}`);
            properties.value = properties.value.filter(p => p.id !== id);
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to delete property';
            throw err;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Upload gallery images
     */
    const uploadGallery = async (propertyId, files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        try {
            const response = await api.post(`/properties/${propertyId}/gallery`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to upload images';
            throw err;
        }
    };

    /**
     * Delete gallery image
     */
    const deleteGalleryImage = async (propertyId, imageId) => {
        try {
            await api.delete(`/properties/${propertyId}/gallery/${imageId}`);
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to delete image';
            throw err;
        }
    };

    /**
     * Set primary image
     */
    const setPrimaryImage = async (propertyId, imageId) => {
        try {
            await api.patch(`/properties/${propertyId}/gallery/${imageId}/set-primary`);
        } catch (err) {
            error.value = err.response?.data?.message || 'Failed to set primary image';
            throw err;
        }
    };

    return {
        properties,
        currentProperty,
        loading,
        error,
        areas,
        malls,
        communities,
        types,
        phases,
        fetchDynamicLists,
        fetchProperties,
        fetchProperty,
        createProperty,
        updateProperty,
        deleteProperty,
        uploadGallery,
        deleteGalleryImage,
        setPrimaryImage
    };
});
