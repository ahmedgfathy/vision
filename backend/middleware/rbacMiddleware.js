const PermissionService = require('../services/permissionService');
const AuditLogService = require('../services/auditLogService');

/**
 * Middleware to check module-level permissions
 * Usage: checkModulePermission('properties', 'view')
 */
function checkModulePermission(moduleName, action) {
  return async (req, res, next) => {
    try {
      // Admin bypass (role = 'admin')
      if (req.user.role === 'admin') {
        return next();
      }

      // Get user permissions
      const permissions = await PermissionService.getUserPermissions(req.user.id);

      // Check if user has the required permission
      if (!PermissionService.hasModulePermission(permissions, moduleName, action)) {
        // Log denied access
        await AuditLogService.log({
          user_id: req.user.id,
          action: 'access_denied',
          module: moduleName,
          details: `Attempted ${action} on ${moduleName} without permission`
        });

        return res.status(403).json({ 
          error: 'Access denied',
          message: `You don't have permission to ${action} ${moduleName}` 
        });
      }

      // Attach permissions to request for later use
      req.userPermissions = permissions;
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
}

/**
 * Middleware to filter response fields based on field-level permissions
 * Usage: filterResponseFields('properties')
 */
function filterResponseFields(moduleName) {
  return async (req, res, next) => {
    try {
      // Admin bypass
      if (req.user.role === 'admin') {
        return next();
      }

      // Get permissions if not already attached
      if (!req.userPermissions) {
        req.userPermissions = await PermissionService.getUserPermissions(req.user.id);
      }

      // Store original json method
      const originalJson = res.json.bind(res);

      // Override json method to filter fields
      res.json = function(data) {
        if (data && typeof data === 'object') {
          // Handle array of objects
          if (Array.isArray(data)) {
            data = data.map(item => 
              PermissionService.filterFields(req.userPermissions, moduleName, item)
            );
          }
          // Handle single object (exclude pagination meta)
          else if (!data.pagination && !data.error && !data.message) {
            data = PermissionService.filterFields(req.userPermissions, moduleName, data);
          }
          // Handle response with data property
          else if (data.data) {
            if (Array.isArray(data.data)) {
              data.data = data.data.map(item => 
                PermissionService.filterFields(req.userPermissions, moduleName, item)
              );
            } else {
              data.data = PermissionService.filterFields(req.userPermissions, moduleName, data.data);
            }
          }
        }
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Field filtering error:', error);
      next(error);
    }
  };
}

/**
 * Middleware to validate field edits based on permissions
 * Usage: validateFieldEdits('properties')
 */
function validateFieldEdits(moduleName) {
  return async (req, res, next) => {
    try {
      // Admin bypass
      if (req.user.role === 'admin') {
        return next();
      }

      // Get permissions if not already attached
      if (!req.userPermissions) {
        req.userPermissions = await PermissionService.getUserPermissions(req.user.id);
      }

      // Validate field edits
      const errors = PermissionService.validateFieldEdits(
        req.userPermissions,
        moduleName,
        req.body
      );

      if (errors.length > 0) {
        // Log denied field edit
        await AuditLogService.log({
          user_id: req.user.id,
          action: 'field_edit_denied',
          module: moduleName,
          details: `Attempted to edit restricted fields: ${errors.join(', ')}`
        });

        return res.status(403).json({ 
          error: 'Field edit denied',
          details: errors 
        });
      }

      next();
    } catch (error) {
      console.error('Field validation error:', error);
      res.status(500).json({ error: 'Field validation failed' });
    }
  };
}

/**
 * Middleware to attach user permissions to request
 */
async function attachPermissions(req, res, next) {
  try {
    if (req.user && !req.userPermissions) {
      req.userPermissions = await PermissionService.getUserPermissions(req.user.id);
    }
    next();
  } catch (error) {
    console.error('Error attaching permissions:', error);
    next(error);
  }
}

module.exports = {
  checkModulePermission,
  filterResponseFields,
  validateFieldEdits,
  attachPermissions
};
