const { Profile, ProfileModule, ProfileField } = require('../models/Profile');
const PermissionService = require('../services/permissionService');
const AuditLogService = require('../services/auditLogService');

class ProfileController {
  // Get all profiles
  static async getAll(req, res) {
    try {
      const profiles = await Profile.findAll();
      res.json(profiles);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      res.status(500).json({ error: 'Failed to fetch profiles' });
    }
  }

  // Get profile by ID with permissions
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const profile = await Profile.getWithPermissions(id);
      
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      res.json(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  // Create new profile
  static async create(req, res) {
    try {
      const { name, description, is_active } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Profile name is required' });
      }

      const profileId = await Profile.create({ name, description, is_active });

      await AuditLogService.log({
        user_id: req.user.id,
        action: 'create',
        module: 'profiles',
        record_id: profileId,
        details: `Created profile: ${name}`
      });

      res.status(201).json({ id: profileId, message: 'Profile created successfully' });
    } catch (error) {
      console.error('Error creating profile:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Profile name already exists' });
      }
      res.status(500).json({ error: 'Failed to create profile' });
    }
  }

  // Update profile
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, is_active } = req.body;

      const profile = await Profile.findById(id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      await Profile.update(id, { name, description, is_active });

      await AuditLogService.log({
        user_id: req.user.id,
        action: 'update',
        module: 'profiles',
        record_id: id,
        details: `Updated profile: ${name}`
      });

      res.json({ message: 'Profile updated successfully' });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  // Delete profile
  static async delete(req, res) {
    try {
      const { id } = req.params;

      const profile = await Profile.findById(id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      await Profile.delete(id);

      await AuditLogService.log({
        user_id: req.user.id,
        action: 'delete',
        module: 'profiles',
        record_id: id,
        details: `Deleted profile: ${profile.name}`
      });

      res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
      console.error('Error deleting profile:', error);
      res.status(500).json({ error: 'Failed to delete profile' });
    }
  }

  // Set module permissions for profile
  static async setModulePermissions(req, res) {
    try {
      const { id } = req.params;
      const { modules } = req.body; // Array of { module_name, permission_view, permission_create, permission_edit, permission_delete }

      const profile = await Profile.findById(id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      // Delete existing module permissions
      await ProfileModule.deleteByProfile(id);

      // Insert new permissions
      for (const module of modules) {
        await ProfileModule.upsert(id, module.module_name, {
          permission_view: module.permission_view || false,
          permission_create: module.permission_create || false,
          permission_edit: module.permission_edit || false,
          permission_delete: module.permission_delete || false
        });
      }

      await AuditLogService.log({
        user_id: req.user.id,
        action: 'update',
        module: 'profiles',
        record_id: id,
        details: `Updated module permissions for profile: ${profile.name}`
      });

      res.json({ message: 'Module permissions updated successfully' });
    } catch (error) {
      console.error('Error setting module permissions:', error);
      res.status(500).json({ error: 'Failed to set module permissions' });
    }
  }

  // Set field permissions for profile
  static async setFieldPermissions(req, res) {
    try {
      const { id } = req.params;
      const { fields } = req.body; // Array of { module_name, field_name, can_view, can_edit }

      const profile = await Profile.findById(id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }

      // Delete existing field permissions
      await ProfileField.deleteByProfile(id);

      // Insert new permissions
      for (const field of fields) {
        await ProfileField.upsert(id, field.module_name, field.field_name, {
          can_view: field.can_view || false,
          can_edit: field.can_edit || false
        });
      }

      await AuditLogService.log({
        user_id: req.user.id,
        action: 'update',
        module: 'profiles',
        record_id: id,
        details: `Updated field permissions for profile: ${profile.name}`
      });

      res.json({ message: 'Field permissions updated successfully' });
    } catch (error) {
      console.error('Error setting field permissions:', error);
      res.status(500).json({ error: 'Failed to set field permissions' });
    }
  }

  // Get available modules and fields
  static async getAvailableModulesAndFields(req, res) {
    try {
      const modules = PermissionService.getAvailableModules();
      const fields = PermissionService.getAllModuleFields();

      res.json({ modules, fields });
    } catch (error) {
      console.error('Error fetching modules and fields:', error);
      res.status(500).json({ error: 'Failed to fetch modules and fields' });
    }
  }

  // Get current user's permissions
  static async getMyPermissions(req, res) {
    try {
      const permissions = await PermissionService.getUserPermissions(req.user.id);
      res.json(permissions);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      res.status(500).json({ error: 'Failed to fetch permissions' });
    }
  }
}

module.exports = ProfileController;
