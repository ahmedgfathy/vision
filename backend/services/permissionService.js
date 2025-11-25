const { Profile, ProfileModule, ProfileField } = require('../models/Profile');
const db = require('../config/db');

// Define all available modules in the system
const AVAILABLE_MODULES = [
  'properties',
  'owner_info',
  'update_info',
  'more_info',
  'gallery',
  'leads',
  'agents',
  'companies',
  'tasks',
  'dropdown_management',
  'users',
  'profiles',
  'permissions',
  'audit_logs',
  'reminders',
  'activities',
  'dashboard'
];

// Define field mappings for each module
const MODULE_FIELDS = {
  properties: [
    'unit_for', 'area_id', 'type_id', 'finished', 'building', 'bedrooms', 'bathrooms',
    'parking_spaces', 'total_price', 'unit_no', 'more_units', 'description',
    'furnished', 'has_pool', 'has_gym', 'has_security', 'has_garden', 'has_balcony', 'has_elevator'
  ],
  owner_info: [
    'offered_by', 'update_state', 'owner_name', 'mobile', 'tel', 'last_follow_in',
    'call_update', 'new_feedback', 'call_note'
  ],
  update_info: [
    'reminder_time', 'rent_to', 'reminder_date', 'repeated_statement'
  ],
  more_info: [
    'property_name', 'handler_id', 'phase', 'latitude', 'longitude'
  ],
  leads: [
    'name', 'email', 'mobile', 'source', 'status', 'notes', 'assigned_to'
  ],
  agents: [
    'name', 'email', 'mobile', 'status', 'commission_rate'
  ],
  companies: [
    'name', 'email', 'phone', 'address', 'status'
  ],
  tasks: [
    'title', 'description', 'assigned_to', 'due_date', 'priority', 'status'
  ]
};

class PermissionService {
  /**
   * Get user's full permissions (modules + fields)
   */
  static async getUserPermissions(userId) {
    const [users] = await db.execute(
      'SELECT profile_id FROM users WHERE id = ?',
      [userId]
    );

    if (!users.length || !users[0].profile_id) {
      return { modules: {}, fields: {} };
    }

    const profileId = users[0].profile_id;
    const modules = await ProfileModule.getByProfile(profileId);
    const fields = await ProfileField.getByProfile(profileId);

    // Convert to easy-to-use format
    const modulePermissions = {};
    modules.forEach(m => {
      modulePermissions[m.module_name] = {
        view: m.permission_view,
        create: m.permission_create,
        edit: m.permission_edit,
        delete: m.permission_delete
      };
    });

    const fieldPermissions = {};
    fields.forEach(f => {
      if (!fieldPermissions[f.module_name]) {
        fieldPermissions[f.module_name] = {};
      }
      fieldPermissions[f.module_name][f.field_name] = {
        view: f.can_view,
        edit: f.can_edit
      };
    });

    return {
      modules: modulePermissions,
      fields: fieldPermissions
    };
  }

  /**
   * Check if user has module permission
   */
  static hasModulePermission(userPermissions, moduleName, action) {
    const modulePerms = userPermissions.modules[moduleName];
    if (!modulePerms) return false;

    switch (action) {
      case 'view':
        return modulePerms.view;
      case 'create':
        return modulePerms.create;
      case 'edit':
        return modulePerms.edit;
      case 'delete':
        return modulePerms.delete;
      default:
        return false;
    }
  }

  /**
   * Check if user can view a field
   */
  static canViewField(userPermissions, moduleName, fieldName) {
    const moduleFields = userPermissions.fields[moduleName];
    if (!moduleFields || !moduleFields[fieldName]) return false;
    return moduleFields[fieldName].view;
  }

  /**
   * Check if user can edit a field
   */
  static canEditField(userPermissions, moduleName, fieldName) {
    const moduleFields = userPermissions.fields[moduleName];
    if (!moduleFields || !moduleFields[fieldName]) return false;
    return moduleFields[fieldName].edit;
  }

  /**
   * Filter object fields based on user permissions
   */
  static filterFields(userPermissions, moduleName, data) {
    if (!userPermissions.fields[moduleName]) return data;

    const filtered = {};
    Object.keys(data).forEach(key => {
      if (this.canViewField(userPermissions, moduleName, key)) {
        filtered[key] = data[key];
      }
    });

    return filtered;
  }

  /**
   * Validate field edits based on permissions
   */
  static validateFieldEdits(userPermissions, moduleName, updates) {
    const errors = [];
    
    Object.keys(updates).forEach(fieldName => {
      if (!this.canEditField(userPermissions, moduleName, fieldName)) {
        errors.push(`You don't have permission to edit field: ${fieldName}`);
      }
    });

    return errors;
  }

  /**
   * Get available modules list
   */
  static getAvailableModules() {
    return AVAILABLE_MODULES;
  }

  /**
   * Get fields for a module
   */
  static getModuleFields(moduleName) {
    return MODULE_FIELDS[moduleName] || [];
  }

  /**
   * Get all module fields mapping
   */
  static getAllModuleFields() {
    return MODULE_FIELDS;
  }
}

module.exports = PermissionService;
