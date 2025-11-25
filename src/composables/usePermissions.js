import { usePermissionStore } from '@/stores/permissions';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

/**
 * Composable for checking permissions in Vue components
 * 
 * @example
 * const { canView, canCreate, canEdit, canDelete, canViewField, canEditField, isAdmin } = usePermissions();
 * 
 * if (canCreate('properties')) {
 *   // Show create button
 * }
 * 
 * if (canViewField('properties', 'total_price')) {
 *   // Show field
 * }
 */
export function usePermissions() {
  const permissionStore = usePermissionStore();
  const authStore = useAuthStore();

  const isAdmin = computed(() => authStore.user?.role === 'admin');

  /**
   * Check if user can view a module
   */
  const canView = (moduleName) => {
    if (isAdmin.value) return true;
    return permissionStore.hasModulePermission(moduleName, 'view');
  };

  /**
   * Check if user can create in a module
   */
  const canCreate = (moduleName) => {
    if (isAdmin.value) return true;
    return permissionStore.hasModulePermission(moduleName, 'create');
  };

  /**
   * Check if user can edit in a module
   */
  const canEdit = (moduleName) => {
    if (isAdmin.value) return true;
    return permissionStore.hasModulePermission(moduleName, 'edit');
  };

  /**
   * Check if user can delete in a module
   */
  const canDelete = (moduleName) => {
    if (isAdmin.value) return true;
    return permissionStore.hasModulePermission(moduleName, 'delete');
  };

  /**
   * Check if user can view a specific field
   */
  const canViewField = (moduleName, fieldName) => {
    if (isAdmin.value) return true;
    return permissionStore.canViewField(moduleName, fieldName);
  };

  /**
   * Check if user can edit a specific field
   */
  const canEditField = (moduleName, fieldName) => {
    if (isAdmin.value) return true;
    return permissionStore.canEditField(moduleName, fieldName);
  };

  /**
   * Get field permission info (visible and editable)
   */
  const getFieldPermission = (moduleName, fieldName) => {
    if (isAdmin.value) {
      return { visible: true, editable: true };
    }
    return permissionStore.getFieldPermission(moduleName, fieldName);
  };

  /**
   * Check if any module permission exists
   */
  const hasAnyPermission = (moduleName) => {
    if (isAdmin.value) return true;
    return canView(moduleName) || canCreate(moduleName) || canEdit(moduleName) || canDelete(moduleName);
  };

  /**
   * Get list of visible modules
   */
  const visibleModules = computed(() => {
    if (isAdmin.value) {
      return ['dashboard', 'properties', 'leads', 'agents', 'companies', 'tasks', 'settings'];
    }
    return permissionStore.visibleModules;
  });

  /**
   * Get list of visible fields for a module
   */
  const visibleFields = (moduleName) => {
    if (isAdmin.value) return [];
    return permissionStore.visibleFields(moduleName);
  };

  /**
   * Get list of editable fields for a module
   */
  const editableFields = (moduleName) => {
    if (isAdmin.value) return [];
    return permissionStore.editableFields(moduleName);
  };

  return {
    // Module permissions
    canView,
    canCreate,
    canEdit,
    canDelete,
    hasAnyPermission,
    
    // Field permissions
    canViewField,
    canEditField,
    getFieldPermission,
    
    // Lists
    visibleModules,
    visibleFields,
    editableFields,
    
    // User info
    isAdmin
  };
}
