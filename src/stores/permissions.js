import { defineStore } from 'pinia';
import axios from '@/api/axios';

export const usePermissionStore = defineStore('permissions', {
  state: () => ({
    modules: {}, // Module-level permissions
    fields: {}, // Field-level permissions
    loaded: false,
    loading: false
  }),

  getters: {
    /**
     * Check if user has module permission
     */
    hasModulePermission: (state) => (moduleName, action) => {
      const modulePerms = state.modules[moduleName];
      if (!modulePerms) return false;
      return modulePerms[action] || false;
    },

    /**
     * Check if user can view a field
     */
    canViewField: (state) => (moduleName, fieldName) => {
      const moduleFields = state.fields[moduleName];
      if (!moduleFields || !moduleFields[fieldName]) return false;
      return moduleFields[fieldName].view || false;
    },

    /**
     * Check if user can edit a field
     */
    canEditField: (state) => (moduleName, fieldName) => {
      const moduleFields = state.fields[moduleName];
      if (!moduleFields || !moduleFields[fieldName]) return false;
      return moduleFields[fieldName].edit || false;
    },

    /**
     * Get visible modules for navigation
     */
    visibleModules: (state) => {
      return Object.keys(state.modules).filter(
        moduleName => state.modules[moduleName].view
      );
    },

    /**
     * Get visible fields for a module
     */
    visibleFields: (state) => (moduleName) => {
      const moduleFields = state.fields[moduleName];
      if (!moduleFields) return [];
      return Object.keys(moduleFields).filter(
        fieldName => moduleFields[fieldName].view
      );
    },

    /**
     * Get editable fields for a module
     */
    editableFields: (state) => (moduleName) => {
      const moduleFields = state.fields[moduleName];
      if (!moduleFields) return [];
      return Object.keys(moduleFields).filter(
        fieldName => moduleFields[fieldName].edit
      );
    },

    /**
     * Check if module should be shown in navigation
     */
    shouldShowModule: (state) => (moduleName) => {
      return state.modules[moduleName]?.view || false;
    }
  },

  actions: {
    /**
     * Load user permissions from backend
     */
    async loadPermissions() {
      if (this.loading) return;
      
      this.loading = true;
      try {
        const response = await axios.get('/api/profiles/my-permissions');
        this.modules = response.data.modules || {};
        this.fields = response.data.fields || {};
        this.loaded = true;
      } catch (error) {
        console.error('Failed to load permissions:', error);
        // Set empty permissions on error
        this.modules = {};
        this.fields = {};
      } finally {
        this.loading = false;
      }
    },

    /**
     * Clear permissions (on logout)
     */
    clearPermissions() {
      this.modules = {};
      this.fields = {};
      this.loaded = false;
    },

    /**
     * Filter object fields based on view permissions
     */
    filterViewableFields(moduleName, data) {
      if (!this.fields[moduleName]) return data;

      const filtered = {};
      Object.keys(data).forEach(key => {
        if (this.canViewField(moduleName, key)) {
          filtered[key] = data[key];
        }
      });

      return filtered;
    },

    /**
     * Get field permission info for form rendering
     */
    getFieldPermission(moduleName, fieldName) {
      const moduleFields = this.fields[moduleName];
      if (!moduleFields || !moduleFields[fieldName]) {
        return { visible: false, editable: false };
      }

      return {
        visible: moduleFields[fieldName].view || false,
        editable: moduleFields[fieldName].edit || false
      };
    }
  }
});
